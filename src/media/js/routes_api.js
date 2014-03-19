define('routes_api', [], function() {
    return {
        'login': '/api/v1/account/login/',

        'app': '/api/v1/apps/app/{0}/?cache=1&vary=0',
        'search': '/api/v1/apps/search/suggest?cache=1&vary=0',
    };
});
