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
        console.log(req.session.mime);
        res.render('index', {
            site: req._site,
            session: req.session.mime,
            movies: rows,
        });
    });
});

/* GET register page. */
router.get('/register', function (req, res, next) {
    res.render('register', {
        site: req._site,
        session: req.session.mime,
    });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('login', {
        site: req._site,
        session: req.session.mime,
    });
});

module.exports = router;
