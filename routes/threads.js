var express = require('express');
var router = express.Router();

var database = require('../models/db');
var thread = require('../models/thread');



router.get('/:id', function(req, res) {
    thread.loadOne({ "_id.id" : req.params.id }, "documents", function(err, docs){
        if (err) {
            console.log("error in loadone callback");
            console.log(err);
        } else {
            console.dir(docs);
            res.render('showthread', { title: 'Thread ' + req.params.id, posts: docs });
        }
    })
});

module.exports = router;