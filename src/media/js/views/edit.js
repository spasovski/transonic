define('views/edit',
    ['fields_transonic', 'format', 'forms_transonic', 'jquery', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'utils', 'z'],
    function(fields_transonic, format, forms_transonic, $, l10n, log, notification, requests, settings, nunjucks, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('submit', '.transonic-form', utils._pd(function(e) {
        var $form = $(this);
        if ($form.data('type') == 'apps') {
        }
    }));

    return function(builder, args) {
        var feedType = args[0];
        var slug = args[1];

        var title;
        if (feedType == 'apps') {
            title = format.format(gettext('Editing Featured App: {0}'), slug);
        } else if (feedType == 'collections') {
            title = format.format(gettext('Editing Collection: {0}'), slug);
        } else if (feedType == 'editorial') {
            title = format.format(gettext('Editing Editorial Brand: {0}'), slug);
        }

        builder.z('title', title);
        builder.z('type', feedType);
        builder.start('edit/' + feedType + '.html', {
            'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
            'slug': slug,
            'quote_mock': [
                {'id': 0, 'body': 'A++'},
                {'id': 1, 'body': 'is so cool!'},
                {'id': 2, 'body': 'flappy bird but better'},
            ],
            'title': title,
        });
    };
});
