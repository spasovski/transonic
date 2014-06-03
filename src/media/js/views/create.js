define('views/create',
    ['fields_transonic', 'forms_transonic', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'urls', 'utils', 'z'],
    function(fields_transonic, forms_transonic, $, fakefilefield, l10n, log, notification, requests, settings, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('click', '.transonic-form.create button.submit', utils._pd(function(e) {
        var $form = $(this).closest('form');

        if ($form.data('type') == 'apps') {
            forms_transonic.create_update_featured_app($form).done(function(feed_element) {
                z.page.trigger('navigate', [urls.reverse('edit', ['apps', feed_element.slug])]);
                notification.notification({message: gettext('Featured app successfully created')});
            }).fail(function(error) {
                notification.notification({message: error});
            });
        } else if ($form.data('type') == 'collections') {
            forms_transonic.create_collection($form).done(function(feed_element) {
                z.page.trigger('navigate', [urls.reverse('edit', ['collections', feed_element.slug])]);
                notification.notification({message: gettext('Collection successfully created')});
            }).fail(function(error) {
                notification.notification({message: error});
            });
        }
    }));

    return function(builder, args) {
        var feedType = args[0];

        var title;
        if (feedType == 'apps') {
            title = gettext('Creating a Featured App');
        } else if (feedType == 'collections') {
            title = gettext('Creating a Collection');
        } else if (feedType == 'editorial') {
            title = gettext('Creating an Editorial Brand');
        }

        builder.z('title', title);
        builder.z('type', feedType);
        builder.start('create/' + feedType + '.html', {
            'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
            'title': title,
        }).done(function() {
            $('.fileinput').fakeFileField();
        });
    };
});
