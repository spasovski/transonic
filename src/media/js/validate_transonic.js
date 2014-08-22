define('validate_transonic',
    ['defer', 'feed', 'jquery', 'l10n', 'underscore', 'utils_local',],
    function(defer, feed, $, l10n, _, utils_local) {
    'use strict';
    var gettext = l10n.gettext;


    var feed_app = function(data, $preview) {
        var errs = {};
        if (!data.app) {
            errs.apps = gettext('App is required.');
        }
        if (!data.slug) {
            errs.slug = gettext('Slug is required.');
        } else if (!validate_slug(data.slug)) {
            errs.slug = gettext('App is invalid.');
        }
        if (!data.background_image_upload_url &&
            data.type == feed.FEEDAPP_IMAGE) {
            errs['background-image'] = gettext('Valid background image is required.');
        }
        if (!validate_localized_field(data.description) &&
            data.type == feed.FEEDAPP_DESC) {
            errs.description = gettext('Description is required.');
        }
        if (!data.preview &&
            data.type == feed.FEEDAPP_PREVIEW) {
            errs.preview = gettext('A screenshot is required.');
        }
        if (!validate_localized_field(data.pullquote_text) &&
            data.type == feed.FEEDAPP_QUOTE) {
            errs.pullquote_text = gettext('Quote text is required.');
        }
        if (!validate_localized_field(data.pullquote_text) &&
            data.type == feed.FEEDAPP_QUOTE &&
            (data.pullquote_rating || data.pullquote_attribution)) {
            errs.pullquote_text = gettext('Quote text is required if quote rating or quote attribution is set.');
        }
        return errs;
    };


    var collection = function(data, $preview) {
        var errs = {};
        if (!data.apps.length) {
            errs.apps = gettext('Apps are required.');
        }
        if (!validate_localized_field(data.name)) {
            errs.name = gettext('Name is required.');
        }
        if (!data.slug) {
            errs.slug = gettext('Slug is required.');
        } else if (!validate_slug(data.slug)) {
            errs.slug = gettext('App is invalid.');
        }
        return errs;
    };


    var brand = function(data) {
        var errs = {};
        if (!data.apps.length) {
            errs.apps = gettext('Apps are required.');
        }
        if (!data.slug) {
            errs.slug = gettext('Slug is required.');
        } else if (!validate_slug(data.slug)) {
            errs.slug = gettext('App is invalid.');
        }
        return errs;
    };


    var shelf = function(data, $preview) {
        var errs = {};
        if (!data.apps.length) {
            errs.apps = gettext('Apps are required.');
        }
        if (!data.carrier) {
            errs.carrier = gettext('Carrier is required.');
        }
        if (!data.region) {
            errs.region = gettext('Region is required.');
        }
        if (!validate_localized_field(data.name)) {
            errs.name = gettext('Name is required.');
        }
        if (!data.slug) {
            errs.slug = gettext('Slug is required.');
        } else if (!validate_slug(data.slug)) {
            errs.slug = gettext('App is invalid.');
        }
        if (!data.background_image_upload_url) {
            errs['background-image'] = gettext('Valid background image is required.');
        }
        return errs;
    };


    var feed_items = function(data) {
        return {};
    };


    var app_group = function($items) {
        var errs = {};
        if (!$items.filter('.result:not(.app-group)').length) {
            // Check that it's not just app groups.
            errs.apps = gettext('Apps are required.');
        }
        if (!$items.eq(0).hasClass('app-group')) {
            // Check that app groups have no orphans.
            errs.apps = gettext('Some apps are oprhaned and are not under a group.');
        }
        if ($items.closest('.apps-widget').find('.app-group + .app-group, .app-group:last-child').length) {
            // Check that there are no empty groups.
            errs.apps = gettext('Some groups are empty and do not contain any apps.');
        }
        var app_groups = [];
        $items.filter('.app-group').each(function(i, group) {
            // Check that app groups have a name.
            // It's a dynamically-generated l10n field so we have to pull the name and build the l10n object.
            var $group = $(group);
            var data = utils_local.build_localized_field($group.find('input').data('name'));
            app_groups.push(JSON.stringify(data));
            if (!validate_localized_field(data)) {
                errs.apps = gettext('Apps group names are required.');
                return false;
            }
        });
        for (var i = 0; i < app_groups.length; i++) {
            // Check no duplicate group names.
            if (app_groups.indexOf(app_groups[i]) !== i) {
                errs.apps = gettext('Duplicate group names are not allowed.');
                break;
            }
        }
        return errs;
    };


    function validate_localized_field(data) {
        /* Check if l10n object has a value for at least one language. */
        for (var lang in data) {
            if (data[lang].length) {
                return true;
            }
        }
    }

    function validate_slug(slug) {
        if (slug.match(/^[^\/<>"']+$/)) {
            return true;
        }
    }

    return {
        app_group: app_group,
        brand: brand,
        collection: collection,
        shelf: shelf,
        feed_app: feed_app,
        feed_items: feed_items,
    };
});

