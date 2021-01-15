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
const publicSeed = require("../models/multi-seeder")
const publicSingle = require("../models/public-single-upload")


router.post("/", upload.any(), async (req, res) => {
  const imageData = req.files
  console.log(req.body);
  const name = req.body.name
  const description1 = req.body.description1
  const description2 = req.body.description2
  const cloudinaryFeeds = []
  let msg1 = "file larger than 2MB"
  let msg2 = "invalid file format"
  let msg3 = "upload failed, please try again"
  let msg4 = "successfully uploaded images"
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
        newData.result.name = name
        newData.result.description1 = description1;
        newData.result.description2 = description2;
        cloudinaryFeeds.push(newData)
        console.log(newData);
        fs.unlinkSync(path)
      }

      const docs = await publicSingle(cloudinaryFeeds);
      console.log(docs);
      if (docs == -1){
        req.flash("error", msg3)
      } else if (docs == 1) {
        req.flash("success", msg4)
      }
      res.redirect("/")
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
          newData.result.name = name
          newData.result.description1 = description1;
          newData.result.description2 = description2;
          cloudinaryFeeds.push(newData)
          console.log(newData);
          fs.unlinkSync(path)
        }
        const docs = await publicSeed(cloudinaryFeeds)
        console.log(docs);
        if (docs == -1){
          req.flash("error", msg3)
        } else if (docs == 1) {
          req.flash("success", msg4)
        }
        res.redirect("/")
      }
    }
  }
})

module.exports = router;
