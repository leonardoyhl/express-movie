var express = require('express');
var router = express.Router();

let movieModel = require('../models/movie');
let userModel = require('../models/user');

/* GET user center home page. */
router.get('', function (req, res, next) {
    let mine = req.session.mine;
    // console.log(req.session.mine);
    if (!mine) {    // not login
        res.redirect('/');
        return;
    }
    userModel.selectById(mine.id, (err, row) => {
        res.render('user/index', {
            site: req._site,
            session: req.session.mine,
            mine: row,
        });
    });
});
/* GET user center profile page. */
router.get('/profile', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/');
        return;
    }
    userModel.selectById(mine.id, (err, row) => {
        res.render('user/profile', {
            site: req._site,
            session: req.session.mine,
            mine: row,
        });
    });
});
/* POST update user profile. */
router.post('/profile', function (req, res, next) {
    let body = req.body, mine = req.session.mine;
    userModel.selectById(mine.id, (err, row) => {
        if (err) {
            res.json({
                code: 1,
                msg: err.message,
            });
            return;
        }
        for (const key in body) {
            row[key] = body[key];
        }
        userModel.updateById(row, (err) => {
            if (err) {
                res.json({
                    code: 1,
                    msg: err.message,
                });
                return;
            }
            res.json({
                code: 0,
                msg: 'ok',
            });
        });
    });
});

/* GET user settings page. */
router.get('/settings', function (req, res, next) {
    res.render('user/settings', {
        site: req._site,
        session: req.session.mime,
    });
});


module.exports = router;