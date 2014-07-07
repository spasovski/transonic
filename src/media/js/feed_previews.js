define('feed_previews',
    ['feed', 'l10n', 'templates', 'textoverflowclamp', 'utils_local', 'z'],
    function(feed, l10n, nunjucks, clamp, utils, z) {

    var gettext = l10n.gettext;

    // Constants are constant.
    var THUMB = 'https://marketplace.cdn.mozilla.net/img/uploads/addon_icons/461/461685-64.png';

    String.prototype.escape = function() {
        var tagsToReplace = {
            '<': '&lt;',
            '>': '&gt;'
        };
        return this.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
    };

    function app_factory() {
        var app = {
            name: 'A Sample App',
            author: 'Kevin Ngo',
            icons: {
                64: THUMB
            },
            ratings: {
                average: 3
            },
            price: '$0.81',
            price_locale: '$0.81',
            slug: 'test-slug'
        };

        var $result = $('.apps-widget .result');
        if ($result.length) {
            var app = $.extend(true, app, {
                name: $result.find('.name').text(),
                author: $result.find('.author').text(),
                icons: {
                    64: $result.find('.icon').attr('src')
                },
                ratings: {
                    average: $result.data('rating')
                },
                price: $result.data('price'),
                price_locale: $result.data('price')
            });
        };

        return app;
    }

    function multi_app_factory() {
        var apps = [];
        var $results = $('.apps-widget .result:not(.app-group)');

        if (!$results.length) {
            return apps;
        }

        $results.each(function(i) {
            var $this = $(this);

            apps.push({
                icons: {64: $this.find('.icon').attr('src')},
                name: $this.find('.name').text(),
                author: $this.find('.author').text(),
                ratings: {
                    average: $this.data('rating')
                },
                price: $this.data('price'),
                price_locale: $this.data('price'),
                slug: 'test-slug',
            });
        });

        return apps;
    }

    function preview_factory() {
        return {
            thumbnail_url: THUMB,
            image_url: $('.screenshots li.selected img').attr('src'),
            filetype: 'image/png',
        };
    };

    function feed_app_factory() {
        return {
            app: app_factory(),
            background_color: $('.bg-color input:checked').val(),
            background_image: $('.background-image-input .preview').attr('src'),
            description: $('.description .localized:not(.hidden').val().escape() || '',
            preview: preview_factory(),
            pullquote_attribution: $('[name="pq-attribution"]').val().escape() || '',
            pullquote_rating: $('.pq-rating input:checked').val() || 0,
            pullquote_text: $('.pq-text .localized:not(.hidden').val().escape() || '',
            type: $('.featured-type-choices input:checked').val() || 'icon',
        };
    };

    function brand_factory() {
        var apps = multi_app_factory();
        apps = apps.length ? apps : [app_factory(), app_factory(), app_factory()];
        return {
            apps: apps,
            layout: $('#brand-layout').val() || 'grid',
            type: $('#brand-type').val() || 'apps-for-albania',

        }
    }

    function collection_factory() {
        var apps = multi_app_factory();
        apps = apps.length ? apps : [app_factory(), app_factory(), app_factory()];
        return {
            apps: apps,
            background_color: $('.bg-color input:checked').val(),
            background_image: $('.background-image-input .preview').attr('src'),
            description: $('.description .localized:not(.hidden').val().escape() || '',
            name: $('.name .localized:not(.hidden').val().escape() || '',
        }
    }

    function shelf_factory() {
        var apps = multi_app_factory();
        apps = apps.length ? apps : [app_factory(), app_factory(), app_factory()];
        return {
            apps: apps,
            background_color: $('.bg-color input:checked').val(),
            background_image: $('.background-image-input .preview').attr('src'),
            description: $('.description .localized:not(.hidden').val().escape() || '',
            name: $('.name .localized:not(.hidden').val().escape() || '',
            type: $('.collection-type-choices input:checked').val() || feed.COLL_PROMO,
        }
    }

    // Listeners.
    z.page.on('change keyup input', 'input, textarea, select', _.throttle(refresh, 250));
    z.page.on('refresh_preview', _.throttle(refresh, 250));

    function refresh() {
        empty();

        var type = $('.transonic-form').data('type');
        if (type == 'apps') {
            refresh_preview(feed_app_factory(), 'app');
        } else if (type == 'brands') {
            refresh_preview(brand_factory(), 'brand');
        } else if (type == 'collections') {
            refresh_preview(collection_factory(), 'collection');
        } else if (type == 'shelves') {
            refresh_preview(shelf_factory(), 'shelf');
        }
    }


    function refresh_preview(obj, item_type) {
        // Stub out Fireplace-specific helpers.
        var stub_globals = nunjucks.require('globals');
        stub_globals.app_incompat = function() {};
        stub_globals.has_installed = function() {};
        stub_globals.imgAlreadyDeferred = function() {return true;};

        $('.feed').append(
            nunjucks.env.render('feed_item_preview.html', {
                cast_app: function() {},
                obj: obj,
                item_type: item_type,
                url: function() {return '#';},
            })
        );
        clamp(document.querySelector('.feed .desc'), 4);
    }

    function empty() {
        $('.feed').empty();
    }

    return {
        empty: empty,
        refresh: refresh,
    };
});
