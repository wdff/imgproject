var express = require('express');
var router = express.Router();

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

module.exports = router;
