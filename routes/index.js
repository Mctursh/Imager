var express = require('express');
var router = express.Router();
const passport = require("passport")
const flash = require("connect-flash")
const multer = require("../multer")
const auth = require("../helper/is-logged-in")


/* GET home page. */
router.get('/', function(req, res, next) {
  const messageSuccess = req.flash("success")
  const messageFailure = req.flash("error")
  console.log(messageFailure);
  console.log(messageSuccess);
  const hasSuccess = messageSuccess.length > 0
  const hasError = messageFailure.length > 0
  res.render("index", {messageSuccess: messageSuccess, messageFailure: messageFailure, hasSuccess: hasSuccess, hasError: hasError});
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
  res.render("gallery")
})

router.get("/private", auth, (req, res) => {
  const messageSuccess = req.flash("success")
  const messageFailure = req.flash("error")
  console.log(messageFailure);
  console.log(messageSuccess);
  const hasSuccess = messageSuccess.length > 0
  const hasError = messageFailure.length > 0
  res.render("private", {messageSuccess: messageSuccess, messageFailure: messageFailure, hasSuccess: hasSuccess, hasError: hasError})
})



module.exports = router;
