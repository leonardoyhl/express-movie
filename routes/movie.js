var express = require('express');
var router = express.Router();

let movieModel = require('../models/movie');
let userModel = require('../models/user');

/* GET movie list page. */
router.get('/list', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/');
        return;
    }
    let page = Number(req.query.page) || 1;
    if (page < 1) page = 1;
    let conditions = {
        page: {
            page: page,
            size: 10,
        },
        orders: [],
    };
    movieModel.select(conditions, (err, rows) => {
        res.render('movie/list', {
            site: req._site,
            session: mine,
            movies: rows,
            index: 0,
            page: page,
        });
    });
});
/* GET new movie page. */
router.get('/new', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/');
        return;
    }
    let categories = require('../database/categories.json');
    res.render('movie/new', {
        site: req._site,
        session: mine,
        movie: {},
        categories: categories,
    });
});
/* GET edit movie page. */
router.get('/edit/:id', function (req, res, next) {
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
/* GET movie detail page. */
router.get('/:id', function (req, res, next) {
    let mine = req.session.mine;
    let id = req.params.id;
    movieModel.selectById(id, (err, row) => {
        res.render('movie/detail', {
            site: req._site,
            session: mine,
            movie: row,
        });
    });
});

module.exports = router;