const cloudinary = require('cloudinary');
require('dotenv').config()

//configuring cloudinary SDK
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//exporting this handler to be used else where in the project
exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (feed) => {
            resolve({
                result: feed
            })
        }, {
            timeout: 900000000,
            resource_type: "auto",
            folder: folder
        })
    })
}
