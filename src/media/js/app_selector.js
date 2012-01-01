define('app_selector',
    ['jquery', 'log', 'requests', 'settings', 'templates', 'underscore', 'urls', 'utils', 'z'],
    function($, log, requests, settings, nunjucks, _, urls, utils, z) {
    'use strict';

    var $app_selector;
    var $results;
    var $paginator;
    z.page.on('loaded', function() {
        // Cache selectors.
        $app_selector = $('.app-selector');
        $results = $app_selector.find('.results');
        $paginator = $app_selector.find('.paginator');
    })

    .on('keypress', '.app-selector input', _.debounce(function() {
        $paginator.attr('data-offset', 0);
        if (this.value.length > 2) {
            search_handler(this.value, 0);
        }
    }, 250))

    .on('click', '.app-selector .paginator a', function() {
        var offset = parseInt($paginator.attr('data-offset'), 10);
        if ($(this).hasClass('prev')) {
            offset = offset - 5;
        } else {
            offset = offset + 5;
        }
        $paginator.attr('data-offset', offset);
        search_handler($('.app-selector input').val(), offset);
    })

    .on('click', '.app-selector .result', function() {
        var $this = $(this);
        var $app_selector = $('.app-selector');

        // Set placeholder.
        $app_selector.find('#app-selector').val('').attr('placeholder', $this.find('[itemprop="name"] a').text());
        // Set form field.
        $app_selector.find('input[name="app"]').val($this.data('id'));
        // Hide results list.
        $app_selector.find('.result').remove();
        // Trigger with ID.
        z.page.trigger('app-selected', [$this.attr('data-id')]);
    });

    function get_disabled_regions(app) {
        // Given app, do set difference between all regions and app's regions
        // to get the disabled regions.
        return Object.keys(settings.REGION_CHOICES_SLUG).filter(function(slug) {
            return app.regions
                      .map(function(region) { return region.slug; })
                      .indexOf(slug) < 0;
        });
    }

    var render_result = function(app) {
        return nunjucks.env.render('app_selector_result.html', {
            author: app.author,
            detail_url: settings.api_url + '/app/' + app.slug,
            device_types: app.device_types,
            icon: app.icons['48'],
            id: app.id,
            name: utils.translate(app.name),
            disabled_regions: get_disabled_regions(app)
        });
    };

    function search_handler(q, offset) {
        // Search.
        var search_url = urls.api.unsigned.params(
            'search', {'q': q, 'limit': 5, 'offset': offset});
        requests.get(search_url).done(function(data) {
            $('.result', $results).remove();

            // Append results.
            for (var i = 0; i < data.objects.length; i++) {
                $results.append(render_result(data.objects[i]));
            }
        });
    }

    return {
        render_result: render_result,
    };
});
