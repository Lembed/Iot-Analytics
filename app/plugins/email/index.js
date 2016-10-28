var fs = require('fs');
var nodemailer = require('nodemailer');
var moment = require('moment');
var ejs = require('ejs');
var winston = require('winston');

var mailer, config, templateDir;


exports.register = function(options) {
  config = options.config.email;
  mailer = nodemailer.createTransport(config.method, config.transport);
  templateDir = __dirname + '/views/';
};


function send() {
  var filename = templateDir + checkEvent.message + '.ejs';
  var renderOptions = {
    url: options.config.url,
    moment: moment,
    filename: filename
  };
  var lines = ejs.render(fs.readFileSync(filename, 'utf8'), renderOptions).split('\n');
  var mailOptions = {
    from: config.message.from,
    to: config.message.to,
    subject: lines.shift(),
    text: lines.join('\n')
  };
  mailer.sendMail(mailOptions, function(err2, response) {
    if (err2) {
      return winston.error('Email plugin error: %s', err2);
    }

    winston.log('Notified event by email: Check ' + check.name + ' ' + checkEvent.message);
  });
}