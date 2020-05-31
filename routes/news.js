var express = require('express');
var router = express.Router();

let model = require('../models/news');

/* GET news list page for all users. */
router.get('', function (req, res, next) {
    let mine = req.session.mine;
    let page = Number(req.query.page) || 1;
    if (page < 1) page = 1;
    let conditions = {
        page: {
            page: page * 1,
            size: 10,
        },
        orders: [],
    };
    model.select(conditions, (err, rows) => {
        res.render('news/index', {
            site: req._site,
            session: mine,
            news: rows,
        });
    });
});
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
    model.selectWithPage(conditions, (err, o) => {
        res.render('news/list', {
            site: req._site,
            session: mine,
            index: 0,
            news: o.rows,
            page: o.page,
            size: o.size,
            pageCount: o.pageCount,
        });
    });
});
/* GET new news page. */
router.get('/new', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    res.render('news/new', {
        site: req._site,
        session: mine,
        item: {},
    });
});
/* POST new news page. */
router.post('/new', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    let body = req.body;
    model.insertOne(body, (err) => {
      res.redirect('/news/list');
    });
});
/* POST new news page. */
router.post('/edit', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    let body = req.body;
    model.updateById(body, (err) => {
      res.redirect('/news/list');
    });
});
/* POST new news page. */
router.post('/:id/delete', function (req, res, next) {
    let mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    let params = req.params;
    model.deleteById(params.id, (err) => {
      res.redirect('/news/list');
    });
});
/* GET edit news page. */
router.get('/:id/edit', function (req, res, next) {
    let params = req.params, mine = req.session.mine;
    if (!mine) {    // not login
        res.redirect('/login');
        return;
    }
    model.selectById(params.id, (err, row) => {
        res.render('news/edit', {
            site: req._site,
            session: mine,
            item: row,
        });
    });
});
/* GET news detail page. */
router.get('/:id', function (req, res, next) {
    let mine = req.session.mine;
    let id = req.params.id;
    model.selectById(id, (err, row) => {
        if (row && row.content) {
            let html = '';
            let paras = row.content.split('\n');
            for (let i = 0; i < paras.length; i++) {    // realize multiple paragraphs
                const paragraph = paras[i];
                html += '<p>' + paragraph + '</p>';
            }
            row.content = html;
        }
        res.render('news/detail', {
            site: req._site,
            session: mine,
            item: row,
        });
    });
});

module.exports = router;