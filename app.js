require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs  = require('express-handlebars')
const passport = require("passport")
const session = require("express-session");
const bodyParser = require("body-parser")
const flash = require("connect-flash")


const app = express();

const indexRouter = require('./routes/index');
const uploader = require("./routes/upload")
const usersRouter = require('./routes/users');

const User = require("./models/userschema")

//configuring our app to use session module
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))


//configuring our app to use passport to inialize and set up a session for users
app.use(passport.initialize());
app.use(passport.session());

require("./auth/google-auth")


// view engine setup
app.engine('.hbs', exphbs({defaultLayout: "layout", extname: ".hbs"}));
app.set('view engine', '.hbs');

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated()
  res.locals.session = req.session;
  next()
})

app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/upload', uploader);
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, (req, res) => {
  console.log("server running on port 3000");
})

module.exports = app;
