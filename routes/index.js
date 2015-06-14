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
    threads.save(req, res);
});


module.exports = router;
