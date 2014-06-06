define('views/feed_builder', ['jquery', 'jquery-sortable', 'format', 'l10n', 'utils', 'z'], function($, sortable, format, l10n, utils, z) {
    'use strict';
    var format = format.format;
    var gettext = l10n.gettext;

    z.page.on('change', '.feed-region-switcher', function() {
        var lang = this.value;
        $('.localized').addClass('hidden')
                       .filter('[data-region=' + lang + ']').removeClass('hidden');
    })
    .on('click', '.feed-builder .manage-modules-listing .feed-element', function() {
        append(get_region_feed(), $(this));
    })
    .on('click', '.feed-builder .feed .feed-element .delete', function() {
        remove($(this).closest('.feed-element'));
    });

    function append($feed, $feed_element) {
        var type = $feed_element.data('type');
        var id = $feed_element.data('id');
        if ($feed.find(format('[data-type="{0}"][data-id="{1}"]', [type, id])).length) {
            // Already exists.
            return;
        }
        $feed.find('.empty-results').hide();
        $feed.find('.feed-elements').append($feed_element.clone());
        $('.feed-elements').sortable();
    }

    function remove($feed_element) {
        var $feed= $feed_element.closest('.feed');
        $feed_element.remove();
        if (!$feed.find('.feed-element').length) {
            $feed.find('.empty-results').show();
        }
    }

    function get_region_feed() {
        var region = $('.feed-region-switcher :checked').val();
        return $('.feed[data-region="' + region + '"]');
    }

    return function(builder) {
        builder.z('title', gettext('Feed Builder'));
        builder.z('type', 'builder');
        builder.start('feed_builder.html', {
            is_builder: true  // To flip some stuff in the included manage_listing.html.
        });
    };
});
