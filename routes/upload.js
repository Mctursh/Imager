const express = require('express');
const router = express.Router();
const passport = require("passport")
const flash = require("connect-flash")
// const cloudinary = require("cloudinary").v2;
const Public = require("../models/publicimages")
const tou8 = require('buffer-to-uint8array')
const fs = require("fs")
const validate = require("../helper/validation")
const upload = require('../multer')
const cloudinary = require('../cloudinary')

// //configuring our cloudinary
// cloudinary.config({
//   cloud_name: "mctursh" ,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

router.post("/", upload.array('image'), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Public');
  const imageData = req.files
  const urls = []
  console.log(imageData);
  if (!req.files) {
    req.flash("error", "no image selected")
    res.redirect("/")
  } else {
    if (imageData.length == undefined) {

    } else if (imageData.length > 0) {
      let msg1 = "file larger than 2MB"
      let msg2 = "invalid file format"
      const results = validate(imageData)
      if (results.includes(msg1) || results.includes(msg2)) {
        const amountOfmsg1 = results.filter(e => {e == msg1}).length
        const amountOfmsg2 = results.filter(f => {f == msg2}).length
        if (amountOfmsg1 > 1) {
          req.flash("error", "some files are larger than 2MB")
          res.redirect("/")
        } else {
          req.flash("error", msg1)
          res.redirect("/")
        }
        if (amountOfmsg2 > 1) {
          req.flash("error", "some files are of invalid format")
          res.redirect("/")
        } else {
          req.flash("error", msg2)
          res.redirect("/")
        }
      } else {
        for (result of results) {
          const { path } = result;
          const newData = await uploader(path)
          urls.push(newData)
          console.log(newData);
          fs.unlinkSync(path)
          // result.mv("../uploads/" + result.name);
          // cloudinary.uploader.upload("../uploads/" + result.name,{
          //   public_id: "first upload",
          //   folder: "samples/public",
          //   resource_type: "auto",
          //   overwrite: false
          // },(feed, error) => {
          //     if (error) {
          //       console.log(error);
          //     } else {
          //     console.log(feed);
          //     // fs.unlink("../uploads/" + image.name, () => {
          //     //   console.log("succefully deleted" + image.name);
          //     // })
          //   }
          // })
        }
      }
    }
  }
})

module.exports = router;
