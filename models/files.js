var db = require('./db');
var uri = 'mongodb://localhost:27017/imgproject';
var coll = 'files';
var Oid = require('mongodb').ObjectId;
var Grid = db.Grid;

var grid = new Grid(db, 'files');

var buffer = new Buffer("Hello world");
grid.put(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
    if(!err) {
        console.log("Finished writing file to Mongo");
    }
});

grid.get(fileInfo._id, function(err, data) {
    console.log("Retrieved data: " + data.toString());
    grid.delete(fileInfo._id, function(err, result) {
    });
});