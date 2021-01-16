const passport = require("passport")
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session")
const User = require("../models/userSchema")


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//this breaks open the cookie and reveals any info stored on it
//whenever a request is made while the current session is still active
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//oauth signin
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://desolate-bastion-84839.herokuapp.com/auth/google/imager",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    let googleID = profile.id
    let name = profile.name.familyName
    let imageURL = profile._json.picture

    //check to create a user(if none) or find an existing user
    User.findOne({googleID: googleID}, (err, user) => {
      if (user == null || undefined) {
        User.create({name: name, googleID: googleID, profilePic: imageURL}, (err, user) => {
          if (err) {
            console.log(err);
          }
          return cb(err, user);
        })
      } else {
        return cb(err, user);
      }
    });
  }
));
