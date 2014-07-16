define('views/feed_builder', ['forms_transonic', 'jquery', 'jquery-sortable', 'format', 'l10n', 'models', 'notification', 'nunjucks', 'requests',  'urls', 'utils', 'z'],
    function(forms_transonic, $, sortable, format, l10n, models, notification, nunjucks, requests, urls, utils, z) {
    'use strict';
    var format = format.format;
    var gettext = l10n.gettext;

    // Keep track of what regions we look at to limit the queries on the backend if we publish.
    var modified_regions = ['restofworld'];

    z.page.on('change', '.feed-region-switcher', function() {
        /* Look at a different feed. */
        var region = this.value;
        $('.feeds .loading').show();

        requests.get(urls.api.url('feed-items', [], {'region': region, 'ordering': 'order'})).done(function(feed_items) {
            feed_items = feed_items.objects;
            var $feed = $('.localized').addClass('hidden')
                                       .filter('[data-region=' + region + ']').removeClass('hidden');
            modified_regions.push(region);

            for (var i = 0; i < feed_items.length; i++) {
                var type = feed_items[i].item_type;
                if (type == 'shelf') {
                    // Don't render shelves because they are immutable in feed.
                    continue;
                }

                var context = {
                    feed: require('feed'),
                    is_builder: true
                };
                context[type] = feed_items[i][type];
                var $feed_element = $(nunjucks.env.render(format('listing/{0}.html', [type]), context));

                models('feed-' + type).cast(feed_items[i][type]);
                append($feed, $feed_element);
            }

            $('.feeds .loading').hide();
            z.page.trigger('refresh_preview');
        });
    })
    .on('click', '.feed-builder .manage-modules-listing .feed-element', function() {
        /* Add feed element to feed. */
        append(get_region_feed(), $(this));
    })
    .on('click', '.feed-builder .region-feed .feed-element .delete', function() {
        /* Remove element from feed. */
        remove($(this).closest('.feed-element'));
    })
    .on('click', '.feed-builder .submit', utils._pd(function() {
        /* Publish changes. */
        var $this = $(this);
        $this.html(gettext('Publishing...')).attr('disabled', true);

        forms_transonic.feed_items($('.feeds'), modified_regions).done(function() {
            notification.notification({message: gettext('Feed changes successfully published!')});
            $this.html(gettext('Publish')).removeAttr('disabled');
        }).fail(function(err) {
            notification.notification({message: gettext('Sorry, there was an error publishing your changes.')});
            $this.html(gettext('Publish')).removeAttr('disabled');
        });
    }));

    function append($feed, $feed_element) {
        var type = $feed_element.data('type');
        var id = $feed_element.data('id');
        if ($feed.find(format('[data-type="{0}"][data-id="{1}"]', [type, id])).length) {
            // Already exists.
            return;
        }
        $feed.find('.empty-results').hide();
        $feed.find('.feed-elements').append($feed_element.clone());
        $('.feed-elements').sortable({
            onDrop: function($item) {
                $item.removeClass('dragged').removeAttr('style')
                z.body.removeClass('dragging');
                z.page.trigger('refresh_preview');
            }
        });
        z.page.trigger('refresh_preview');
    }

    function remove($feed_element) {
        var $feed= $feed_element.closest('.region-feed');
        $feed_element.remove();
        if (!$feed.find('.feed-element').length) {
            $feed.find('.empty-results').show();
        }
        z.page.trigger('refresh_preview');
    }

    function get_region_feed() {
        var region = $('.feed-region-switcher :checked').val();
        return $('.region-feed[data-region="' + region + '"]');
    }

    return function(builder) {
        builder.z('title', gettext('Feed Builder'));
        builder.z('type', 'builder');
        builder.start('feed_builder.html', {
            is_builder: true  // To flip some stuff in the included manage_listing.html.
        }).done(function() {
            modified_regions = ['restofworld'];

            // Load existing FeedItems.
            $('.feed-region-switcher').trigger('change');
        });
    };
});
