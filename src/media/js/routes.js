(function() {

var root = '^/curate/';

// Please leave quotes around keys! They're needed for Space Heater.
var routes = window.routes = [
    {'pattern': '^/$', 'view_name': 'home'},
    {'pattern': root + 'login$', 'view_name': 'login'},
    {'pattern': root + '403$', 'view_name': '403'},
    {'pattern': root + '$', 'view_name': 'home'},
    {'pattern': root + 'create/([^/<>"\']+)$', 'view_name': 'create'},
    {'pattern': root + 'manage$', 'view_name': 'listing'},
    {'pattern': root + 'manage/([^/<>"\']+)/([^/<>"\']+)$', 'view_name': 'edit'},
    {'pattern': root + 'feed$', 'view_name': 'feed_builder'},
    {'pattern': root + 'demo$', 'view_name': 'feed_modules_demo'},
];

// Only `require.js` has `window.require.defined`, so we can use this to
// sniff for whether we're using the minified bundle or not. (In production
// we use commonplace's `amd.js`.)
if (window.require.hasOwnProperty('defined')) {
    // The minified JS bundle doesn't need some dev-specific JS views.
    // Those go here.
    routes = routes.concat([
        {'pattern': '^/tests$', 'view_name': 'tests'}
    ]);
}

define(
    'routes',
    routes.map(function(i) {return 'views/' + i.view_name;}),
    function() {
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var view = require('views/' + route.view_name);
            route.view = view;
        }
        return routes;
    }
);

})();
