"use strict";

var db = require('mongoose');
var config = require('config');
var semver = require('semver');
var winston = require('winston');

function connect() {
  db.connect(config.mongodb.connectionString || 'mongodb://' + config.mongodb.user + ':' + config.mongodb.password + '@' + config.mongodb.server + '/' + config.mongodb.database);
}

db.connection.on('error', function(err) {
  winston.error('MongoDB error: ' + err.message);
  winston.error('Make sure a mongoDB server is running and accessible by this application');
  process.exit(1);
});
db.connection.on('open', function(err) {
  db.connection.db.admin().serverStatus(function(err, data) {
    if (err) {
      if (err.name === "MongoError" && (err.errmsg === 'need to login' || err.errmsg === 'unauthorized') && !config.mongodb.connectionString) {
        winston.log('Forcing MongoDB authentication');
        db.connection.db.authenticate(config.mongodb.user, config.mongodb.password, function(err) {
          if (!err) return;
          winston.error(err);
          process.exit(1);
        });
        return;
      } else {
        winston.error(err);
        process.exit(1);
      }
    }
    if (!semver.satisfies(data.version, '>=2.1.0')) {
      winston.error('Error: requires MongoDB v2.1 minimum. The current MongoDB server uses only ' + data.version);
      process.exit(1);
    }
  });
});


module.exports = db;