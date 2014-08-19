define('views/create',
    ['apps_widget', 'feed_previews', 'fields_transonic', 'forms_transonic', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'requests', 'templates', 'urls', 'utils', 'utils_local', 'z'],
    function(apps_widget, feed_previews, fields_transonic, forms_transonic, $, fakefilefield, l10n, log, notification, requests, nunjucks, urls, utils, utils_local, z) {

    'use strict';
    var gettext = l10n.gettext;
    var ngettext = l10n.ngettext;

    function create($btn, $form, form_creater, feed_type, success_msg) {
        form_creater($form).done(function(feed_element) {
            z.page.trigger('navigate', [urls.reverse('edit', [feed_type, feed_element.slug])]);
            notification.notification({message: success_msg});
        }).fail(function(error) {
            utils_local.handle_error(error);
            $btn.text(gettext('Submit')).prop('disabled', false);
        });
    }

    z.body.on('click', '.transonic-form.create button.submit', utils._pd(function(e) {
        var $this = $(this);
        var $form = $this.closest('form');
        $this.text(gettext('Submitting...')).prop('disabled', true);
        $form.find('.form-errors').empty();

        if ($form.data('type') == 'apps') {
            create($this, $form, forms_transonic.feed_app, 'apps',
                   gettext('Featured app successfully created'));
        } else if ($form.data('type') == 'collections') {
            create($this, $form, forms_transonic.collection, 'collections',
                   gettext('Collection successfully created'));
        } else if ($form.data('type') == 'brands') {
            create($this, $form, forms_transonic.brand, 'brands',
                   gettext('Editorial brand successfully created'));
        } else if ($form.data('type') == 'shelves') {
            // Operator shelves.
            create($this, $form, forms_transonic.shelf, 'shelves',
                   gettext('Operator shelf successfully created'));
        }
    }));

    return function(builder, args) {
        var feedType = args[0];

        var title;
        if (feedType == 'apps') {
            title = gettext('Create a Featured App');
        } else if (feedType == 'collections') {
            title = gettext('Create a Collection');
        } else if (feedType == 'brands') {
            title = gettext('Create an Editorial Brand');
        } else if (feedType == 'shelves') {
            title = gettext('Create an Operator Shelf');
        }

        builder.z('title', title);
        builder.z('type', 'create detail ' + feedType);
        builder.start('create/' + feedType + '.html', {
            'feed_type': feedType,  // 'apps', 'collections', 'editorial', or 'shelves'.
            'title': title,
        }).done(function() {
            $('.fileinput').fakeFileField();
            if (feedType == 'apps') {
                apps_widget.set(null);
            }
            feed_previews.refresh();
            utils_local.initCharCounter();
        });
    };
});
