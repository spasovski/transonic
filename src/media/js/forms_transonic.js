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

    var create_featured_app = function($form) {
        // Create FeedApp.
        var feedapp_data = {
            app: $form.find('[name="app"]').val(),
            background_color: $form.find('.bg-color input:checked').val(),
            description: build_localized_field('description'),
            feedapp_type: $form.find('.featured-type-choices input:checked').val(),
            slug: $form.find('[name="slug"]').val(),
        };

        // Post FeedApp.
        var def = defer.Deferred();
        var $file_input = $form.find('[name="background-image-feed-banner"]');
        save_feed_app(feedapp_data).done(function(feed_app) {
            if ($file_input.val()) {
                // Upload background image if one was uploaded.
                upload_feed_app_image(feed_app, $file_input).done(function(feed_image) {
                    def.resolve(feed_app);
                });
            } else {
                // If no background image selected, just finish.
                def.resolve(feed_app);
            }
        });

        return def.promise();
    };

    function save_collection(data) {
        // Validate collection data and send create request.
        return requests.post(urls.api.url('collections'), data);
    }

    function save_feed_app(data) {
        // Validate feed app data and send create request.
        return requests.post(urls.api.url('feed-apps'), data);
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

    function add_app_to_collection(collection_id, app_id) {
        // Add app to collection.
        return requests.post(urls.api.url('collections-add-app', [res.id]),
                             {app: app_id});
    }

    return {
        create_featured_app: create_featured_app
    };
});
