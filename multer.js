const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
})


const fileFilter = (req, file, cb) => {
  const validMimetype = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/tiff", "image/tif", "image/psd"]
  if (validMimetype.includes(file.mimetype)) {
      cb(null, true)
  } else {
      //reject file
      cb({message: 'Unsupported file format'}, false)
  }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
})


module.exports = upload;
