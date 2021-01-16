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

// $(".gallery-images").on("click",function() {
//   let id = $(this).data("id")
//   $("a").attr("href", $("a").attr("href") + `${id}`)
//   console.log(id);
// })

$(".gallery-images").click(function() {
  let pic = $(this).data("pic_id")
  $("[data-pic_id=" + pic + "]").toggleClass("selected")
  $("[data-pic_id=" + pic + "]").prop("disabled", function(index, attr) {
    return attr == true ? false : true;
  })
})
