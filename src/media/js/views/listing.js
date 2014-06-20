define('views/listing',
    ['feed_previews', 'format', 'jquery', 'l10n', 'log', 'notification', 'requests', 'settings', 'templates', 'underscore', 'urls', 'utils', 'z'],
    function(feed_previews, format, $, l10n, log, notification, requests, settings, nunjucks, _, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    z.body.on('click', '.manage-modules-listing .delete', utils._pd(function(e) {
        e.stopPropagation();

        // Delete.
        var $this = $(this);
        var $item = $this.closest('li');

        if (!window.confirm(format.format(gettext('Do you really want to delete {0}?'), $item.data('slug')))) {
            // Confirm.
            return;
        }

        var endpoint = urls.api.url('feed-app', [$item.data('slug')]);
        if ($this.hasClass('collection')) {
            endpoint = urls.api.url('collection', [$item.data('slug')]);
        } else if ($this.hasClass('brand')) {
            endpoint = urls.api.url('feed-brand', [$item.data('slug')]);
        }

        requests.del(endpoint).done(function(data) {
            notification.notification({message: gettext('Successfully deleted')});
        });

        $item.remove();
    }))
    .on('keypress', '.search-elements', _.debounce(function() {
        var $this = $(this);

        if ($this.val().length > 1) {
            requests.get(urls.api.url('feed-element-search', [], {'q': $this.val()})).done(function(data) {
                $('.feed-api-results').hide();
                $('.feed-search-results').html(nunjucks.env.render('search_results.html', {
                    data: data
                })).show();
            });
        } else {
            $('.feed-api-results').show();
            $('.feed-search-results').hide();
        }
    }, 250));

    return function(builder, args) {
        builder.z('title', gettext('Existing Content'));
        builder.z('type', 'manage');
        builder.start('listing/listing.html');

        feed_previews.empty();
    };
});
