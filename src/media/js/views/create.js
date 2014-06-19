define('views/create',
    ['feed_previews', 'fields_transonic', 'forms_transonic', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'requests', 'templates', 'urls', 'utils', 'z'],
    function(previews, fields_transonic, forms_transonic, $, fakefilefield, l10n, log, notification, requests, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('click', '.transonic-form.create button.submit', utils._pd(function(e) {
        var $this = $(this);
        var $form = $this.closest('form');
        $this.html(gettext('Submitting...')).attr('disabled', true);

        if ($form.data('type') == 'apps') {
            forms_transonic.feed_app($form).done(function(feed_element) {
                z.page.trigger('navigate', [urls.reverse('edit', ['apps', feed_element.slug])]);
                notification.notification({message: gettext('Featured app successfully created')});
            }).fail(function(error) {
                notification.notification({message: error});
                $this.html(gettext('Submit')).removeAttr('disabled');
            });
        } else if ($form.data('type') == 'collections') {
            forms_transonic.collection($form).done(function(feed_element) {
                z.page.trigger('navigate', [urls.reverse('edit', ['collections', feed_element.slug])]);
                notification.notification({message: gettext('Collection successfully created')});
            }).fail(function(error) {
                notification.notification({message: error});
                $this.html(gettext('Submit')).removeAttr('disabled');
            });
        } else if ($form.data('type') == 'brands') {
            forms_transonic.brand($form).done(function(brand) {
                z.page.trigger('navigate', [urls.reverse('edit', ['brands', brand.slug])]);
                notification.notification({message: gettext('Editorial brand successfully created')});
            }).fail(function(error) {
                notification.notification({message: error});
                $this.html(gettext('Submit')).removeAttr('disabled');
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
        } else if (feedType == 'brands') {
            title = gettext('Creating an Editorial Brand');
        }

        builder.z('title', title);
        builder.z('type', 'create');
        builder.start('create/' + feedType + '.html', {
            'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
            'title': title,
        }).done(function() {
            $('.fileinput').fakeFileField();
            previews.initLiveAppPreview($('.feed'));
        });
    };
});
