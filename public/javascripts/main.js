$(function() {
    // Multiple images preview in browser
    var imagesPreview = function(input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function(event) {
                  $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    $('#formFileMultiple').on('change', function() {
        imagesPreview(this, '.image-preview');
    });
});

//
// function getDataUri(url, callback) {
//     var image = new Image();
//
//     image.onload = function () {
//         var canvas = document.createElement('canvas');
//         canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
//         canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
//
//         canvas.getContext('2d').drawImage(this, 0, 0);
//
//         // Get raw image data
//         callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
//
//         // ... or get as Data URI
//         callback(canvas.toDataURL('image/png'));
//     };
//
//     image.src = url;
// }
//
// // Usage
// getDataUri('/logo.png', function(dataUri) {
//     // Do whatever you'd like with the Data URI!
// })
