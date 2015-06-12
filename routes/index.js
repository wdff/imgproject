var express = require('express');
var router = express.Router();

var thread = require('../models/thread');

router.get('/', function(req, res) {
    thread.loadAll(function(err, items) {
        res.render('index', { posts: items });
    })
});




module.exports = router;
