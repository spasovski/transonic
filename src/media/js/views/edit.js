define('views/edit',
    ['apps_widget', 'fields_transonic', 'format', 'forms_transonic', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'preview_tray', 'requests', 'settings', 'templates', 'urls', 'utils', 'z'],
    function(apps_widget, fields_transonic, format, forms_transonic, $, fakefilefield, l10n, log, notification, preview_tray, requests, settings, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('click', '.transonic-form.edit .submit', utils._pd(function(e) {
        var $form = $(this).closest('form');

        if ($form.data('type') == 'apps') {
            forms_transonic.create_update_featured_app($form, $form.data('slug')).done(function(feed_element) {
                notification.notification({message: gettext('Featured app successfully updated')});
            }).fail(function(error) {
                notification.notification({message: error});
            });
        }
    }));

    return function(builder, args) {
        var feedType = args[0];
        var slug = args[1];

        var title;
        var endpoint;
        if (feedType == 'apps') {
            title = format.format(gettext('Editing Featured App: {0}'), slug);
            endpoint = urls.api.base.url('feed-app', [slug]);
        } else if (feedType == 'collections') {
            title = format.format(gettext('Editing Collection: {0}'), slug);
            endpoint = urls.api.base.url('collection', [slug]);
        } else if (feedType == 'brands') {
            title = format.format(gettext('Editing Editorial Brand: {0}'), slug);
        }

        builder.z('title', title);
        builder.z('type', feedType);

        requests.get(endpoint).done(function(obj) {
            builder.start('create/' + feedType + '.html', {
                'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
                'obj': obj,
                'slug': slug,
                'title': title,
            }).done(function() {
                $('.fileinput').fakeFileField();

                if (feedType == 'apps') {
                    // App widget.
                    apps_widget.render_set(obj.app);

                    // Calculate which screenshot to initially select.
                    var preview_index = 0;
                    for (var i = 0; i < obj.app.previews.length; i++) {
                        if (obj.app.previews[i].id === obj.preview.id) {
                            preview_index = i;
                        }
                    }
                    $('.screenshots').html(nunjucks.env.render('preview_tray.html', {app: obj.app}));
                    preview_tray.populateTray.call($('.preview-tray')[0], preview_index);
                } else if (['collections', 'brands'].indexOf(feedType) !== -1) {
                    // App widget.
                    for (var i = 0; i < obj.apps.length; i++) {
                        apps_widget.render_append(obj.apps[i]);
                    }
                }
            });
        });
    };
});
