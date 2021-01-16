var express = require('express');
var router = express.Router();
const passport = require("passport")
const flash = require("connect-flash")
const multer = require("../multer")
const auth = require("../helper/is-logged-in")
const Private = require("../models/privateimages")


/* GET home page. */
router.get('/', function(req, res, next) {
  const messageSuccess = req.flash("success")
  const messageFailure = req.flash("error")
  console.log(messageFailure);
  console.log(messageSuccess);
  const hasSuccess = messageSuccess.length > 0
  const hasError = messageFailure.length > 0
  res.render("index", {
    messageSuccess: messageSuccess,
    messageFailure: messageFailure,
    hasSuccess: hasSuccess,
    hasError: hasError
  });
});

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/auth/google/imager',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

router.get("/gallery", auth, (req, res) => {
  const messageSuccess = req.flash("success")
  const messageFailure = req.flash("error")
  console.log(messageFailure);
  console.log(messageSuccess);
  const hasSuccess = messageSuccess.length > 0
  const hasError = messageFailure.length > 0
  const userID = req.user.googleID
  Private.find({
      userGoogleID: userID
    }).lean()
    .exec((error, docs) => {
      if (error) {
        res.render("gallery", {
          error: error
        })
      } else {
        const chunckedData = []
        const chunkSize = 8
        for (let i = 0; i < docs.length; i += chunkSize) {
          chunckedData.push(docs.slice(i, i + chunkSize))
        }
        res.render("gallery", {
          chunckedData: chunckedData,
          messageSuccess: messageSuccess,
          messageFailure: messageFailure,
          hasSuccess: hasSuccess,
          hasError: hasError
        })
      }
    })
})

router.post("/delete", auth, async (req, res) => {
  const userID = req.user.googleID
  const assetID = req.body.asset
  if (assetID == undefined) {
    req.flash("error", "No picture selected, please select and try again")
    res.redirect("/gallery")
  }
  if (typeof(assetID) == "string") {
    await Private.findByIdAndDelete(assetID).then((resolve) => {
      req.flash("success", "succefully deleted picture")
      res.redirect("/gallery")
    }).catch((error) => {
      req.flash("error", "failed to delete picture")
      res.redirect("/gallery")
    })
    console.log("only one item to delete");
  } else if (typeof(assetID) == "object") {
    let amount = 0
    const deleter = async (each) => await Private.findByIdAndDelete(each)
    for(each of assetID) {
      const del = await deleter(each)
      amount++
    }
    if (amount == assetID.length) {
      req.flash("success", "Succefully deleted pictures")
    } else {
      req.flash("error", "Failed to delete pictures")
    }
    console.log(amount);
    console.log(assetID.length);
    res.redirect("/gallery")
  }
})

router.get("/private", auth, (req, res) => {
  const messageSuccess = req.flash("success")
  const messageFailure = req.flash("error")
  console.log(messageFailure);
  console.log(messageSuccess);
  const hasSuccess = messageSuccess.length > 0
  const hasError = messageFailure.length > 0
  res.render("private", {
    messageSuccess: messageSuccess,
    messageFailure: messageFailure,
    hasSuccess: hasSuccess,
    hasError: hasError
  })
})


module.exports = router;
