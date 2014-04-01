define('routes_api', [], function() {
    return {
        'login': '/api/v1/account/login/',

        'app': '/api/v1/apps/app/{0}/?cache=1&vary=0',
        'collections': '/api/v2/feed/collections/',
        'feed-apps': '/api/v2/feed/apps/',
        'feed-items': '/api/v2/feed/items/',
        'search': '/api/v1/apps/search/suggest?cache=1&vary=0',

        // TODO: Likely redundant, clean up later.
        'collection_list': '/api/v2/feed/collections/',

        'login': '/api/v1/account/login/'
    };
});
