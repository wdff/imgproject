var db = require('./db');
var connection = db.getConnection('mongodb://localhost:27017/imgproject',{},function(err, conn) {
    if (err) {
    console.log(err);
    } else {
        connection = conn.collection('documents');
    }
});



module.exports.loadOne = function(what, where, callback) {
    console.log(what);
    connection.find(what, {}).toArray(function(err, docs) {
        if (err) {
            console.log("error in loadone");
            console.log(err);
            return callback(err);
        }
        console.log("got docs: " + docs.length);
        return callback(null, docs);
    });
};

module.exports.loadAll = function(where, callback) {
    connection.find({ $query: {}, $orderby: { "bumpedAt": -1 } }, {}).toArray(function(err, docs) {
        if (err) {
            console.log("error in loadall");
            console.log(err);
            return callback(err);
        }
        return callback(null, docs);
    });
};

module.exports.saveThread = function() {
    //

};