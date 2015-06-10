var express = require('express');
var router = express.Router();

var database = require('../models/db');
var thread = require('../models/thread');

/* GET home page. */
router.get('/', function(req, res, next) {
    thread.loadAll('documents', function(err, docs){
        if (err) {
            console.log("error in loadAll callback");
            console.log(err);
        } else {
            console.dir(docs);
        res.render('index', { title: 'Index', posts: docs });
        }
    });
});

/* GET new thread page */
router.get('/newthread', function(req, res) {
    res.render('newthread', {title: 'New Thread'});
});



router.get('/delete', function(req, res) {
    res.render('deletethread', {title: 'Delete a Thread'});
});

router.post('/deletethread', function(req, res) {
    var db = req.db;
    var threadId = req.body.threadId;
    var collection = db.get('documents');

    //delete
    collection.remove({
        "_id" : threadId
    }, function (err, doc) {
        if (err) {
            res.send("Error while deleting")
        } else {
            res.location('/');
            res.redirect('/');
        }

    })
})

/* POST a new thread */
router.post('/postthread', function(req, res) {
    // get the db from the request
    var db = req.db;

    // get the values
    var userName = req.body.username || "Anonymous";
    var postTitle = req.body.posttitle || 'No Title';
    var postContent = req.body.postcontent;
    var createdAt = new Date();

    var collection = db.get('documents');

    // insert
    collection.insert({
        "op": userName,
        "postTitle": postTitle,
        "postContent": postContent,
        "createdAt": createdAt,
        "bumpedAt": createdAt,
        "comments": []
    }, function (err, doc) {
        if (err) {
            res.send("Error while saving your post.");
        } else {
            res.location('/thread/' + doc._id);
            res.redirect('/thread/' + doc._id);
        }
    })
})

router.post('/newcomment', function(req, res) {
    var db = req.db;

    var threadId = req.body.threadid;
    var userName = req.body.username || "Anonymous";
    var comment = req.body.commentContent;

    var collection = db.get('documents');

    var date = new Date();

    collection.update(
        { "_id": threadId },
        {
            "$currentDate": { "bumpedAt": true },
            "$push": {
                "comments": {
                    "posted": date,
                    "author": userName,
                    "comment": comment
                }
            }
        }
    , function(err, doc) {
            if (err) {
                res.send("Error saving your comment!");
            } else {
                res.location('/thread/' + threadId);
                res.redirect('/thread/' + threadId);
            }
        })
})


module.exports = router;
