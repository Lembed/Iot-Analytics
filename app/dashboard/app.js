/**
 * Module dependencies.
 */
var express = require('express');
var async = require('async');
var partials = require('express-partials');
var flash = require('connect-flash');
var moment = require('moment');

var moduleInfo = require('../../package.json');
var errorhandler = require('errorhandler');

var app = module.exports = express();

// middleware
app.use(partials());
app.use(flash());
app.use(function locals(req, res, next) {
  res.locals.addedCss = [];
  res.locals.moment = moment;
  next();
});
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
  }));
} else {
  app.use(errorhandler());
}

app.locals.version = moduleInfo.version;

// Routes
app.get('/login', function(req, res) {
  res.render('login');
});
app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/forgot', function(req, res) {
  res.render('forgot');
});
app.post('/forgot', function(req, res) {
  console.log(req);
});


app.get('/reset', function(req, res) {
  res.render('reset');
});

app.post('/reset', function(req, res) {
  console.log(req);
});


if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}