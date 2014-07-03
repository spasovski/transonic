define('utils_local', ['jquery', 'l10n', 'log', 'underscore'],
       function($, l10n, log, _) {

    var console = log('utils_local');
    var ngettext = l10n.ngettext;

    var build_localized_field = function(name) {
        var data = {};
        $('.localized[data-name="' + name + '"]').each(function(i, field) {
            data[this.getAttribute('data-lang')] = this.value;
        });
        return data;
    };

    var items = function(obj) {
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

    function betterCharCount() {
        var countChars = function(el, cc) {
            var $el = $(el);
            var max = parseInt($el.attr('maxlength'), 10);
            var left = max - $el.val().length;
            // L10n: {n} is the number of characters left.
            cc.html(ngettext('<b>{n}</b> character left.',
                             '<b>{n}</b> characters left.', {n: left}))
              .toggleClass('error', left < 0);
        };
        $('.char-count').each(function() {
            var $cc = $(this);
            $cc.closest('form')
               .find('textarea')
               // Note 'input' event is need for FF android see (bug 976262)
               .on('input blur', _.throttle(function() {countChars(this, $cc);}, 250))
               .trigger('blur');
        });
    }

    return {
        betterCharCount: betterCharCount,
        build_localized_field: build_localized_field,
        items: items
    };
});
