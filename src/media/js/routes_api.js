define('routes_api', [], function() {
    return {
        'login': '/api/v1/account/login/',
        'logout': '/api/v1/account/logout/',

        'app': '/api/v1/apps/app/{0}/?cache=1&vary=0',
        'collections': '/api/v2/feed/collections/?limit=5',
        'collections-list': '/api/v2/feed/collections/?limit=5&serializer=search',
        'collection': '/api/v2/feed/collections/{0}/',
        'collection-image': '/api/v2/feed/collections/{0}/image/',
        'feed-apps': '/api/v2/feed/apps/?limit=5',
        'feed-apps-list': '/api/v2/feed/apps/?limit=5&serializer=search',
        'feed-app': '/api/v2/feed/apps/{0}/',
        'feed-app-image': '/api/v2/feed/apps/{0}/image/',
        'feed-brands': '/api/v2/feed/brands/?limit=5',
        'feed-brands-list': '/api/v2/feed/brands/?limit=5&serializer=search',
        'feed-brand': '/api/v2/feed/brands/{0}/',
        'feed-shelves': '/api/v2/feed/shelves/?limit=5',
        'feed-shelves-list': '/api/v2/feed/shelves/?limit=5&serializer=search',
        'feed-shelf': '/api/v2/feed/shelves/{0}/',
        'feed-shelf-image': '/api/v2/feed/shelves/{0}/image/',
        'feed-shelf-publish': '/api/v2/feed/shelves/{0}/publish/',
        'feed-items': '/api/v2/feed/items/',
        'feed-builder': '/api/v2/feed/builder/',
        'feed-element-search': '/api/v2/feed/elements/search/',
        'search': '/api/v1/apps/search/suggest?cache=1&vary=0',
    };
});
