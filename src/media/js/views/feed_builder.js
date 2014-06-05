define('views/feed_builder', [], function() {
    return function(builder) {
        builder.z('title', gettext('Feed Builder'));
        builder.z('type', 'builder');
        builder.start('feed_builder.html');
    };
});
