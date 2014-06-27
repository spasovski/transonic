console.log('Firefox Marketplace Curation Tools');

require.config({
    enforceDefine: true,
    paths: {
        'jquery': 'lib/jquery-2.0.2',
        'underscore': 'lib/underscore',
        'nunjucks': 'lib/nunjucks',
        'nunjucks.compat': 'lib/nunjucks.compat',
        'templates': '../../templates',
        'settings': ['settings_local', 'settings'],
        'format': 'lib/format'
    }
});

define(
    'main',
    [
        'helpers',  // Must come before mostly everything else.
        'helpers_local',
        'forms',  // Comment this if your app has no forms.
        'l10n',
        'log',
        'login',  // Comment this if your app does not have accounts.
        'navigation',
        'templates',
        'user',  // Comment this if your app does not have accounts.
        'z'
    ],
function() {
    var console = require('log')('main');
    var urls = require('urls');
    var user = require('user');
    var z = require('z');

    console.log('Dependencies resolved, starting init');

    z.body.addClass('html-' + require('l10n').getDirection());

    z.page.one('loaded', function() {
        console.log('Hiding splash screen');
        $('#splash-overlay').addClass('hide');
        $('main').after(
            nunjucks.env.render('feed_previews.html'));
    });

    // Do some last minute template compilation.
    var nunjucks = require('templates');
    z.page.on('reload_chrome', function() {
        console.log('Reloading chrome');
        $('#site-header').html(
            nunjucks.env.render('header.html'));
        $('#site-footer').html(
            nunjucks.env.render('footer.html'));
        $('#site-nav').html(
            nunjucks.env.render('nav.html'));

        z.body.toggleClass('logged-in', require('user').logged_in());
        z.page.trigger('reloaded_chrome');
    }).trigger('reload_chrome');

    z.body.on('click', '.site-header .back', function(e) {
        e.preventDefault();
        console.log('← button pressed');
        require('navigation').back();
    }).on('click', 'aside', function() {
        $(this).toggleClass('active');
    });

    z.page.on('loaded logged_in', function() {
        if (user.logged_in() && !user.get_permission('curator') &&
            !user.get_permission('admin')) {
            z.page.trigger('navigate', [urls.reverse('403')]);
        }
    });

    z.page.on('navigate', function(e, url) {
        if (url == urls.reverse('login')) {
            return;
        }
        if (!user.logged_in()) {
            z.page.trigger('navigate', [urls.reverse('login')]);
        }
    });

    z.page.on('click', '.loadmore', function() {
        var $btn = $(this).find('button');
        $btn.text(gettext('Loading...'));
        z.page.one('loaded_more', function() {
            $btn.text(gettext('More'));
        });
    });

    // Perform initial navigation.
    console.log('Triggering initial navigation');
    z.page.trigger('navigate', [window.location.pathname + window.location.search]);
    z.page.trigger('loaded');

    console.log('Initialization complete');
});
