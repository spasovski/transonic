define('apps_widget',
    ['app_selector', 'jquery', 'requests', 'settings', 'urls', 'z'],
    function(app_select, $, requests, settings, urls, z) {
    'use strict';

    var $apps_widget;
    var $apps_list;

    function get_app_ids() {
        var ids = [];
        $('.apps-widget .result').map(function() {
            ids.push(parseInt(this.getAttribute('data-id'), 10));
        });
        return ids;
    }

    z.page.on('loaded', function() {
        // Store selectors.
        $apps_widget = $('.apps-widget');
        $apps_list = $('.apps-widget .apps');
    })

    .on('click', '.apps-widget .actions .delete', function() {
        // Remove.
        var id = this.getAttribute('data-id');
        $apps_list.find('[data-id="' +  id + '"]').remove();
    })

    .on('click', '.apps-widget .actions .reorder', function() {
        var $this = $(this);
        var $app = $this.closest('.result');
        var id = $app.data('id');
        var all_ids = get_app_ids();
        var pos = all_ids.indexOf(id);
        var is_prev = $this.hasClass('prev');

        if ((is_prev && pos === 0) || pos === all_ids.length - 1) {
            return;
        }

        var swap_id = is_prev ? all_ids[pos - 1] : all_ids[pos + 1];
        var original = $apps_list.find('[data-id="' + swap_id + '"]');
        var clone = original.cloneNode();
        console.log($app);

    });

    var append = function(id) {
        if (get_app_ids().indexOf(id) !== -1) {
            return;
        }
        // Make app request to render app info template.
        requests.get(urls.api.unsigned.url('app', [id])).done(function(app) {
            $apps_list.append(app_select.render_result(app, true));
            $apps_widget.find('.app-helptext').remove();
        });
    };

    var set = function(id) {
        requests.get(urls.api.unsigned.url('app', [id])).done(function(app) {
            // Render the selected app as the selected featured app.
            $apps_list.find('.apps').html(app_select.render_result(app));
            // Set placeholder and hide results list.
            var $app_selector = $('.app-selector');
            $app_selector.find('#app-selector').val('')
                         .attr('placeholder', app.name)
                         .text();
            $app_selector.find('.result').remove();
        });
    };

    return {
        append: append,
        get_app_ids: get_app_ids,
        set: set,
    };
});