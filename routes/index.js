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

  //rendering the index view page along with possible flash message if they exist
  res.render("index", {
    messageSuccess: messageSuccess,
    messageFailure: messageFailure,
    hasSuccess: hasSuccess,
    hasError: hasError
  });
});

//route for authentication through google
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);


//callback that triggers that receives the client from google servers
router.get('/auth/google/imager',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

//route that handles logout requests
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

//route that handles get request to then gallery route of a user
router.get("/gallery", auth, (req, res) => {
  const messageSuccess = req.flash("success")
  const messageFailure = req.flash("error")
  console.log(messageFailure);
  console.log(messageSuccess);
  const hasSuccess = messageSuccess.length > 0
  const hasError = messageFailure.length > 0
  const userID = req.user.googleID

  //searching DB to locate all pictures of the requested user
  Private.find({
      userGoogleID: userID
    }).lean()
    .exec((error, docs) => {
      if (error) {
        res.render("gallery", {
          error: error
        })
      } else {
        //chopping our recieved data to match the FE UI needs
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

//handles all delete request to this route
router.post("/delete", auth, async (req, res) => {
  const userID = req.user.googleID
  const assetID = req.body.asset

  //checks and runs  if no item was sent in the post request
  if (assetID == undefined) {
    req.flash("error", "No picture selected, please select and try again")
    res.redirect("/gallery")
  }

  //checks and runs if only one item was sent in the post request
  if (typeof(assetID) == "string") {
    await Private.findByIdAndDelete(assetID).then((resolve) => {
      req.flash("success", "succefully deleted picture")
      res.redirect("/gallery")
    }).catch((error) => {
      req.flash("error", "failed to delete picture")
      res.redirect("/gallery")
    })

    //checks and runs if more than one item was sent in the post request
  } else if (typeof(assetID) == "object") {
    //declaring a binding that help determine if the operation failed or not
    let amount = 0

    //instatiating an asynchronous funciton to delete items from the DB
    const deleter = async (each) => await Private.findByIdAndDelete(each)

    //looping through all the data sent for deleting
    for(each of assetID) {
      const del = await deleter(each)
      amount++
    }

    //validating if operation was succeful
    if (amount == assetID.length) {
      req.flash("success", "Succefully deleted pictures")
    } else {
      req.flash("error", "Failed to delete pictures")
    }
    res.redirect("/gallery")
  }
})

//handles all request to get the private view
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
