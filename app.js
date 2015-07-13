//var MongoClient = require('mongodb').MongoClient
//    , assert = require('assert');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var multer = require('multer');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

var uploadDone = false;

var app = express();
var os = require('os');

var index = require('./routes/index');
var threadview = require('./routes/thread');
var file = require('./models/files');
var users = require('./models/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8000);
app.use(express.static(__dirname + '/app'));

var server = http.createServer(app);

server.listen(app.get('port'), function() {
    console.log('Express HTTP server listening at ' + app.get('port')  ) ;
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


/* configure multer */
app.use(multer({
    dest: './public/files/',
    /*rename: function (fieldname, filename) {
        return filename+Date.now();
     },*/
    onFileUploadStart: function(file) {
        console.log("uploading " + file.originalname);
    },
    onFileUploadComplete: function(file) {
        console.log(file.fieldname + " uploaded to " + file.path);
        uploadDone=true;
    },
    onFileSizeLimit: function (file) {
        console.log('Failed: ', file.originalname);
        fs.unlink('./' + file.path); // delete the partially written file
    },
    limits: {
        fileSize: 10 * 1024 * 1024 //MB
     }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'what did you just say about me?',
    saveUninitialized: true,
    resave: false })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    passReqToCallback: false
},
function(username, password, done) {
    process.nextTick(function() {
        users.findOne({
            'username': username
        }, function(err, user) {
            if(err) {
                console.dir(err);
                return done(err);
            }

            if (!user) {
                return done(null, false, {message: 'Incorrect Username'});
            }

            if (user.password != password) {
                return done(null, false, {message: 'Incorrect Password'});
            }
            return done(null, user);
        });
    });
}));

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