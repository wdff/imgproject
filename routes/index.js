var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('documents');
    collection.find({},{}, function(e,docs) {
        res.render('index', { title: 'Index', posts: docs });
    })

});

/* GET new thread page */
router.get('/newthread', function(req, res) {
    res.render('newthread', {title: 'New Thread'});
})

router.get('/thread/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('documents');
    collection.find({_id: req.params.id },function (e,docs) {
        res.render('showthread', {title: 'Thread ' + req.params.id, posts: docs});
    })
})

router.get('/delete', function(req, res) {
    res.render('deletethread', {title: 'Delete a Thread'});
})

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

    var collection = db.get('documents');

    // insert
    collection.insert({
        "op": userName,
        "postTitle": postTitle,
        "postContent": postContent
    }, function (err, doc) {
        if (err) {
            res.send("Error while saving your post.");
        } else {
            res.location('/');
            res.redirect('/');
        }

    })


})




module.exports = router;
