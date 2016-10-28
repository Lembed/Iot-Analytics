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
var winton = require('winston');

var db = require('../utils/db')

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

require('./routes/rest')(app);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router(); 
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our api!' });   
});

// https://www.npmjs.com/package/express-fileupload
router.route('/upload')
  .post(function(req,res){
     if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }else{
      res.send('File uploaded!');
    }
  })
  .get(function(req,res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
      );
 });


router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
    })
    .get(function(req,res){
      res.json({ message: 'welcome to our bears!' });  
    });

// all of our routes will be prefixed with /api
app.use('/', router);



if (!module.parent) {
  app.listen(3000);
  winton.log('Express started on port 3000');
}