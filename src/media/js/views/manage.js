define('views/manage',
    ['jquery', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'urls', 'utils', 'z'],
    function($, l10n, log, notification, requests, settings, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    return function(builder, args) {
        builder.z('title', gettext('Existing Content'));
        builder.z('type', 'manage');
        builder.start('manage/listing.html');
    };
});
