define('views/home', ['feed_previews', 'l10n'], function(feed_previews, l10n) {

    var gettext = l10n.gettext;

    return function(builder) {
        builder.z('title', gettext('Curation Tools'));
        builder.z('type', 'create');
        builder.start('home.html');

        feed_previews.empty();
    };
});
