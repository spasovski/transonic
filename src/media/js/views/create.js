define('views/create',
    ['app_selector', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'requests', 'settings', 'urls', 'utils', 'z'],
    function(app_select, $, fakefilefield, l10n, log, requests, settings, urls, utils, z) {
    'use strict';
    var console = log('create');
    var gettext = l10n.gettext;

    var imageUploads = {};  // Keep track of drag-and-drop uploads to stuff into FormData later.

    z.page.on('change', '.colors input', function() {
        // Sync color previews and inputs.
        var $this = $(this);
        var $parent = $(this).closest('.colors');
        var color = $this.attr('value');
        $parent.find('.selected-color').css('background', color);
        $parent.find('.selected-text').text(color);
    })
    .on('change', '.featured-type-choices input', function(e) {
        // Tab between different featured types (graphic, desc, pull quote).
        $('.featured-details').hide().filter('.' + this.value).show();
    })
    .on('change', '.collection-type-choices input', function(e) {
        // To help CSS toggle background image upload widgets for different collection types.
        $(this).closest('.collection-type').attr('data-collection-type', this.value);
    })
    .on('app-selected', function(e, id) {
        // App selection.
        $('input[name="app"]').val(id);

        requests.get(urls.api.unsigned.url('app', [id])).done(function(app) {
            $('.selected-app').html(app_select.render_result(app));
        });
    })

    // Drag and drop image uploads.
    .on('dragover dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('drop', '.background-image-input', function(e) {
        e.preventDefault();
        var $this = $(this);

        // Read file.
        var file = e.originalEvent.dataTransfer.files[0];

        // Preview file.
        if (['image/png', 'image/jpeg'].indexOf(file.type) !== -1) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $this.addClass('filled')
                     .find('.preview').attr('src', e.target.result);
                $this.find('input[type="text"]').attr('value', file.name);
            };
            reader.readAsDataURL(file);
            imageUploads[$this.find('[type="file"]').attr('name')] = file;
        }
    })

    // Click image uploads.
    .on('loaded', function() {
        $('.fileinput').fakeFileField();
    })
    .on('change', '.background-image-input [type="file"]', function() {
       $(this).closest('.background-image-input').addClass('filled');
    })

    // Localization of text fields.
    .on('change', '#locale-switcher', function() {
        var lang = this.value;
        $('.localized').hide()
                       .filter('[data-lang=' + lang + ']').show();
    });

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
        builder.z('type', 'create');
        builder.start('create/' + feedType + '.html', {
            'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
            'quote_mock': [
                {'id': 0, 'body': 'A++'},
                {'id': 1, 'body': 'is so cool!'},
                {'id': 2, 'body': 'flappy bird but better'},
            ],
            'title': title,
        });
    };
});
