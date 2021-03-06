"use strict";

var http = require('http');
var url = require('url');
var express = require('express');
var config = require('config');
var socketIo = require('socket.io');
var fs = require('fs');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var errorhandler = require('errorhandler');
var fileUpload = require('express-fileupload');

var app = module.exports = express();
var server = http.createServer(app);

var apiApp = require('./app/api/app');
var dashboardApp = require('./app/dashboard/app');
var db = require('./app/utils/db');
var winston =  require('./app/utils/log');

// middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());
app.use(cookieSession({
    name: 'iot-analyzer',
    keys: ['FZ5HEE5YHD3E566756234C45BY4DSFZ4', 'FZ5HEE5YHD3E564756234C45BY4DSFZ4']
}));
app.use(fileUpload());

// load plugins
config.plugins.forEach(function(pluginName) {
    var plugin = require(pluginName);
    if (typeof plugin.register !== 'function') return;
    winston.info('loading plugin %s on app', {anything : pluginName});
    plugin.register({
        app: app,
        api: apiApp, 
        dashboard: dashboardApp,
        io: io,
        config: config,
        db: db
    });
});

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    if (config.verbose) db.set('debug', true);
    app.use(express.static(__dirname + '/public'));
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}

if ('production' == env) {
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', {
        maxAge: oneYear
    }));
    app.use(errorhandler());
}
// Routes
app.emit('beforeApiRoutes', app, apiApp);
app.use('/api', apiApp);

app.emit('beforeDashboardRoutes', app, dashboardApp);
app.use('/dashboard', dashboardApp);
app.get('/', function(req, res) {
    res.send("app server listening !");
});

app.get('/favicon.ico', function(req, res) {
    res.redirect(301, '/dashboard/favicon.ico');
});


app.emit('afterLastRoute', app);



// Sockets
var io = socketIo.listen(server);
if ('development' == env) {
    if (!config.verbose) io.set('log level', 1);
} else {
    io.enable('browser client etag');
    io.set('log level', 1);
}

io.sockets.on('connection', function(socket) {
    socket.on('set check', function(check) {
        socket.set('check', check);
    });
});

if (!module.parent) {
    var serverUrl = url.parse(config.url);
    var port;
    if (config.server && config.server.port) {
        winston.error('Warning: The server port setting is deprecated, please use the url setting instead');
        port = config.server.port;
    } else {
        port = serverUrl.port;
        if (port === null) {
            port = 80;
        }
    }
    var port = process.env.PORT || port;
    var host = process.env.HOST || serverUrl.hostname;
    server.listen(port, function() {
        // db.connect();
        winston.info("Express server listening on host %s, port %d in %s mode", host, port, app.settings.env);
    });
    server.on('error', function(e) {});
}