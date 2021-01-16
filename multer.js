const multer = require('multer');

//configuring type of storage for parsing and storing files to our server with multer
const storage = multer.diskStorage({
    //destination for storing incoming files
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    //setting the name the file will carry in the new location it is stored in
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
})

//middleware used in our routes to store incoming files
const upload = multer({
  storage: storage
})


module.exports = upload;
