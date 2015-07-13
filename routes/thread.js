var express = require('express');
var router = express.Router();


var threads = require('../models/threads');
var file = require('../models/files');


/**
 * Shows a single thread with url "/thread/xxxxxx".
 */
router.get('/:id', function(req, res) {
    console.log("loading " + req.params.id);
    threads.loadOne(req.params.id, function(err, item) {
        if (err) {
            console.log(err);
        } else {

            res.render('showthread', {
                title: item.postTitle,
                posts: item,
                user: req.user
            })
        }
    })
});


//TODO delete files as well
/**
 * POST route for deleting threads.
 */
router.post('/:id/delete', function(req, res) {
    threads.deleteThread(req, res, req.params.id);
});

/**
 * POST route for adding a comment.
 */
router.post('/:id/addcomment', function(req, res) {

    if (req.files.fileUpload || req.body.commentContent) {
        if (req.files.fileUpload) {
            //console.log("kommentar mit file");
            file.upload(req, res, addComment);
        } else {
            //console.log("kommentar ohne file");
            addComment(req, res);
        }
    } else {
        res.send("Please enter a comment or a file (or both)");
    }
});

/**TODO
 * POST Route for deleting comments.
 */
router.post('/:id/deletecomment', function(req, res) {
    //
});

/**
 * Function to parse the "add comment" request.
 * @param req request containing comment info
 * @param res response
 */
function addComment(req, res) {

    var threadId = req.params.id;
    var userName = req.body.username || "Anonymous";
    var comment = req.body.commentContent;
    var date = new Date();
    var fileLink = req.fileLink || "";
    var fileType = req.fileType || "";

    var toUpdate = {
        "$currentDate": { "bumpedAt": true },
        "$push": {
            "comments": {
                "posted"    : date,
                "author"    : userName,
                "comment"   : comment,
                "fileLink"  : fileLink,
                "fileType"  : fileType
            }
        }
    };

    threads.updateThread(threadId, toUpdate, function(err, doc) {
        if (err) {
            console.log("error while updating: " + err);
        } else {
            console.log("updated!");
            res.redirect('/thread/' + threadId);
        }
    })
}

module.exports = router;