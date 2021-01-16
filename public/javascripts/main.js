$(document).ready(function() {    //only runs when the DOM is ready and for manipulations and page has loaded
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

  //handler that manage effect on selected item for deleting
  $(".gallery-images").click(function() {
    let pic = $(this).data("pic_id")
    $("[data-pic_id=" + pic + "]").toggleClass("selected")
    $("[data-pic_id=" + pic + "]").prop("disabled", function(index, attr) {
      //tenary operator that uses the outcome of the expression before the bracket to determine the new value for the attr
      return attr == true ? false : true;
    })
  })

})
