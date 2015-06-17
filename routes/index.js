var express = require('express');
var router = express.Router();

var threads = require('../models/threads');

router.get('/', function(req, res) {
    threads.loadAll(function(err, items) {
        res.render('index', {
            posts: items
        });
    })
});

router.get('/newthread', function(req, res) {
    res.render('newthread', {title: 'Create a new Thread'});
});

router.post('/newthread', function(req, res) {
    var time = new Date();
    var toInsert = {
        "op"            : req.body.username ||"Anonymous",
        "postTitle"     : req.body.posttitle || "No Title",
        "postContent"   : req.body.postcontent,
        "createdAt"     : time,
        "bumpedAt"      : time,
        "comments"      : []
    };
    threads.save(req, res, toInsert);
});




module.exports = router;
