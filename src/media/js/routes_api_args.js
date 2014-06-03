define('routes_api_args', [], function() {
    return function() {
        // This function should return an object containing the data to be
        // added to each API URL.
        return {
            // No lang because we want to modify the full l10n objects.
            lang: (navigator.l10n && navigator.l10n.language) || navigator.language || navigator.userLanguage
        };
    };

});
