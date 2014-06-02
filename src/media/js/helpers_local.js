define('helpers_local', ['nunjucks', 'z'], function(nunjucks, z) {
    var filters = nunjucks.require('filters');
    var globals = nunjucks.require('globals');

    function indexOf(arr, val) {
        return arr.indexOf(val);
    }

    // Functions provided in the default context.
    var helpers = {
        indexOf: indexOf
    };

    // Put the helpers into the nunjucks global.
    for (var i in helpers) {
        if (helpers.hasOwnProperty(i)) {
            globals[i] = helpers[i];
        }
    }

    return helpers;
});
