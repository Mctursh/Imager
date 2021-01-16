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

//handling all post request to the private posting route
router.post("/", auth, upload.any(), async (req, res) => {
  const imageData = req.files
  const name = req.body.name
  const description1 = req.body.description1
  const description2 = req.body.description2
  const cloudinaryFeeds = []
  let msg1 = "file larger than 2MB"
  let msg2 = "invalid file format"
  let msg3 = "upload failed, please try again"
  let msg4 = "successfully uploaded images"

  //checks and runs if no data was passed
  if (imageData.length == 0) {
    req.flash("error", "no image selected")
    res.redirect("/")
  } else {
    //checks and runs if only one data was passed
    if (imageData.length == 1) {
      const result = singleValidator(imageData)    //A validator helper function that checks if a file is of valid type
      if (result == msg1) {
        req.flash("error", msg1)
        res.redirect("/")
      } else if (result == msg2) {
        req.flash("error", msg2)
        res.redirect("/")
      } else {
        //instatiating an asynchronous funciton to upload items to the cloudinary
        const uploader = async (path) => await cloudinary.uploads(path, 'Private/' + req.user.name);
        const { path } = result;
        const newData = await uploader(path)
        newData.result.googleID = req.user.googleID
        newData.result.name = name
        cloudinaryFeeds.push(newData)
        //deleting the uploaded file from our local server for safety reasons
        fs.unlinkSync(path)
      }
      //this helper add recently uploaded image details to the DB
      const docs = await privateSingle(cloudinaryFeeds)

      //validating if the helper function succeded in its operation
      if (docs == -1){
        req.flash("error", msg3)
      } else if (docs == 1) {
        req.flash("success", msg4)
      }
      res.redirect("/private")

      // checks and runs if more than one data was passed to the req.body
    } else if (imageData.length > 1) {
      //helper for validiting uploaded files
      const results = validate(imageData)

      //validating the return value from the helper
      //runs if atleat one file fails to upload
      if (typeof(results) == "string") {
        req.flash("error", results)
        res.redirect("/")

        //checks and runs if all filese were uploaded succefully
      } else if (typeof(results) == "object") {
        //helper for uploading files to cloudinary
        const uploader = async (path) => await cloudinary.uploads(path, 'Private/' + req.user.name);
        for (result of results) {
          const { path } = result;
          const newData = await uploader(path)
          newData.result.googleID = req.user.googleID
          newData.result.name = name
          cloudinaryFeeds.push(newData)
          fs.unlinkSync(path)
        }
        //adds data to DB
        const docs = await privateSeed(cloudinaryFeeds)

        //validating if any error occured during seeding to DB
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
