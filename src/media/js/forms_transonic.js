define('forms_transonic',
    ['app_selector', 'defer', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'requests', 'settings', 'storage', 'urls', 'utils', 'z'],
    function(app_select, defer, $, fakefilefield, l10n, log, requests, settings, storage, urls, utils, z) {
    'use strict';

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

        // Post FeedApp.
        var def = defer.Deferred();
        var $file_input = $form.find('[name="background-image-feed-banner"]');
        save_feed_app(feedapp_data, slug).done(function(feed_app) {
            if ($file_input.val()) {
                // Upload background image if one was uploaded.
                upload_feed_app_image(feed_app, $file_input).done(function(feed_image) {
                    def.resolve(feed_app);
                }).fail(function(error) {
                    def.reject(error);
                });
            } else {
                // If no background image selected, just finish.
                def.resolve(feed_app);
            }
        }).fail(function(xhr, text, status, res) {
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

        var def = defer.Deferred();
        save_collection(collection_data, slug).done(function(collection) {
            var apps_added = 0;
            var $apps = $('.apps-widget .result');

            $apps.each(function(i, app) {
                // TODO: batch adds.
                add_app_to_collection(collection.id, app.getAttribute('data-id')).done(function() {
                    if (++apps_added >= $apps.length) {
                        def.resolve(collection);
                    }
                });
            });
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

    return {
        create_update_featured_app: create_update_featured_app,
        create_collection: create_collection
    };
});
