define('views/create', ['l10n', 'log', 'settings'], function(l10n, log, settings) {
    'use strict';
    var console = log('create');
    var gettext = l10n.gettext;

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
            'title': title
        });
    };
});
