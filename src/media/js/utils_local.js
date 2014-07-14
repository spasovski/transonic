define('utils_local', ['jquery', 'log'], function($, log) {
    var console = log('utils_local');

    function build_error_msg(error) {
        // {'slug': ['This field is required.']} to 'This field is required.'.
        var errs = [];
        if (typeof error === 'string') {
            error = JSON.parse(error);
        }
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

    // Character counter based from utils.
    // Don't use this on other projects - it's terrible.
    function initCharCounter() {
        function getRemaining($elm) {
            var max = parseInt($elm.attr('maxlength'), 10);
            return max - $elm.val().length;
        }

        $('.char-count').each(function() {
            var $this = $(this);
            var $textarea = $('textarea[data-name=' + $this.data('for') + ']:not(.hidden)');

            $this.html(
                ngettext('<b>{n}</b> character remaining.',
                         '<b>{n}</b> characters remaining.',
                         {n: getRemaining($textarea)})
            );
        });

        $('textarea[maxlength]').off('input').on('input', function() {
            // L10n: {n} is the number of characters remaining.
            $('.char-count').html(
                ngettext('<b>{n}</b> character remaining.',
                         '<b>{n}</b> characters remaining.',
                         {n: getRemaining($(this))})
            );
        });
    }

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
        initCharCounter: initCharCounter,
        items: items
    };
});
