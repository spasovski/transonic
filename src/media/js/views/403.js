define('views/403', ['l10n', 'user', 'urls', 'z'], function(l10n, user, urls, z) {
    var gettext = l10n.gettext;

    return function(builder) {
        if (!user.logged_in()) {
            z.page.trigger('navigate', [urls.reverse('login')]);
        } else {
            builder.start('errors/403.html');
            builder.z('type', 'leaf login');
            builder.z('title', gettext('Permission Denied'));
        }
    };
});
