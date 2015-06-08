var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/imgproject');





module.exports.loadAll = function(res, req) {
var db = req.db;
var collection = db.get('documents');
collection.find( { $query: {}, $orderby: { "bumpedAt": -1 } },{}, function(e,docs) {
    res.render('index', { title: 'Index', posts: docs });
})};



module.exports.db = db;