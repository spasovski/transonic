define('views/feed_modules_demo',
       ['feed_module_previews', 'l10n', 'requests', 'settings', 'urls'],
       function(previews, l10n, requests, settings, urls) {

    var gettext = l10n.gettext;

    function initCollectionList() {
        requests.get(urls.api.url('collections')).done(function(result) {
            var collections = result.objects;

            for (var i = 0; i < collections.length; i++) {
                if (collections[i].collection_type < 2) { // User/Editor
                    previews.createEditorCollection($('.editor'), collections[i]);
                    previews.createUserCollection($('.user'), collections[i]);
                } else if (collections[i].collection_type === 2) { // Featured App
                    previews.createFeaturedApp($('.featured-app'), collections[i]);
                } else if (collections[i].collection_type === 3) { // Mega
                    previews.createMegaCollection($('.mega-collection'), collections[i]);
                } else if (collections[i].collection_type === 4) { // Op Shelf
                    previews.createOperatorShelf($('.operator-shelf'), collections[i]);
                }
            }
        }).fail(function() {
            alert('Excuse to use an alert since this is a demo page. The API call to collecion_list failed. Are you running Flue?');
        });
    }

    return function(builder) {
        builder.start('feed_modules_demo.html').done(function() {
            initCollectionList();
        });

        builder.z('type', 'root');
        builder.z('title', gettext('Feed Module Demo Page'));
    };
});
