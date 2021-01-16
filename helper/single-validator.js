const validMimetype = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/tiff", "image/tif", "image/psd"]
const maxSize = 2 * 1024 * 1024

//helper that validates ifa file is valid or not
module.exports = function (currentImage) {
  if (currentImage[0].size > maxSize) {
    let msg1 = "file larger than 2MB";
    return msg1
  } else if (!validMimetype.includes(currentImage[0].mimetype)) {
    let msg2 = "invalid file format";
    return msg2
  } else {
    return currentImage[0]
  }
}
