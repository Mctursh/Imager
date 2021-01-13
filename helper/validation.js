const validMimetype = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/tiff", "image/tif", "image/psd"]
const maxSize = 2 * 1024 * 1024


module.exports = function(arr) {
  let imageArray = [];
  for (let i = 0; i < arr.length; i++) {
    let currentImage = arr[i];
    if (currentImage.size > maxSize) {
      let msg1 = "file larger than 2MB";
      return msg1
    } else if (!validMimetype.includes(currentImage.mimetype)) {
      let msg2 = "invalid file format";
      return msg2
    } else {
      imageArray.push(currentImage)
    }
  }
  return imageArray
}
