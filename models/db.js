var MongoClient = require('mongodb').MongoClient;
var db_singleton = null;

module.exports.getConnection = function(uri, options, callback) {
    if (db_singleton) {
        return callback(null, db_singleton);
    }
    uri = 'mongodb://localhost:27017/imgproject';
    MongoClient.connect(uri, options, function(err, db) {
        if (err) {
            console.log('Error creating database connection: ' + err);
        } else {
            console.log('Connected to database');
        }
        db_singleton = db;
        return callback(err, db_singleton);
    });
};






/*


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/imgproject');





module.exports.loadAll = function(res, req) {
var db = req.db;
var collection = db.get('documents');
collection.find( { $query: {}, $orderby: { "bumpedAt": -1 } },{}, function(e,docs) {
    res.render('index', { title: 'Index', posts: docs });
})};



module.exports.db = db;

    */