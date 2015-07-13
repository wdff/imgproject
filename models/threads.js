var db = require('./db');
var uri = 'mongodb://localhost:27017/imgproject';
var coll = 'documents';
var Oid = require('mongodb').ObjectId;


/**
 * Loads all threads from the DB.
 * @param cb callback
 */
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

/**
 * Loads one thread from the DB.
 * @param id the ID of the thread to load
 * @param cb callback
 */
module.exports.loadOne = function(id, cb) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            if (err) {
                console.log(err);
            } else {
                collection.findOne( { _id: new Oid(id) }, {}, function(err, item) {
                    if (err) {
                        console.log("error " + err);
                        cb(err);
                    } else if (item) {
                        console.log("Found thread!");
                        //console.dir(item);
                        cb(null, item);
                    } else {
                        console.log("Found NO threads");
                        cb(err);
                    }
                })
            }
        })
    })
};

/**
 * Saves a thread to the DB.
 * @param req request
 * @param res response
 * @param toInsert the thread to insert
 */
module.exports.save = function(req, res, toInsert) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {

            console.log("Saving...");
            collection.insertOne(toInsert, {}, function (err, doc) {
                if (err) {
                    res.send ("Error while saving your Thread.")
                } else {
                    console.log("Saved!");
                    //console.dir(doc);
                    var threadId = doc.ops[0]._id;
                    //res.location('/thread/' + threadId);
                    //console.log("reloacting to " + threadId);
                    res.redirect('/thread/' + threadId);
                    console.log("redirecting to " + threadId);

                }
            })
        })
    })
};

/**
 * Deletes a thread from the DB
 * @param req request
 * @param res response
 * @param toDelete the ID of the thread to delete
 */
module.exports.deleteThread = function(req, res, toDelete) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            console.log("Deleting " + toDelete);
            collection.findOneAndDelete({ _id : new Oid(toDelete)}, function(err, doc) {
                if (err) {
                    console.log("error while deleting! " + err);
                } else {
                    if (doc) {
                        var deletedId = doc.value._id.toString();
                        res.json({ deleted: "yes", "id": deletedId});
                        console.log("successfully deleted! " + deletedId);
                    }
                }
            })
        })
    })
};

/**TODO
 * Deletes a comment from a thread
 * @param req request
 * @param res response
 * @param threadId ID of the thread
 * @param toDelete ID of the comment
 */       /*
 module.exports.deleteComment = function(req, res, threadId, toDelete) {
 }
 */

/**
 * Updates a thread (Insert a comment)
 * @param id the Thread's ID
 * @param toUpdate the comment to insert
 * @param cb callback
 */
module.exports.updateThread = function(id, toUpdate, cb) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {
            console.log("Updating thread " + id);
            collection.findOneAndUpdate(
                { _id: new Oid(id)},
                toUpdate,
                { returnOriginal: false }
                , function(err, doc) {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, doc);
                    }
                });
        });
    });
};