var express = require('express');
var router = express.Router();
var passport = require('passport');

var threads = require('../models/threads');
var file = require('../models/files');
var users = require('../models/users');

/**
 * Max. Length of a post to show on the index page.
 * @type {number}
 */
var indexPostLength = 400;

/**
 * Default route. Loads all threads
 */
router.get('/', function(req, res) {
    //console.log(req.session);
    threads.loadAll(function(err, items) {
        for (var i=0; i<items.length; i++) {
            if (items[i].postContent != null && items[i].postContent.length > indexPostLength) {
                items[i].postContent = items[i].postContent.substring(0, indexPostLength) + " [...]";
            }
        }
        res.render('index', {
            posts: items,
            user: req.user
        })
    })
});

/**
 * Route for new threads.
 */
router.get('/newthread', function(req, res) {
    res.render('newthread', {title: 'Create a new Thread'});
});


/**
 * Validates new threads, then creates them (or shows error page).
 * If files are uploaded, attach them to the request,
 * if not, just create a thread.
 */
router.post('/newthread', function(req, res) {

    if (req.body.username && req.body.username.length > 20) {
        res.send("Your name can not be longer than 20 characters.");
    } else if (req.body.posttitle && req.body.posttitle.length > 30) {
        res.send("The title can not be longer than 30 characters.");
    } else if (!req.body.postcontent) {
        res.send("You have to enter a post! Stop hacking!");
    } else if (req.body.postcontent.length > 10000) {
        res.send("Your post can not be longer than 10.000 characters.");
    } else if (req.files.fileUpload) {
        file.upload(req, res, createThread);
    } else {
        createThread(req, res);
    }
});

/**
 * Login page.
 */
router.get('/login', function(req, res) {
    res.render('login', {title: "Log In",message: req.message});
});

/**
 * Login POST. checks if user exists.
 */
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

/**
 * Register page.
 */
router.get('/register', function(req, res) {
    res.render('register', {title: "Register your Account"});
});

/**
 * Register POST. Validates and saves.
 * TODO check first if user already exists
 */
router.post('/register', function(req, res) {

    if (!req.body.username) {
        res.send("Please enter a username!");
    } else if (req.body.username.length > 20) {
        res.send("Your username can not be longer than 20 characters.");
    } else if (!req.body.password) {
        res.send("Please enter a Password!");
    } else {
        var username = req.body.username;
        var password = req.body.password;

        var account = new users({
            username: username,
            password: password
        });

        account.save(function(err) {
            if (err) {
                console.dir(err);
                res.send("There was an Error!");
                return;
            }
            console.log("User saved!");

        });
        res.redirect('/');
    }


});

/**
 * Log out. Destroys the session
 */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * Creates a thread after validation.
 * @param req request
 * @param res response
 */
function createThread(req, res) {

    var time = new Date();
    var toInsert = {
        "op"            : req.body.username ||"Anonymous",
        "postTitle"     : req.body.posttitle || "No Title",
        "postContent"   : req.body.postcontent,
        "postFileLink"  : req.fileLink || "",
        "postFileType"  : req.fileType || "",
        "createdAt"     : time,
        "bumpedAt"      : time,
        "comments"      : []
    };
    threads.save(req, res, toInsert);
}

module.exports = router;
