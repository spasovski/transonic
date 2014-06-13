define('helpers_local', ['feed', 'nunjucks', 'urls', 'utils_local', 'z'], function(feed, nunjucks, urls, utils_local, z) {
    var filters = nunjucks.require('filters');
    var globals = nunjucks.require('globals');

    globals.feed = feed;

    filters.items = utils_local.items;

    filters.unslug = function(str) {
        // Change underscores to spaces and text-transform uppercase.
        return str.replace(/_/g, ' ')
                  .replace(/(^| )(\w)/g, function(x) {
                      return x.toUpperCase();
                  });
    };

    function indexOf(arr, val) {
        return arr.indexOf(val);
    }

    // Functions provided in the default context.
    var helpers = {
        indexOf: indexOf,
        api_base: urls.api.base.url,
    };

    // Put the helpers into the nunjucks global.
    for (var i in helpers) {
        if (helpers.hasOwnProperty(i)) {
            globals[i] = helpers[i];
        }
    }

    return helpers;
});
