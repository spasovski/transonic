define('collectify', ['templates'], function(nunjucks) {


    // These are user and editor collections for now.
    // There will likely be a distinction in practice.
    function createSimpleCollection($parent, collection) {
        $parent.append(
            nunjucks.env.render('tiles/collection_tile.html', collection)
        );
    }

    function createFeaturedApp($parent, app) {
        $parent.append(
            nunjucks.env.render('tiles/collection_tile.html', app)
        );
    }

    function createMegaCollection($parent, collection) {
        $parent.append(
            nunjucks.env.render('tiles/mega_collection_tile.html', collection)
        );

        $parent.find('.collection').css('background-image',
                                        'url("' + collection.bg_image + '")');
    }

    function createOperatorShelf($parent, shelf) {
        shelf.apps = null;

        $parent.append(
            nunjucks.env.render('tiles/collection_tile.html', shelf)
        );

        $parent.find('.collection').css('background-image',
                                        'url("' + shelf.bg_image + '")')
               .addClass('shelf')
               .find('.author').hide();
    }

    return {
        createEditorCollection: createSimpleCollection,
        createUserCollection: createSimpleCollection,
        createFeaturedApp: createFeaturedApp,
        createMegaCollection: createMegaCollection,
        createOperatorShelf: createOperatorShelf
    }
});
