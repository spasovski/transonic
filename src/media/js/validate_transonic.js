define('validate_transonic',
    ['defer', 'feed', 'jquery', 'l10n', 'underscore', 'utils_local',],
    function(defer, feed, $, l10n, _, utils_local) {
    'use strict';
    var gettext = l10n.gettext;

    var feed_app = function(data, $file_input, $preview) {
        var errs = [];
        if (!data.app) {
            errs.push(gettext('App is required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
        } else if (!validate_slug(data.slug)) {
            errs.push(gettext('Slug is invalid.'));
        }
        if (!$file_input.val().length &&
            data.type == feed.FEEDAPP_IMAGE &&
            !$preview.attr('src')) {
            errs.push(gettext('Background image is required.'));
        }
        if (!validate_localized_field(data.description) &&
            data.type == feed.FEEDAPP_DESC) {
            errs.push(gettext('Description is required.'));
        }
        if (!data.preview &&
            data.type == feed.FEEDAPP_PREVIEW) {
            errs.push(gettext('Preview is required.'));
        }
        if (!validate_localized_field(data.pullquote_text) &&
            data.type == feed.FEEDAPP_QUOTE) {
            errs.push(gettext('Quote text is required.'));
        }
        if (!validate_localized_field(data.pullquote_text) &&
            data.type != feed.FEEDAPP_QUOTE &&
            (data.pullquote_rating || data.pullquote_attribution)) {
            errs.push(gettext('Quote text is required if quote rating or quote attribution is set.'));
        }
        return errs;
    };

    var collection = function(data, $file_input, $preview) {
        var errs = [];
        if (!data.apps.length) {
            errs.push(gettext('Apps are required.'));
        }
        if (!validate_localized_field(data.name)) {
            errs.push(gettext('Name is required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
        } else if (!validate_slug(data.slug)) {
            errs.push(gettext('Slug is invalid.'));
        }
        if (!$file_input.val().length &&
            data.type == feed.COLL_PROMO &&
            !$preview.attr('src')) {
            errs.push(gettext('Background image is required.'));
        }
        return errs;
    };

    var brand = function(data) {
        var errs = [];
        if (!data.apps.length) {
            errs.push(gettext('Apps are required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
        } else if (!validate_slug(data.slug)) {
            errs.push(gettext('Slug is invalid.'));
        }
        return errs;
    };

    var shelf = function(data, $file_input, $preview) {
        var errs = [];
        if (!data.apps.length) {
            errs.push(gettext('Apps are required.'));
        }
        if (!data.carrier) {
            errs.push(gettext('Carrier is required.'));
        }
        if (!data.region) {
            errs.push(gettext('Region is required.'));
        }
        if (!validate_localized_field(data.name)) {
            errs.push(gettext('Name is required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
        } else if (!validate_slug(data.slug)) {
            errs.push(gettext('Slug is invalid.'));
        }
        if (!$file_input.val().length && !$preview.attr('src')) {
            errs.push(gettext('Background image is required.'));
        }
        return errs;
    };

    var feed_items = function(data) {
        var errs = [];
        return errs;
    };

    var app_group = function($items) {
        var errs = [];
        if (!$items.filter('.result:not(.app-group)').length) {
            // Check that it's not just app groups.
            errs.push(gettext('Apps are required.'));
        }
        if (!$items.eq(0).hasClass('app-group')) {
            // Check that app groups have no orphans.
            errs.push(gettext('Some apps are oprhaned and are not under a group.'));
        }
        if ($items.closest('.apps-widget').find('.app-group + .app-group, .app-group:last-child').length) {
            // Check that there are no empty groups.
            errs.push(gettext('Some groups are empty and do not contain any apps.'));
        }

        var app_groups = [];
        $items.filter('.app-group').each(function(i, group) {
            // Check that app groups have a name.
            // It's a dynamically-generated l10n field so we have to pull the name and build the l10n object.
            var $group = $(group);
            var data = utils_local.build_localized_field($group.find('input').data('name'));
            app_groups.push(JSON.stringify(data));
            if (!validate_localized_field(data)) {
                errs.push(gettext('App group name is required.'));
                return false;
            }
        });

        for (var i = 0; i < app_groups.length; i++) {
            // Check no duplicate group names.
            if (app_groups.indexOf(app_groups[i]) !== i) {
                errs.push(gettext('Duplicate group names are not allowed.'));
                break;
            }
        }

        return errs;
    };

    function image($file_input) {
        // Check if image is JPG/PNG.
        if ($file_input.val()) {
            if (!$file_input[0].files[0].name.match(/\.(jpg|jpeg|png)$/)) {
                return [gettext('Uploaded image must be in JPG/PNG format.')];
            }
        }
        return [];
    }

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
        image: image
    };
});

