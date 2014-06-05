define('helpers_local', ['brands', 'nunjucks', 'urls', 'z'], function(brands, nunjucks, urls, z) {
    var filters = nunjucks.require('filters');
    var globals = nunjucks.require('globals');

    globals.brands_module = brands;

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
