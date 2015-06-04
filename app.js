//var MongoClient = require('mongodb').MongoClient
//    , assert = require('assert');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var os = require( 'os' );

var networkInterfaces = os.networkInterfaces( );

var addr = networkInterfaces['eth1']['0']['address'];


//// Connection URL
//var url = 'mongodb://localhost:27017/imgproject';
//// Use connect method to connect to the Server
//MongoClient.connect(url, function(err, db) {
//    assert.equal(err, null);
//    console.log("DBserver connected");
//
//    findDocuments(db, function() {
//                    db.close();
//                })
//
//
////    insertDocuments(db, function() {
////        updateDocument(db, function() {
//////            removeDocument(db, function() {
////                findDocuments(db, function() {
////                    db.close();
////                })
//////            })
////        })
////    })
//
//});


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/imgproject');






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

// hook db to request
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/', routes);
app.use('/users', users);

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





var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insert([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}

var updateDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.update({ a : 2 }
        , { $set: { b : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
}

var removeDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.remove({ a : 3 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}


var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
//        assert.equal(2, docs.length);
        console.log("Found the following records");
        console.dir(docs)
        callback(docs);
    });
}