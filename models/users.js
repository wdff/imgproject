var db = require('./db');
var uri = 'mongodb://localhost:27017/imgproject';
var coll = 'users';
var Oid = require('mongodb').ObjectId;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/imgproject');

/**TODO hash passwords
 * Schema of the users DB
 * @type {*}
 */
var Schema = mongoose.Schema;
var UserDetail = new Schema({
    username: String,
    password: String
}, {
    collection: 'users'
});


module.exports = mongoose.model('users', UserDetail);