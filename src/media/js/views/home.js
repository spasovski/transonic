define('views/home', ['l10n', 'settings'], function(l10n, settings) {

    var gettext = l10n.gettext;

    return function(builder) {
        builder.z('title', gettext('Curation Tools'));
        builder.z('type', 'create');
        builder.start('home.html');
    };
});
