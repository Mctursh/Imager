var express = require('express');
var router = express.Router();
const passport = require("passport")
const flash = require("connect-flash")


/* GET home page. */
router.get('/', function(req, res, next) {
  const message = req.flash("error")
  res.render('index', {message: message, hasError: message.length > 0});
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

router.get("/gallery", (req, res) => {
  res.render("gallery")
})

router.get("/private", (req, res) => {
  res.render("private")
})
module.exports = router;
