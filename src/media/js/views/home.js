define('views/home', ['l10n'], function(l10n) {

    var gettext = l10n.gettext;

    return function(builder) {
        builder.start('home.html').done(function() {
            initTabs();
        });

        builder.z('title', gettext('Curation Tools'));
        builder.z('type', 'create');
        builder.start('home.html');
    };
});
