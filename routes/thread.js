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




module.exports = router;