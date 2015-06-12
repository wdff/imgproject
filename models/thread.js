var db = require('./db');
var uri = 'mongodb://localhost:27017/imgproject';
var coll = 'documents';

module.exports.loadAll = function(cb) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            collection.find().toArray(function(err, items) {
                console.log("Found items: " + items.length);
                cb(null, items);
            })
        });
    })
};

module.exports.loadOne = function(id, cb) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            console.log("searching for id: " + id);
            console.log(typeof id);
            collection.findOne( { _id: id }, {}, function(err, item) {
                if (err) {
                    console.log("error " + err);
                } else {
                    console.log("Found items: " + item);
                    cb(null, item);
                }
            })
        })
    })
};

