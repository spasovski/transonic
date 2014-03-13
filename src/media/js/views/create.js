define('views/create', ['jquery', 'l10n', 'log', 'settings', 'z'],
    function($, l10n, log, settings, z) {
    'use strict';
    var console = log('create');
    var gettext = l10n.gettext;

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
        // Toggle background image upload widgets for different collection types.
        var $bgImgs = $('.collection-type .background-image').addClass('hidden');
        if (['standard', 'showcase', 'mega'].indexOf(this.value) !== -1) {
            $bgImgs.filter('.collection-background-image').removeClass('hidden');
        } else if (this.value == 'operator-shelf') {
            $bgImgs.filter('.shelf-background-image').removeClass('hidden');
        }
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
