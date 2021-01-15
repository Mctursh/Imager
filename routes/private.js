const express = require('express');
const router = express.Router();
const passport = require("passport")
const flash = require("connect-flash")
const fs = require("fs")
const validate = require("../helper/validation")
const upload = require('../multer')
const cloudinary = require('../cloudinary')
const singleValidator = require("../helper/single-validator")
const privateSeed = require("../models/private-multi-seeder")
const privateSingle = require("../models/private-single-seeder")
const auth = require("../helper/is-logged-in")


router.post("/", auth, upload.any(), async (req, res) => {
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
        const uploader = async (path) => await cloudinary.uploads(path, 'Private/' + req.user.name);
        const { path } = result;
        const newData = await uploader(path)
        newData.result.googleID = req.user.googleID
        newData.result.name = name
        newData.result.description1 = description1;
        newData.result.description2 = description2;
        cloudinaryFeeds.push(newData)
        console.log(newData);
        fs.unlinkSync(path)
      }

      const docs = await privateSingle(cloudinaryFeeds)
      console.log(docs);
      if (docs == -1){
        req.flash("error", msg3)
      } else if (docs == 1) {
        req.flash("success", msg4)
      }
      res.redirect("/private")
    } else if (imageData.length > 1) {
      const results = validate(imageData)
      if (typeof(results) == "string") {
        req.flash("error", results)
        res.redirect("/")
      } else if (typeof(results) == "object") {
        const uploader = async (path) => await cloudinary.uploads(path, 'Private/' + req.user.name);
        for (result of results) {
          const { path } = result;
          const newData = await uploader(path)
          newData.result.googleID = req.user.googleID
          newData.result.name = name
          newData.result.description1 = description1;
          newData.result.description2 = description2;
          cloudinaryFeeds.push(newData)
          console.log(newData);
          fs.unlinkSync(path)
        }
        const docs = await privateSeed(cloudinaryFeeds)
        console.log(docs);
        if (docs == -1){
          req.flash("error", msg3)
        } else if (docs == 1) {
          req.flash("success", msg4)
        }
        res.redirect("/private")
      }
    }
  }
})


module.exports = router
