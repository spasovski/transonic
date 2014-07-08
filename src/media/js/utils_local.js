define('utils_local', ['jquery', 'log'], function($, log) {
    var console = log('utils_local');

    function build_error_msg(error) {
        // {'slug': ['This field is required.']} to 'This field is required.'.
        var errs = [];
        error = JSON.parse(error);
        error_keys = Object.keys(error);
        for (var i = 0; i < error_keys.length; i++) {
            errs.push(error[error_keys[i]][0]);
        }
        return errs.join(' ');
    }

    function build_localized_field(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    };

    function items(obj) {
        // Like Python's dict.items().
        var items = [];
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var item = [];
            item.push(keys[i]);
            item.push(obj[keys[i]]);
            items.push(item);
        }
        return items;
    };

    return {
        build_error_msg: build_error_msg,
        build_localized_field: build_localized_field,
        items: items
    };
});
