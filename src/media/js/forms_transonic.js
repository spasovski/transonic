define('forms_transonic',
    ['app_selector', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'requests', 'settings', 'urls', 'utils', 'z'],
    function(app_select, $, fakefilefield, l10n, log, requests, settings, urls, utils, z) {
    'use strict';

    function build_localized_field(name) {
        var data = {};
        $('.localized[data-name="' + name + '"').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    }

    var create_featured_app = function($form) {
        // Create feed app.
        var data = {
            'app': $form.find('[name="app"]').val(),
            'description': build_localized_field('description')
        };
        return data;
    };

    return {
        create_featured_app: create_featured_app
    };
});
