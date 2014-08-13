define('aviary', ['defer', 'jquery', 'l10n', 'z'], function(defer, $, l10n, z) {
    var gettext = l10n.gettext;

    // Read the Aviary docs for reference:
    // http://developers.aviary.com/docs/web/setup-guide
    var featherEditor = new Aviary.Feather({
        apiKey: '18dd09ec2d40f716',
        apiVersion: 3,
        onSave: function(imageID, newURL) {
            var img = document.getElementById(imageID);

            // Replace the contents of the preview box + dimensions.
            preview($(img).closest('.aviary').data('aviary-type'), newURL);

            // This is the URL that gets POST'd to the API.
            // TODO: As there will be multiple fields for screenshots,
            // we need to update the correct hidden `input` field.
            $(img).siblings('.processed-aviary-url').val(newURL);

            // Close the editor.
            featherEditor.close();
        },
        onError: function(errorObj) {
            console.error(errorObj.message);
        }
    });

    function launchEditor(imageId, src) {
        // Launch the Aviary editor.
        // TODO: min/maxSize and cropPresets.
        var config = {
            image: imageId,
            url: src
        };

        // Get configuration from .aviary.
        var dataset = $('#' + imageId).closest('.aviary')[0].dataset;
        for (var data in dataset) {
            try {
                // Try to parse objects.
                config[data] = JSON.parse(dataset[data]);
            } catch(e) {
                config[data] = dataset[data];
            }
        }

        featherEditor.launch(config);
    }

    function preview(type, src, launch) {
        // Update the image preview. Launch the editor if specified.
        var $filePreview = $('[data-aviary-type="' + type + '"] .preview');
        $filePreview.show();

        var img = $filePreview[0];
        img.src = src;
        img.onload = function() {
            $filePreview.siblings('.image-size').html(
                this.width + 'px &times; ' + this.height + 'px').show();
        };

        if (launch) {
            launchEditor(img.id, img.src);
        }
    }

    function getFileDataURI(input) {
        var def = defer.Deferred();

        if (input.files && input.files[0]) {
            // This is so we can get the data URI of the image uploaded.
            var reader = new FileReader();
            reader.onload = function (e) {
                def.resolve(e.target.result);
            };
            reader.onerror = function (err) {
                def.reject(err.getMessage());
            };
            reader.readAsDataURL(input.files[0]);
        }

        return def.promise();
    }

    function createAviaryURLInput($section) {
        // Creates Aviary URL inputs for each normal URL input.
        // URL inputs allow linking to an image directly, which the Aviary
        // editor will load.
        $section.append($('<input>', {
            'class': 'aviary-url',
            'type': 'url',
            'placeholder': $section.data('placeholder'),
            'pattern': 'https?://.*'
        }));
    }

    z.page.one('loaded', function() {
        $('.aviary .url-inputs').each(function() {
            var $this = $(this);
            createAviaryURLInput($this);
        });

    }).on('input', '.aviary input[type=url]', function(e) {
        var $input = $(e.target);
        var $allInputs = $input.parent().children('input[type=url]');
        var $emptyInputs = $allInputs.filter(function() {
            return !$(this).val();
        });

        if ($input.parent().data('multiple') && $input.val() &&
            $emptyInputs.length === 0) {
            createAviaryURLInput($input.parent());
        } else {
            // Only one empty input field for user to enter more URLs.
            $emptyInputs.slice(1).remove();
        }

    }).on('keypress', '.aviary input[type=url]', function(e) {
        var $this = $(this);

        if (this.checkValidity() && e.keyCode === 13) {
             // After it's been blurred, the editor will get launched.
             return this.blur();
         }

    }).on('change', '.aviary input[type=url]', function(e) {
        // Launch editor only when input is blurred.
        var $this = $(this);

        if (this.checkValidity()) {
            preview($this.closest('.aviary').data('aviary-type'),
                    $this.val(), true);
        }

    }).on('click', '.aviary .preview', function(e) {
        // Clicking on the image preview should open the image for re-processing.
        var $img = $(this);
        launchEditor($img.attr('id'), $img.siblings('.processed-aviary-url'));

    }).on('change', '.aviary input[type=file]', function(e) {
        // TODO: Allow images to be dragged and dropped to the file input.
        var input = this;
        var $input = $(input);
        input.blur();

        getFileDataURI(input).done(function(data) {
            preview($input.closest('.aviary').data('aviary-type'), data, true);
        }).fail(function (err) {
            return console.error(err);
        });

        $('.aviary [type="url"]').val($input.val());
    });

    return {
        launchEditor: launchEditor
    }
});
