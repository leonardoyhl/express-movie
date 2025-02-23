var express = require('express');
var router = express.Router();

let movieModel = require('../models/movie');
let userModel = require('../models/user');
let categories = require('../database/categories.json');

/* GET movie list page. */
router.get('/list', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    let page = Number(req.query.page) || 1;
    if (page < 1) page = 1;
    let conditions = {
        page: {
            page: page * 1,
            size: 10,
        },
        orders: [],
    };
    movieModel.selectWithPage(conditions, (err, o) => {
        res.render('movie/list', {
            site: req._site,
            session: mine,
            index: 0,
            movies: o.rows,
            page: o.page,
            size: o.size,
            pageCount: o.pageCount,
        });
    });
});
/* GET new movie page. */
router.get('/new', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    res.render('movie/new', {
        site: req._site,
        session: mine,
        movie: {},
        categories: categories,
    });
});
/* POST new movie page. */
router.post('/new', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    let body = req.body;
    movieModel.insertOne(body, (err) => {
      res.redirect('/movie/list');
    });
});
/* POST new movie page. */
router.post('/edit', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    let body = req.body;
    movieModel.updateById(body, (err) => {
      res.redirect('/movie/list');
    });
});
/* GET edit movie page. */
router.get('/:id/edit', function (req, res, next) {
    let params = req.params, mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    movieModel.selectById(params.id, (err, row) => {
        res.render('movie/edit', {
            site: req._site,
            session: mine,
            movie: row,
            categories: categories,
        });
    });
});
/* GET movie detail page. */
router.get('/:id', function (req, res, next) {
    let mine = req.session.mine;
    let id = req.params.id;
    movieModel.selectById(id, (err, row) => {
        if (row && row.introduction) {
            let html = '';
            let paras = row.introduction.split('\n');
            for (let i = 0; i < paras.length; i++) {    // realize multiple paragraphs
                const paragraph = paras[i];
                html += '<p>' + paragraph + '</p>';
            }
            row.introduction = html;
        }
        res.render('movie/detail', {
            site: req._site,
            session: mine,
            movie: row,
        });
    });
});

module.exports = router;