var express = require('express');
var router = express.Router();


/**
 * Parses uploaded files (passed through multer).
 * Attaches filetype and file link to the request to insert into the DB
 * @param req request
 * @param res response
 * @param cb callback
 */
module.exports.upload = function(req, res, cb) {
    if (req.files.fileUpload.mimetype == "image/png" || "image/gif" || "image/jpeg" || "video/mp4" || "video/webm") {
    req.fileType = req.files.fileUpload.mimetype;
    req.fileLink = req.files.fileUpload.name;
    //console.log("file link: " + req.fileLink);
    cb(req, res);
    } else {
        res.send("Wrong filetype! You can only upload .png, .gif, .jpeg, .mp4 and .webm files.");
    }
};
