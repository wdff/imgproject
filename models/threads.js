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
                        cb(err);
                    } else if (item) {
                        console.log("Found item!");
                        console.dir(item);
                        cb(null, item);
                    } else {
                        console.log("Found NO items");
                        cb(err);
                    }
                })
            }
        })
    })
};

module.exports.save = function(req, res, toInsert) {
    db(uri, {}, function(err, db) {
        db.collection(coll, function(err, collection) {

            console.log("Saving...");
            collection.insertOne(toInsert, {}, function (err, doc) {
                if (err) {
                    res.send ("Error while saving your post.")
                } else {
                    console.log("Saved!");
                    console.dir(doc);
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

module.exports.updateThread = function(id, toUpdate, cb) {
    db(uri, {}, function(err, db) {
      db.collection(coll, function(err, collection) {
          console.log("Updating thread " + id);
          console.dir(toUpdate);
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