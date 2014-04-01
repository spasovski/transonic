(function() {

var root = '^/curationtools';

// Please leave quotes around keys! They're needed for Space Heater.
var routes = window.routes = [
    {'pattern': root + '/?$', 'view_name': 'home'},
    {'pattern': '^/$', 'view_name': 'home'},
    {'pattern': '^/curate$', 'view_name': 'home'},
    {'pattern': '^/curate/create/([^/<>"\']+)$', 'view_name': 'create'},
    {'pattern': root + '/create\-collection/$', 'view_name': 'create_collection'},
    {'pattern': root + '/create\-collection$', 'view_name': 'create_collection'},

    {'pattern': '^/tests$', 'view_name': 'tests'},
    {'pattern': '^/debug$', 'view_name': 'debug'}
];

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
