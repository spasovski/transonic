define('feed_previews',
    ['feed', 'l10n', 'templates', 'utils_local', 'z'],
    function(feed, l10n, nunjucks, utils, z) {

    var gettext = l10n.gettext;
    var hex2rgba = nunjucks.require('filters').hex2rgba;

    // Constants are constant.
    var SAMPLE_BG = '/media/img/sample_bg.jpg';
    var THUMB = 'https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/461/461685-64.png';
    var BG_COLOUR = '#b90000';

    var APP = {
        name: 'A Sample App',
        author: 'Kevin Ngo',
        icons: {
            64: THUMB
        }
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

    function createFeaturedApp($parent) {
        var $result = $('.apps-widget .result');
        var app = null;
        if ($result.length) {
            app = {
                name: $result.find('.name').text(),
                author: $result.find('.author').text(),
                icons: {
                    64: $result.find('.icon').attr('src')
                }
            };
        }
        var background_image = $('.background-image img.preview').attr('src');

        var ctx = $.extend(true, {}, FEATURED_APP);
        ctx.app = app || ctx.app;
        ctx.background_color = $('input[name=bg-color]:checked').val();
        ctx.background_image = background_image || ctx.background_image;

        $parent.append(
            nunjucks.env.render('tiles/collection_tile.html', ctx)
        );
    }

    function initAppSelector() {
        $('.app-selector').on('click', '.results li', function() {
            var name = $(this).find('.name').text();
            var author = $(this).find('.author').text();
            var $preview = $('.feed-item, .feed-app');

            $preview.find('h1, h3').text(name);
            $preview.find('.icon, .app-icons img').attr('src', $(this).find('.icon').attr('src'));
            $preview.find('.author').text(author);
        });
    }

    function initColourSelector() {
        $('.colors').on('change', 'input[name=bg-color]', function() {
            var colour = $(this).val();

            $('.feed-item').css('background-color', hex2rgba(colour, 0.4));
            $('.curve').css('background-color', hex2rgba(colour, 0.8));
            $('.tile-footer.quote').css('background-color', colour);
        });
    }

    function initTextListeners() {
        $('.description').on('keydown', '.localized:not(.hidden)', function() {
            $('.feed-app .desc').text($(this).val());
        });
        $('.pq-text').on('keydown', '.localized:not(.hidden)', function() {
            $('.feed-app blockquote p').text($(this).val());
        });
        $('#pq-attribution').on('keydown', function() {
            $('.feed-app .quote-source').text($(this).val());
        });
    }

    function initRatingSelector() {
        $('.pq-rating .choices').on('change', 'input[name=pq-rating]', function() {
            var rating = $(this).val();

            $('p.stars')
                .removeClass('stars-1 stars-2 stars-3 stars-4 stars-5')
                .addClass('stars-' + rating);
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

    function initTypeSelector($parent) {
        $('input[name=featured-type]').on('change', function() {
            refreshApp($parent, $(this).val());
        });
    }

    function refreshApp($parent, type) {
        $parent.empty();

        if (type == feed.FEEDAPP_ICON) {
            createFeaturedApp($parent);
            noBackground();
        } else if (type == feed.FEEDAPP_DESC) {
            createFeaturedTile($parent);
            noPreview();
            noQuote();
        } else if (type == feed.FEEDAPP_QUOTE) {
            createFeaturedTile($parent);
            noPreview();
            $parent.find('.tile-footer')
                   .css('background-color', BG_COLOUR)
                   .find('.desc').remove();
        } else if (type == feed.FEEDAPP_IMAGE) {
            createFeaturedApp($parent);
        } else if (type == feed.FEEDAPP_PREVIEW) {
            createFeaturedTile($parent);
            noQuote();
            $parent.find('.tile-footer').addClass(type);
            z.page.on('click', '.screenshots .thumbnail', function() {
                var src = $(this).find('img').attr('src');
                $('.feed-app-preview-container img').attr('src', src);
            });
        }

        function noBackground() {
            $parent.find('.feed-item').css('background-image', '');
        }

        function noPreview() {
            $parent.find('.tile-footer')
                   .addClass(type)
                   .find('.feed-app-preview-container').remove();
        }

        function noQuote() {
            $parent.find('blockquote, p.stars, .quote-source')
                   .remove();
        }
    }

    function createFeaturedTile($parent) {
        var $result = $('.apps-widget .result');
        var app = null;
        if ($result.length) {
            app = {
                name: $result.find('.name').text(),
                author: $result.find('.author').text(),
                icons: {
                    64: $result.find('.icon').attr('src')
                }
            };
        }

        var ctx = $.extend(true, {}, FEATURED_APP);
        ctx.app = app || ctx.app;
        ctx.pullquote_attribute = $('[name="pq-attribution"]').val() || ctx.pullquote_attribute;
        ctx.pullquote_rating = $('.pq-rating input:checked').val() || ctx.pullquote_rating;
        ctx.pullquote_text = $('.pq-text .localized:not(.hidden').val() || ctx.pullquote_text;
        ctx.description = $('.description .localized:not(.hidden').val() || ctx.description;
        ctx.preview = $('.screenshots li.selected img').attr('src') || ctx.preview.image_url;

        $parent.append(
            nunjucks.env.render('tiles/app_tile.html', ctx)
        );
    }

    function initLiveAppPreview($parent) {
        refreshApp($parent, $('.featured-type-choices input:checked').val());
        initTypeSelector($parent);
        initColourSelector();
        initAppSelector();
        initTextListeners();
        initRatingSelector();
        initPreviewImage();
    }

    function empty() {
        $('.feed').empty();
    }

    return {
        empty: empty,
        initLiveAppPreview: initLiveAppPreview
    };
});
