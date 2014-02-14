define('views/home', ['l10n', 'settings'], function(l10n, settings) {

    var gettext = l10n.gettext;

    function initTabs() {
        $('.tabs').on('click', 'a', function() {
            $('.tabs a, .tab').removeClass('active');
            $('#' + this.className).addClass('active');
            this.classList.add('active');
        });
    }

    return function(builder) {
        builder.start('home.html').done(function() {
            initTabs();

            $('#preview').attr('src', settings.api_url);
        });

        builder.z('type', 'root');
        builder.z('title', gettext('Curation Tools'));
    };
});
