var express = require('express');
var router = express.Router();


var threads = require('../models/threads');



router.get('/:id', function(req, res) {
    console.log("loading " + req.params.id);
    threads.loadOne(req.params.id, function(err, item) {
        if (err) {
            console.log(err);
        } else {
            res.render('showthread', {
                title: item.postTitle,
                posts: item
            })
        }
    })
});


router.delete('/:id/delete', function(req, res) {
    threads.deleteThread(req, res, req.params.id);
});

router.post('/:id/addcomment', function(req, res) {
    var threadId = req.params.id;
    var userName = req.body.username || "Anonymous";
    var comment = req.body.commentContent;
    var date = new Date();

    var toUpdate = {
        "$currentDate": { "bumpedAt": true },
        "$push": {
            "comments": {
                "posted": date,
                "author": userName,
                "comment": comment
            }
        }
    };

    threads.updateThread(threadId, toUpdate, function(err, doc) {
        if (err) {
            console.log("error while updating: " + err);
        } else {
            console.log("updated!");
            //console.dir(doc);
            res.location('/thread/' + threadId);
            res.redirect('/thread/' + threadId);
            //res.json({"updated":"yes", "doc": doc});

        }
    })

});


module.exports = router;