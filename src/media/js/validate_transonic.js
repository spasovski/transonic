define('validate_transonic',
    ['defer', 'feed', 'jquery', 'l10n', 'utils_local',],
    function(defer, feed, $, l10n, utils_local) {
    'use strict';
    var gettext = l10n.gettext;

    var feed_app = function(data, $file_input) {
        var errs = [];
        if (!data.app) {
            errs.push(gettext('App is required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
        }
        if (!$file_input.val().length &&
            [feed.FEEDAPP_IMAGE].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Background image is required.'));
        }
        if (!validate_localized_field(data.description) &&
            [feed.FEEDAPP_DESC].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Description is required.'));
        }
        if (!data.preview &&
            [feed.FEEDAPP_PREVIEW].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Preview is required.'));
        }
        if (!validate_localized_field(data.pullquote_text) &&
            [feed.FEEDAPP_QUOTE].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Quote text is required.'));
        }
        return errs;
    };

    var collection = function(data, $file_input) {
        var errs = [];
        if (!data.apps.length) {
            errs.push(gettext('Apps are required.'));
        }
        if (!validate_localized_field(data.name)) {
            errs.push(gettext('Name is required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
        }
        if (!$file_input.val().length &&
            [feed.COLL_PROMO].indexOf(data.type) !== -1) {
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
        if ($items.closest('.apps-widget').find('.app-group + .app-group').length) {
            // Check that there are no empty groups.
            errs.push(gettext('Some groups are empty and do not contain any apps.'));
        }
        $items.filter('.app-group').each(function(i, group) {
            // Check that app groups have a name.
            // It's a dynamically-generated l10n field so we have to pull the name and build the l10n object.
            var $group = $(group);
            var data = utils_local.build_localized_field($group.find('input').data('name'));
            if (!validate_localized_field(data)) {
                errs.push(gettext('App group name is required.'));
                return false;
            }
        });
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

    return {
        app_group: app_group,
        brand: brand,
        collection: collection,
        feed_app: feed_app,
        feed_items: feed_items
    };
});

