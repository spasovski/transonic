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
    });

    z.page.on('change', '.promote-type-choices input', function(e) {
        // Tab between different promotion types (graphic, desc, pull quote).
        $('.promote-details').hide().filter('.' + this.value).show();
    });

    return function(builder, args) {
        var feedType = args[0];

        var title;
        if (feedType == 'apps') {
            title = gettext('Custom Featured Apps');
        } else if (feedType == 'collections') {
            title = gettext('Collections and Articles');
        } else if (feedType == 'editorial') {
            title = gettext('Editorial Brand');
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
