//var MongoClient = require('mongodb').MongoClient
//    , assert = require('assert');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var os = require('os');
var networkInterfaces = os.networkInterfaces( );
var addr = networkInterfaces['eth0']['0']['address'];

var index = require('./routes/index');
var threadview = require('./routes/thread');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8000);
app.use(express.static(__dirname + '/app'));

var server = http.createServer(app);

server.listen(app.get('port'), function() {
    console.log('Express HTTP server listening at ' + addr + ":" + app.get('port')  ) ;
});


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
app.use('/thread', threadview);





/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;



