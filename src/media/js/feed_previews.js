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

    var APP = {
        name: 'A Sample App',
        author: 'Kevin Ngo',
        icons: {
            64: THUMB
        },
        rating: 3,
        price: '$0.81'
    };

    var PREVIEW = {
        id: 1,
        position: 1,
        thumbnail_url: THUMB,
        image_url: SAMPLE_BG,
        filetype: 'image/png',
        resource_uri: 'http://mozilla.org'
    };

    var FEATURED_APP = {
        app: APP,
        background_color: BG_COLOUR,
        description: '',
        type: 'icon',
        background_image: '',
        id: 1,
        preview: PREVIEW,
        pullquote_attribute: '',
        pullquote_rating: 0,
        pullquote_text: '',
        slug: 'some-feed-app',
        url: 'http://mozilla.org'
    };

    function initColourSelector() {
        $('.colors').on('change', 'input[name=bg-color]', function() {
            var colour = $(this).val();

            $('.feed-item').css('background-color', hex2rgba(colour, 0.4));
            $('.curve').css('background-color', hex2rgba(colour, 0.8));
            $('.tile-footer.quote').css('background-color', colour);
        });
    }

    function initTextListeners() {
        $('.description').on('keyup input', '.localized:not(.hidden)', function() {
            $('.feed-app .desc').text($(this).val());
        });
        $('.pq-text').on('keyup input', '.localized:not(.hidden)', function() {
            $('.feed-app blockquote p').text($(this).val());
        });
        $('#pq-attribution').on('keyup input', function() {
            $('.feed-app .quote-source').text('- ' + $(this).val());
        });
    }

    function initPreviewImage() {
        $('.background-image .realfileinput').on('change', function() {
            setTimeout(function() {
                var src = $('.background-image img.preview').attr('src');
                var ugly = 'url(' + src + ')';

                $('.feed-item').css('background-image', ugly);
            }, 100);
        });
    }

    function refreshAppTile() {
        var $feed = $('.feed');
        $feed.empty();
        var $result = $('.apps-widget .result');
        var app = null;
        var type = $('.featured-type-choices input:checked').val();

        if ($result.length) {
            app = {
                name: $result.find('.name').text(),
                author: $result.find('.author').text(),
                icons: {
                    64: $result.find('.icon').attr('src')
                },
                rating: getRating($result),
                price: $result.find('.price').text()
            };
        }

        var ctx = $.extend(true, {}, FEATURED_APP);
        ctx.app = app || ctx.app;
        ctx.pullquote_attribute = $('[name="pq-attribution"]').val() || ctx.pullquote_attribute;
        ctx.pullquote_rating = $('.pq-rating input:checked').val() || ctx.pullquote_rating;
        ctx.pullquote_text = $('.pq-text .localized:not(.hidden').val() || ctx.pullquote_text;
        ctx.description = $('.description .localized:not(.hidden').val() || ctx.description;
        ctx.preview = $('.screenshots li.selected img').attr('src') || ctx.preview.image_url;

        if (type == feed.FEEDAPP_ICON) {
            $feed.append(
                nunjucks.env.render('tiles/collection_tile.html', ctx)
            );
            noBackground();
        } else if (type == feed.FEEDAPP_DESC) {
            $feed.append(
                nunjucks.env.render('tiles/app_tile.html', ctx)
            );
            noPreview();
            noQuote();
        } else if (type == feed.FEEDAPP_QUOTE) {
            $feed.append(
                nunjucks.env.render('tiles/app_tile.html', ctx)
            );
            noPreview();
            $feed.find('.tile-footer')
                 .css('background-color', BG_COLOUR)
                 .find('.desc').remove();
        } else if (type == feed.FEEDAPP_IMAGE) {
            $feed.append(
                nunjucks.env.render('tiles/collection_tile.html', ctx)
            );
        } else if (type == feed.FEEDAPP_PREVIEW) {
            $feed.append(
                nunjucks.env.render('tiles/app_tile.html', ctx)
            );
            noQuote();
            $feed.find('.tile-footer').addClass(type);
            z.page.on('click', '.screenshots .thumbnail', function() {
                var src = $(this).find('img').attr('src');
                $('.feed-app-preview-container img').attr('src', src);
            });
        }

        function noBackground() {
            $feed.find('.feed-item').css('background-image', '');
        }

        function noPreview() {
            $feed.find('.tile-footer')
                 .addClass(type)
                 .find('.feed-app-preview-container').remove();
        }

        function noQuote() {
            $feed.find('blockquote, p.stars, .quote-source')
                 .remove();
        }
    }

    function createBrandTile() {
        var apps = [APP, APP, APP];
        var $results = $('.apps-widget .result');

        if ($results.length) {
            apps = [];
            $results.each(function(i) {
                var $this = $(this);

                if (i < MAX_BRAND_APPS) {
                    apps.push({
                        icons: {64: $this.find('.icon').attr('src')},
                        name: $this.find('.name').text(),
                        author: $this.find('.author').text(),
                        rating: getRating($this),
                        price: $this.find('.price').text()
                    });
                }
            });
        }

        var ctx = {
            apps: apps,
            layout: $('#brand-layout').val(),
            type: $('#brand-type').val(),
            url: 'http://mozilla.org'
        };

        $('.feed').append(
            nunjucks.env.render('tiles/brand_tile.html', ctx)
        )
    }

    // Extract rating info from a DOM app tile.
    function getRating($app) {
        if ($app.find('.rating .stars').length) {
            return $app.find('.rating .stars').text();
        } else {
            return $app.find('.rating').text();
        }
    }

    function initLiveAppPreview() {
        refreshAppTile();
        $('input[name=featured-type]').on('change', refreshAppTile);
        initColourSelector();
        $('.app-selector').on('click', '.results li', function() {
            setTimeout(refreshAppTile, 100);
        });
        initTextListeners();
        z.page.on('change', 'input[name=pq-rating]', function() {
            var rating = $(this).val();

            $('p.stars')
                .removeClass('stars-0 stars-1 stars-2 stars-3 stars-4 stars-5')
                .addClass('stars-' + rating);
        });
        initPreviewImage();
    }

    function initBrandListeners() {
        $('.app-selector').on('click', '.results li', function() {
            setTimeout(function() {
                z.page.trigger('refreshbrand');
            }, 100);
        });
        z.page.on('change', '#brand-type, #brand-layout', function() {
            z.page.trigger('refreshbrand');
        }).on('click', '.apps-widget .actions .delete, .apps-widget .reorder', function() {
            z.page.trigger('refreshbrand');
        });
    }

    function initBrandPreview() {
        z.page.on('refreshbrand', refreshBrand);
        refreshBrand();
        initBrandListeners();
    }

    function refreshBrand() {
        empty();
        createBrandTile();
    }

    function empty() {
        $('.feed').empty();
    }

    return {
        empty: empty,
        initBrandPreview: initBrandPreview,
        initLiveAppPreview: initLiveAppPreview
    };
});
