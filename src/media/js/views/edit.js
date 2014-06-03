define('views/edit',
    ['apps_widget', 'fields_transonic', 'format', 'forms_transonic', 'jquery', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'urls', 'utils', 'z'],
    function(apps_widget, fields_transonic, format, forms_transonic, $, l10n, log, notification, requests, settings, nunjucks, urls, utils, z) {
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

        requests.get(urls.api.base.url('feed-app', [slug])).done(function(obj) {
            builder.start('create/' + feedType + '.html', {
                'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
                'obj': obj,
                'slug': slug,
                'quote_mock': [
                    {'id': 0, 'body': 'A++'},
                    {'id': 1, 'body': 'is so cool!'},
                    {'id': 2, 'body': 'flappy bird but better'},
                ],
                'title': title,
            }).done(function() {
                if (feedType == 'apps') {
                    apps_widget.render_set(obj.app);
                }
            });
        });
    };
});
