define('forms_transonic',
    ['app_selector', 'defer', 'feed', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'nunjucks', 'requests', 'storage', 'urls', 'utils', 'utils_local', 'validate_transonic', 'z'],
    function(app_select, defer, feed, $, fakefilefield, l10n, log, notification, nunjucks, requests, storage, urls, utils, utils_local, validate, z) {
    'use strict';
    var gettext = l10n.gettext;

    var feed_app = function($form, slug) {
        /* Create or update FeedApp. */
        // Gather data.
        var data = {
            app: $form.find('[name="app"]').val(),
            background_color: $form.find('.bg-color input:checked').val(),
            description: utils_local.build_localized_field('description'),
            feedapp_type: $form.find('.featured-type-choices input:checked').val(),
            preview: $form.find('.screenshot li.selected').data('id'),
            pullquote_attribution: $form.find('[name="pq-attribution"]').val(),
            pullquote_rating: $form.find('.pq-rating input:checked').val(),
            pullquote_text: utils_local.build_localized_field('pq-text'),
            slug: $form.find('[name="slug"]').val(),
        };
        var $file_input = $form.find('[name="background-image-feed-banner"]');
        console.log(data);

        // Validate.
        var errors = validate.feed_app(data, $file_input);
        if (errors.length) {
            render_errors(errors);
            return defer.Deferred().reject(gettext('Sorry, we found some errors in the form.'));
        }

        return save_feed_app(data, slug, $file_input);
    };

    var collection = function($form, slug) {
        /* Create or update FeedCollection. */
        // Check for app groups first.
        var $items = $('.apps-widget .result');
        var type = $form.find('.collection-type-choices input:checked').val();
        var is_grouped = type == feed.COLL_PROMO && $items.filter('.app-group').length;

        // Gather data.
        var data = {
            apps: is_grouped ? get_app_groups($items) : get_app_ids($items),
            background_color: $form.find('.bg-color input:checked').val(),
            type: type,
            description: utils_local.build_localized_field('description'),
            name: utils_local.build_localized_field('name'),
            slug: $form.find('[name="slug"]').val(),
        };
        var $file_input = $form.find('[name="background-image-feed-banner"]');
        console.log(data);

        // Validate.
        var errors = is_grouped ? validate.app_group($items) : [];
        errors = errors.concat(validate.collection(data, $file_input));
        if (errors.length) {
            render_errors(errors);
            return defer.Deferred().reject(gettext('Sorry, we found some errors in the form.'));
        }

        return save_collection(data, slug);
    };

    var brand = function($form, slug) {
        /* Create or update FeedBrand. */
        // Gather data.
        var data = {
            apps: get_app_ids($('.apps-widget .result')),
            layout: $form.find('[name="layout"]').val(),
            type: $form.find('[name="type"]').val(),
            slug: $form.find('[name="slug"]').val(),
        };
        console.log(data);

        // Validate.
        var errors = validate.brand(data);
        if (errors.length) {
            render_errors(errors);
            return defer.Deferred().reject(gettext('Sorry, we found some errors in the form.'));
        }

        return save_brand(data, slug);
    };

    function save_feed_app(data, slug, $file_input) {
        // Post FeedApp.
        var def = defer.Deferred();

        function success(feed_app) {
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
        }

        function fail(xhr) {
            def.reject(xhr.responseText);
        }

        if (slug) {
            // Update.
            requests.put(urls.api.url('feed-app', [slug]), data).then(success, fail);
        } else {
            // Create.
            requests.post(urls.api.url('feed-apps'), data).then(success, fail);
        }

        return def.promise();
    }

    function save_collection(data, slug) {
        var def = defer.Deferred();

        function success(collection) {
            def.resolve(collection);
        }

        function fail(xhr) {
            def.reject(xhr.responseText);
        }

        if (slug) {
            // Update.
            requests.put(urls.api.url('collection', [slug]), data).then(success, fail);
        } else {
            // Create.
            requests.post(urls.api.url('collections'), data).then(success, fail);
        }

        return def.promise();
    }

    function save_brand(data, slug) {
        var def = defer.Deferred();

        function success(brand) {
            def.resolve(brand);
        }

        function fail(xhr) {
            def.reject(xhr.responseText);
        }

        if (slug) {
            // Update.
            requests.put(urls.api.url('feed-brand', [slug]), data).then(success, fail);
        } else {
            // Create.
            requests.post(urls.api.url('feed-brands'), data).then(success, fail);
        }

        return def.promise();
    }

    function get_app_ids($items) {
        // Return a list of app IDs.
        return $.map($items.filter(':not(.app-group)'), function(app) {
            return parseInt(app.getAttribute('data-id'), 10);
        });
    }

    function get_app_groups($items) {
        // If it is a promo collection with app groupings, create an array of objects by group.
        var apps = [];
        $items.filter('.app-group').each(function(i, app_group) {
            var $app_group = $(app_group);
            var group = {
                name: utils_local.build_localized_field($app_group.find('input').data('name')),
                apps: []
            };

            var $next = $app_group.next();
            while ($next.length && !$next.hasClass('.app-group')) {
                // Append apps until we get to the next group.
                group.apps.push(parseInt($next.data('id'), 10));
                $next = $next.next();
            }

            apps.push(group);
        });

        return apps;
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
        brand: brand,
        collection: collection,
        feed_app: feed_app,
    };
});
