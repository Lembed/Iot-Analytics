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
  res.locals.route = app.route;
  res.locals.addedCss = [];
  res.locals.renderCssTags = function(all) {
    if (all != undefined) {
      return all.map(function(css) {
        return '<link rel="stylesheet" href="' + app.route + '/stylesheets/' + css + '">';
      }).join('\n ');
    } else {
      return '';
    }
  };
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


if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}