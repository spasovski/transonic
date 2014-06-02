define('views/manage_listing',
    ['jquery', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'urls', 'utils', 'z'],
    function($, l10n, log, notification, requests, settings, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('click', '.delete', utils._pd(function(e) {
        e.stopPropagation();

        // Delete.
        var $this = $(this);
        var $item = $this.closest('li');

        var endpoint = urls.api.url('feed-app', [$item.data('slug')]);
        if ($this.parent().hasClass('.collection')) {
            endpoint = urls.api.url('collection', [$item.data('slug')]);
        }

        requests.del(endpoint).done(function(data) {
            notification.notification({message: gettext('Successfully deleted')});
        });

        $item.remove();
    }));

    return function(builder, args) {
        builder.z('title', gettext('Existing Content'));
        builder.z('type', 'manage');
        builder.start('manage/listing.html');
    };
});
