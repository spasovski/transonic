define('forms_transonic',
    ['app_selector', 'defer', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'nunjucks', 'requests', 'settings', 'storage', 'urls', 'utils', 'validate_transonic', 'z'],
    function(app_select, defer, $, fakefilefield, l10n, log, notification, nunjucks, requests, settings, storage, urls, utils, validate, z) {
    'use strict';
    var gettext = l10n.gettext;

    function build_localized_field(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    }

    var create_update_featured_app = function($form, slug) {
        // Create or update FeedApp. If pass in slug, then it's update.
        var feedapp_data = {
            app: $form.find('[name="app"]').val(),
            background_color: $form.find('.bg-color input:checked').val(),
            description: build_localized_field('description'),
            feedapp_type: $form.find('.featured-type-choices input:checked').val(),
            preview: $form.find('.screenshot li.selected').data('id'),
            pullquote_attribution: $form.find('[name="pq-attribution"]').val(),
            pullquote_rating: $form.find('.pq-rating input:checked').val(),
            pullquote_text: build_localized_field('pq-text'),
            slug: $form.find('[name="slug"]').val(),
        };
        var $file_input = $form.find('[name="background-image-feed-banner"]');

        // Validate.
        var def = defer.Deferred();
        var errors = validate.featured_app(feedapp_data, $file_input);
        if (errors.length) {
            render_errors(errors);
            return def.reject(gettext('Sorry, we found some errors in the form.'));
        }

        // Post FeedApp.
        save_feed_app(feedapp_data, $file_input, slug).done(function(feed_app) {
            // Upload background image if needed.
            if ($file_input.val()) {
                upload_feed_app_image(feed_app, $file_input).done(function(feed_image) {
                    def.resolve(feed_app);
                }).fail(function(error) {
                    def.reject(error);
                });
            } else {
                def.resolve(feed_app);
            }
        }).fail(function(xhr) {
            def.reject(xhr.responseText);
        });

        return def.promise();
    };

    var create_collection = function($form, slug) {
        // Create Feed Collection.
        var collection_data = {
            background_color: $form.find('.bg-color input:checked').val(),
            collection_type: settings.COLL_SLUGS[$form.find('.collection-type-choices input:checked').val()],
            description: build_localized_field('description'),
            is_public: true,  // TODO: remove.
            name: build_localized_field('name'),
            slug: $form.find('[name="slug"]').val(),
        };
        var $file_input = $form.find('[name="background-image-feed-banner"]');
        var $apps = $('.apps-widget .result');

        // Validate.
        var def = defer.Deferred();
        var errors = validate.collection(collection_data, $file_input, $apps);
        if (errors.length) {
            render_errors(errors);
            return def.reject(gettext('Sorry, we found some errors in the form.'));
        }

        // Post collection.
        save_collection(collection_data, $file_input, $apps, slug).done(function(collection) {
            // Add apps.
            var apps_added = 0;
            $apps.each(function(i, app) {
                add_app_to_collection(collection.id, app.getAttribute('data-id')).done(function() {
                    // TODO: batch adds.
                    if (++apps_added >= $apps.length) {
                        def.resolve(collection);
                    }
                });
            });
        }).fail(function(err) {
            if (!err) {
                def.reject(gettext('Sorry, we found some errors in the form.'));
                return;
            }
            def.reject(err.responseText);
        });

        return def.promise();
    };

    function save_feed_app(data, slug) {
        // Validate feed app data and send create request.
        if (slug) {
            // Update.
            return requests.put(urls.api.url('feed-app', [slug]), data);
        } else {
            // Create.
            return requests.post(urls.api.url('feed-apps'), data);
        }
    }

    function upload_feed_app_image(feedapp, $file_input) {
        // Upload feed app background image (header graphic).
        var def = defer.Deferred();
        var reader = new FileReader();

        reader.onloadend = function() {
            // Read from file input to data URL and send image to API upload endpoint.
            requests.put(urls.api.url('feed-app-image', [feedapp.id]), reader.result).done(function(data) {
                def.resolve(data);
            });
        };
        reader.readAsDataURL($file_input[0].files[0]);

        return def.promise();
    }

    function save_collection(data) {
        // Validate collection data and send create request.
        return requests.post(urls.api.url('collections'), data);
    }

    function add_app_to_collection(collection_id, app_id) {
        // Add app to collection.
        return requests.post(urls.api.url('collections-add-app', [collection_id]),
                             {app: app_id});
    }

    function save_feed_item(collection_id, feed_app_id) {
        // Validate feed app data and send create request.
        return requests.post(urls.api.url('feed-items'), {
            app: feed_app_id,
            collection: collection_id,
        });
    }

    function render_errors(errors) {
        $('.submit .form-errors').html(nunjucks.env.render('errors/form_errors.html', {
            errors: errors
        }));
    }

    return {
        create_update_featured_app: create_update_featured_app,
        create_collection: create_collection
    };
});
