define('utils_local', ['jquery', 'log', 'notification', 'nunjucks', 'z'], function($, log, notification, nunjucks, z) {
    var console = log('utils_local');

    function build_localized_field(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    };

    function handle_error(errors) {
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

    function clear_errors(error) {
        $('.form-errors').empty();
        $('.error-msg').remove();
        $('.has-error').removeClass('has-error');
    }

    function render_errors(errors) {
        clear_errors();

        // Server-side validation returns the raw body of the response as a string.
        if (typeof errors === 'string') {
            errors = JSON.parse(errors);
        }

        // Handle field-specific errors.
        $.each(errors, function(field, message) {
            var $field = $('[data-error-field*="' + field + '"]');
            if ($field.length) {
                var msg = nunjucks.env.render('errors/field_error.html', {
                    message: message
                });
                $field.addClass('has-error').append(msg);
                delete errors[field];
            }
        });

        // Handle form-wide errors.
        if (!$.isEmptyObject(errors)) {
            $('.form-errors').html(nunjucks.env.render('errors/form_errors.html', {
                errors: errors
            }));
        }

        z.win[0].scrollTo(0, 0);
    }

    return {
        build_localized_field: build_localized_field,
        clear_errors: clear_errors,
        handle_error: handle_error,
        initCharCounter: initCharCounter,
        items: items,
        render_errors: render_errors
    };
});
