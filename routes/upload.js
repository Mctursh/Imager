const express = require('express');
const router = express.Router();
const passport = require("passport")
const flash = require("connect-flash")
const Public = require("../models/publicimages")
const tou8 = require('buffer-to-uint8array')
const fs = require("fs")
const validate = require("../helper/validation")
const upload = require('../multer')
const cloudinary = require('../cloudinary')
const singleValidator = require("../helper/single-validator")


router.post("/", upload.array('image'), async (req, res) => {
  const imageData = req.files
  const urls = []
  let msg1 = "file larger than 2MB"
  let msg2 = "invalid file format"
  if (imageData.length == 0) {
    req.flash("error", "no image selected")
    res.redirect("/")
  } else {
    if (imageData.length == 1) {
      const result = singleValidator(imageData)
      if (result == msg1) {
        req.flash("error", msg1)
        res.redirect("/")
      } else if (result == msg2) {
        req.flash("error", msg2)
        res.redirect("/")
      } else {
        const uploader = async (path) => await cloudinary.uploads(path, 'Public');
        const { path } = result;
        const newData = await uploader(path)
        urls.push(newData)
        console.log(newData);
        fs.unlinkSync(path)
      }
    } else if (imageData.length > 1) {
      const results = validate(imageData)
      if (typeof(results) == "string") {
        req.flash("error", results)
        res.redirect("/")
      } else if (typeof(results) == "object") {
        const uploader = async (path) => await cloudinary.uploads(path, 'Public');
        for (result of results) {
          const { path } = result;
          const newData = await uploader(path)
          urls.push(newData)
          console.log(newData);
          fs.unlinkSync(path)
        }
      }
    }
  }
})

module.exports = router;
