var express = require('express');
var router = express.Router();

var thread = require('../models/thread');


router.get('/:id', function(req, res) {
    thread.loadOne(req.params.id, function(err, item) {
        res.render('showthread', {title: 'Thread ' + req.params.id, posts: item})
    })
});



module.exports = router;