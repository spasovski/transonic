define('feed_previews',
    ['feed', 'l10n', 'templates', 'utils_local', 'z'],
    function(feed, l10n, nunjucks, utils, z) {

    var gettext = l10n.gettext;
    var hex2rgba = nunjucks.require('filters').hex2rgba;

    // Constants are constant.
    var SAMPLE_BG = '/media/img/sample_bg.jpg';
    var THUMB = 'https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/461/461685-64.png';
    var BG_COLOUR = '#b90000';
    var MAX_BRAND_APPS = 6;

    function app_factory() {
        var app = {
            name: 'A Sample App',
            author: 'Kevin Ngo',
            icons: {
                64: THUMB
            },
            rating: 3,
            price: '$0.81'
        };

        var $result = $('.apps-widget .result');
        if ($result.length) {
            var app = $.extend(true, app, {
                name: $result.find('.name').text(),
                author: $result.find('.author').text(),
                icons: {
                    64: $result.find('.icon').attr('src')
                },
                rating: $result.data('rating'),
                price: $result.data('price')
            });
        };

        return app;
    }

    function preview_factory() {
        return {
            id: 1,
            position: 1,
            thumbnail_url: THUMB,
            image_url: $('.screenshots li.selected img').attr('src') || SAMPLE_BG,
            filetype: 'image/png',
            resource_uri: 'http://mozilla.org'
        };
    };

    function feed_app_factory() {
        return {
            app: app_factory(),
            background_color: $('.bg-color input:checked').val() || BG_COLOUR,
            background_image: $('.background-image-input .preview').attr('src') || '',
            description: $('.description .localized:not(.hidden').val() || '',
            id: 1,
            preview: preview_factory(),
            pullquote_attribution: $('[name="pq-attribution"]').val() || '',
            pullquote_rating: $('.pq-rating input:checked').val() || 0,
            pullquote_text: $('.pq-text .localized:not(.hidden').val() || '',
            slug: 'some-feed-app',
            type: $('.featured-type-choices input:checked').val() || 'icon',
            url: 'http://mozilla.org'
        };
    };

    function brand_factory() {
        var brand = {
            apps: [app_factory(), app_factory(), app_factory()],
            layout: $('#brand-layout').val() || 'grid',
            type: $('#brand-type').val() || 'apps-for-albania',
            url: 'http://mozilla.org'

        }

        var $results = $('.apps-widget .result');
        if ($results.length) {
            var apps = [];
            $results.each(function(i) {
                var $this = $(this);

                if (i < MAX_BRAND_APPS) {
                    apps.push({
                        icons: {64: $this.find('.icon').attr('src')},
                        name: $this.find('.name').text(),
                        author: $this.find('.author').text(),
                        rating: $this.data('rating'),
                        price: $this.data('price')
                    });
                }
            });
            brand.apps = apps;
        }

        return brand;
    }

    z.page.on('change keyup input', 'input, textarea, select', _.throttle(refresh, 250));
    z.page.on('refresh_preview', _.throttle(refresh, 250));

    function refresh() {
        empty();
        var type = $('.transonic-form').data('type');
        if (type == 'apps') {
            refresh_feed_app_preview();
        } else if (type == 'brands') {
            refresh_brand_preview();
        }
    }

    function refresh_feed_app_preview() {
        var $feed = $('.feed');
        var feed_app = feed_app_factory();

        $feed.append(
            nunjucks.env.render('feed_previews/feed_app.html', {
                app: feed_app.app,
                feed_app: feed_app
            })
        );
    }

    function refresh_brand_preview() {
        $('.feed').append(
            nunjucks.env.render('feed_previews/brand.html', {
                brand: brand_factory()
            })
        )
    }

    function empty() {
        $('.feed').empty();
    }

    return {
        empty: empty,
        feed_app: refresh_feed_app_preview,
        brand: refresh_brand_preview,
    };
});
