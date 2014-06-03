define('views/create',
    ['fields_transonic', 'forms_transonic', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'urls', 'utils', 'z'],
    function(fields_transonic, forms_transonic, $, fakefilefield, l10n, log, notification, requests, settings, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('click', '.transonic-form .submit', utils._pd(function(e) {
        var $form = $(this).closest('form');

        if ($form.data('type') == 'apps') {
            forms_transonic.create_featured_app($form).done(function(feed_element) {
                z.page.trigger('navigate', [urls.reverse('edit', ['apps', feed_element.slug])]);
                notification.notification({message: gettext('Featured app successfully created')});
            }).fail(function(error) {
                notification.notification({message: error});
            });
        }
    }));

    return function(builder, args) {
        var feedType = args[0];

        var title;
        if (feedType == 'apps') {
            title = gettext('Custom Featured Apps');
        } else if (feedType == 'collections') {
            title = gettext('Collections and Articles');
        } else if (feedType == 'editorial') {
            title = gettext('Editorial Brands');
        }

        builder.z('title', title);
        builder.z('type', feedType);
        builder.start('create/' + feedType + '.html', {
            'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
            'quote_mock': [
                {'id': 0, 'body': 'A++'},
                {'id': 1, 'body': 'is so cool!'},
                {'id': 2, 'body': 'flappy bird but better'},
            ],
            'title': title,
        }).done(function() {
            $('.fileinput').fakeFileField();
        });
    };
});
