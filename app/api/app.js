/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var errorhandler = require('errorhandler')

// middleware
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
  }));
} else {
  app.use(errorhandler());
}

require('./routes/skeleton')(app);

// route list
app.get('/', function(req, res) {
  var routes = [];
  for (var verb in app.routes) {
    app.routes[verb].forEach(function(route) {
      routes.push({
        method: verb.toUpperCase(),
        path: app.route + route.path
      });
    });
  }
  res.json(routes);
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}