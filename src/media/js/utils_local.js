define('utils_local', ['jquery', 'log', 'notification', 'nunjucks'], function($, log, notification, nunjucks) {
    var console = log('utils_local');

    function build_error_msg(error) {
        // {'slug': ['This field is required.']} to ['This field is required.'].
        var errs = [];
        if (typeof error === 'string') {
            error = JSON.parse(error);
        }
        error_keys = Object.keys(error);
        for (var i = 0; i < error_keys.length; i++) {
            errs.push(error[error_keys[i]][0]);
        }
        return errs;
    }

    function build_localized_field(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    };

    function handle_error(errors) {
        if (typeof errors === 'string') {
            errors = build_error_msg(errors);
        }
        notification.notification({message: gettext('Sorry, we found some errors in the form.')});
        render_errors(errors);
    }

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

    function render_errors(errors) {
        $('.form-errors').html(nunjucks.env.render('errors/form_errors.html', {
            errors: errors
        }));
    }

    return {
        build_error_msg: build_error_msg,
        build_localized_field: build_localized_field,
        handle_error: handle_error,
        initCharCounter: initCharCounter,
        items: items,
        render_errors: render_errors
    };
});
