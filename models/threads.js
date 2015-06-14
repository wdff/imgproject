var db = require('./db');
var uri = 'mongodb://localhost:27017/imgproject';
var coll = 'documents';
var Oid = require('mongodb').ObjectId;

module.exports.loadAll = function(cb) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            collection.find(
                {
                    $query: {},
                    $orderby: { "bumpedAt": -1 }
                }
            ).toArray(function(err, items) {
                console.log("Found items: " + items.length);
                cb(null, items);
            })
        });
    })
};

module.exports.loadOne = function(id, cb) {

    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            if (err) {
                console.log(err);
            } else {
                console.log("searching for id: " + id);
                console.log("converted to Oid: " + new Oid(id));
                collection.findOne( { _id: new Oid(id) }, {}, function(err, item) {
                    if (err) {
                        console.log("error " + err);
                    } else {
                        console.log("Found item!");
                        console.dir(item);
                        cb(null, item);
                    }
                })

            }

        })
    })
};

module.exports.save = function(req, res) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {

            var time = new Date();

            console.log("Saving...");
            collection.insert({
                "op"            : req.body.username ||"Anonymous",
                "postTitle"     : req.body.posttitle || "No Title",
                "postContent"   : req.body.postcontent,
                "createdAt"     : time,
                "bumpedAt"      : time,
                "comments"      : []
            }, function (err, doc) {
                if (err) {
                    res.send ("Error while saving your post.")
                } else {
                    console.log("Saved!");
                    console.dir(doc);
                    var threadId = new Oid(doc._id).toString();
                    res.location('/thread/' + threadId);
                    console.log("reloacting to " + threadId);
                    res.redirect('/thread/' + threadId);
                    console.log("redirecting to " + threadId);
                }
            })
        })
    })
};