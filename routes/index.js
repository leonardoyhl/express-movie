var express = require('express');
var router = express.Router();

let movieModel = require('../models/movie');
let userModel = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    let page = {
        page: 1,
        size: 10,
    };
    let conditions = {
        page: page,
    };
    movieModel.select(conditions, (err, rows) => {
        // console.log(err, rows);
        res.render('index', {
            site: req._site,
            session: req.session.mine,
            movies: rows,
        });
    });
});

/* GET register page. */
router.get('/register', function (req, res, next) {
    res.render('register', {
        site: req._site,
        session: req.session.mine,
    });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('login', {
        site: req._site,
        session: req.session.mine,
    });
});

/* POST user info for login. */
router.post('/login', function (req, res, next) {
    let body = req.body;
    userModel.selectByUsername(body.username, (err, row) => {
        if (err) {
            res.json({
                code: 1,
                msg: err.message,
            });
        } else if (!row) {
            res.json({
                code: 2,
                msg: "User not found",
            });
        } else if (row.password != body.password) {
            res.json({
                code: 3,
                msg: 'Username or password wrong',
            });
        } else {
            // login successfully
            req.session.mine = row;
            res.redirect('/');
        }
    });
});
/* logout. */
router.post('/logout', function (req, res, next) {
    req.session.mine = null;
    // res.redirect('/');
    res.json({
        code: 0,
        msg: 'ok',
    });
});

module.exports = router;
