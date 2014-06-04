define('utils_local', ['jquery', 'log'], function($, log) {
    var console = log('utils_local');

    var build_localized_field = function(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    };

    return {
        build_localized_field: build_localized_field
    };
});
