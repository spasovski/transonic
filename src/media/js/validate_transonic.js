define('validate_transonic',
    ['defer', 'jquery', 'l10n', 'settings'],
    function(defer, $, l10n, settings) {
    'use strict';
    var gettext = l10n.gettext;

    var featured_app = function(data, $file_input) {
        var errs = [];
        if (!data.app) {
            errs.push(gettext('App is required.'));
        }
        if (!$file_input.val().length &&
            [settings.FEEDAPP_TYPE_IMAGE].indexOf(data.feedapp_type) !== -1) {
            if (data.feedapp_type == settings.FEEDAPP_TYPE_IMAGE) {
                errs.push(gettext('Background image is required.'));
            }
        }
        if (!validate_localized_field(data.description) &&
            [settings.FEEDAPP_TYPE_DESC].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Description is required.'));
        }
        if (!data.preview &&
            [settings.FEEDAPP_TYPE_PREVIEW].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Preview is required.'));
        }
        if (!validate_localized_field(data.pullquote_text) &&
            [settings.FEEDAPP_TYPE_QUOTE].indexOf(data.feedapp_type) !== -1) {
            errs.push(gettext('Quote text is required.'));
        }
        if (!data.slug) {
            errs.push(gettext('Slug is required.'));
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

    return {
        featured_app: featured_app
    };
});

