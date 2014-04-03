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
        // Created featured app (collection with single app).
        var type = $form.find('.featured-type-choices input:checked').val();

        // Create feed app.
        var app_data = {
            app: $form.find('[name="app"]').val(),
        };
        if (['description'].indexOf(type) !== -1) {
            app_data['description'] =  build_localized_field('description');
        }

        var def = defer.Deferred();
        create_feed_app(app_data).done(function(feed_app) {
            // Create collection.
            var col_data = {
                author: require('storage').getItem('settings').display_name,
                description: 'TODO: WHAT TO PUT HERE?',
                name: feed_app.app.name,
                collection_type: settings.collection_types['featured_app'],
                slug: $form.find('[name="slug"]').val(),
            };
            if (['icon', 'background-image', 'quote', 'screenshot'].indexOf(type) !== -1) {
                col_data['background_color'] = $form.find('.bg-color input:checked').val();
            }
            if (['description'].indexOf(type) !== -1) {
                col_data['description'] = build_localized_field('description');
            }

            create_collection(col_data).done(function(collection) {
                // Create feed item using newly created feed app and collection.
                create_feed_item(collection.id, feed_app.id).done(function(feed_item) {
                    def.resolve(feed_item);
                });
            });
        });

        return def;
    };

    function create_collection(data) {
        // Validate collection data and send create request.
        return requests.post(urls.api.url('collections'), data);
    }

    function create_feed_app(data) {
        // Validate feed app data and send create request.
        return requests.post(urls.api.url('feed-apps'), data);
    }

    function create_feed_item(collection_id, feed_app_id) {
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
