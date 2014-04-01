define('views/create_collection',
       ['collectify', 'l10n', 'requests', 'settings', 'urls'],
       function(coll, l10n, requests, settings, urls) {

    var gettext = l10n.gettext;

    function initCollectionList() {
        requests.get(urls.api.url('collection_list')).done(function(result) {
            var collections = result.objects;

            for (var i = 0; i < collections.length; i++) {
                if (collections[i].collection_type < 2) { // User/Editor
                    coll.createEditorCollection($('.editor'), collections[i]);
                    coll.createUserCollection($('.user'), collections[i]);
                } else if (collections[i].collection_type === 2) { // Featured App
                    coll.createFeaturedApp($('.featured-app'), collections[i]);
                } else if (collections[i].collection_type === 3) { // Mega
                    coll.createMegaCollection($('.mega-collection'), collections[i]);
                } else if (collections[i].collection_type === 4) { // Op Shelf
                    coll.createOperatorShelf($('.operator-shelf'), collections[i]);
                }
            }
        }).fail(function() {
            alert('Excuse to use an alert since this is a demo page. The API call to collecion_list failed. Are you running Flue?');
        });
    }

    return function(builder) {
        builder.start('collection_demo.html').done(function() {
            initCollectionList();
        });

        builder.z('type', 'root');
        builder.z('title', gettext('Collection Demo Page'));
    };
});
