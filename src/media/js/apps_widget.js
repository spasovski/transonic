define('apps_widget',
    ['app_selector', 'jquery', 'jquery-sortable', 'nunjucks', 'requests', 'settings', 'underscore', 'urls', 'z'],
    function(app_select, $, sortable, nunjucks, requests, settings, _, urls, z) {
    'use strict';

    function get_app_ids() {
        var ids = [];
        $('.apps-widget .result').map(function() {
            ids.push(parseInt(this.getAttribute('data-id'), 10));
        });
        return ids;
    }

    z.page.on('click', '.apps-widget .actions .delete', function() {
        /* Remove app. */
        $(this).closest('.result').remove();
        z.page.trigger('refresh_preview');
    })
    .on('click', '.apps-widget .delete-app-group', function() {
        /* Remove app group. */
        $(this).closest('.result').remove();
        z.page.trigger('refresh_preview');
    })
    .on('click', '.apps-widget .actions .reorder', function() {
        /* Reorder elements. */
        var $this = $(this);
        var $app = $this.closest('.result');
        var id = $app.data('id');
        var is_prev = $this.hasClass('prev');
        var $items = $this.closest('.apps-widget').find('.result:not(.hidden)');  // Hidden for the localized fields.
        var pos = $items.index($app);

        if ((is_prev && pos === 0) || (!is_prev && pos == $items.length - 1)) {
            // Don't swap if trying to move the first element up or last element down.
            return;
        }

        var swap_pos = is_prev ? pos - 1 : pos + 1;
        var $swap_with = $items.filter(':not(.hidden)').eq(swap_pos);

        if (is_prev) {
            $app.clone().insertBefore($swap_with);
        } else {
            $app.clone().insertAfter($swap_with);
        }
        $app.remove();
        z.page.trigger('refresh_preview');
    });

    var set = function(app) {
        /* Given an app object, render it in the widget. */
        if (_.isObject(app.name)) {
            // Choose an app name translation.
            app.name = app.name['en-US'] || app.name[Object.keys(app.name)[0]];
        }

        // Hard-code JQuery because it is run async.
        $('.apps-widget .apps').html(app_select.render_result(app));

        // Set placeholder and hide results list.
        var $app_selector = $('.app-selector');
        $app_selector.find('#app-selector').val('')
                     .attr('placeholder', app.name)
                     .text();
        $app_selector.find('.result').remove();
        $app_selector.find('input[name="app"]').val(app.id);
        z.page.trigger('refresh_preview');
    };

    var append = function(app) {
        if (get_app_ids().indexOf(parseInt(app.id, 10)) !== -1) {
            return;
        }

        // Render it in the widget.
        var $apps_widget = $('.apps-widget');
        $apps_widget.find('.apps').append(app_select.render_result(app, true));
        $apps_widget.find('.placeholder-text').hide();
        $apps_widget.find('.apps').sortable();
        z.page.trigger('refresh_preview');
    };

    var add_group = function(app_group) {
        /* Add a localizable text field as the header of an app group. */
        var $apps_widget = $('.apps-widget');
        $apps_widget.find('.apps').append(nunjucks.env.render('fields/app_group.html', {
            app_group: app_group || {},
            app_group_id: 'app-group-' + $('.app-group').length
        }));
        $apps_widget.find('.placeholder-text').hide();
        z.page.trigger('refresh_preview');
    };

    return {
        add_group: add_group,
        append: append,
        get_app_ids: get_app_ids,
        set: set,
    };
});
