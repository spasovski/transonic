define('app_selector',
    ['jquery', 'log', 'requests', 'settings', 'templates', 'underscore', 'urls', 'utils', 'z'],
    function($, log, requests, settings, nunjucks, _, urls, utils, z) {
    'use strict';

    var $app_selector;
    var $spinner;
    var $results;
    var $paginator;
    var results_map = {};

    z.page.on('loaded', function() {
        // Cache selectors.
        $app_selector = $('.app-selector');
        $paginator = $app_selector.find('.paginator');
        $spinner = $('.loading');
        $results = $('.results').hide();
    })

    .on('keypress input', '.app-selector input', _.debounce(function() {
        $paginator.attr('data-offset', 0);
        if (this.value.length > 2) {
            $spinner.show();
            $app_selector.addClass('focused');
            search_handler(this.value, 0);
        } else {
            $app_selector.removeClass('focused');
            $results.hide();
        }
    }, 250))

    .on('click', '.app-selector .paginator a:not(.disabled)', function() {
        var offset = parseInt($paginator.attr('data-offset'), 10);
        $results.hide();
        $spinner.show();
        if ($(this).hasClass('prev')) {
            offset = offset - 5;
        } else {
            offset = offset + 5;
        }
        $paginator.attr('data-offset', offset);
        search_handler($('.app-selector input').val(), offset);
    })

    .on('click', '.app-selector .result', function(evt) {
        evt.preventDefault();  // To prevent click-off to app detail page.
        var $this = $(this);
        var $app_selector = $('.app-selector');
        $app_selector.find('input[name="app"]').val($this.data('id'));
        // Trigger with ID.
        $results.hide();
        $app_selector.removeClass('focused');
        z.page.trigger('app-selected', [results_map[$this.attr('data-id')]]);
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

    var render_result = function(app, with_actions) {
        return nunjucks.env.render('app_selector_result.html', {
            author: app.author,
            detail_url: settings.api_url + '/app/' + app.slug,
            device_types: app.device_types,
            disabled_regions: get_disabled_regions(app),
            icon: app.icons['48'],
            id: app.id,
            name: utils.translate(app.name),
            price: app.payment_required ? app.price_locale : gettext('Free'),
            rating: app.ratings.average,
            with_actions: with_actions
        });
    };

    function search_handler(q, offset) {
        // Search.
        var search_url = urls.api.unsigned.params(
            'search', {'q': q, 'limit': 5, 'offset': offset});
        requests.get(search_url).done(function(data) {
            $results.find('.result').remove();
            $results.show();

            // Append results.
            if (data.objects.length === 0) {
                var no_results = nunjucks.env.render('app_selector_no_results.html', {});
                $paginator.hide();
                $results.append(no_results);
            } else {
                $paginator.show();
                for (var i = 0; i < data.objects.length; i++) {
                    $results.append(render_result(data.objects[i]));
                    results_map[data.objects[i].id] = data.objects[i];
                }
            }

            var $next = $paginator.find('.next');
            var $prev = $paginator.find('.prev');
            if (!data.meta.previous && !data.meta.next) {
                $paginator.hide();
            } else {
                $paginator.show();
                if (data.meta.previous) {
                    $prev.removeClass('disabled');
                } else {
                    $prev.addClass('disabled');
                }
                if (data.meta.next) {
                    $next.removeClass('disabled');
                } else {
                    $next.addClass('disabled');
                }
            }

            $spinner.hide();
        });
    }

    return {
        render_result: render_result
    };
});
