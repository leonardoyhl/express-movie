var express = require('express');
var router = express.Router();

let model = require('../models/user');

/** RESTful API */
/* GET users listing. */
router.get('', function(req, res, next) {
  model.selectAll((err, rows) => {
    if (err) {
      res.json({
        code: 1,
        msg: err.message,
      });
    } else {
      res.json({
        code: 0,
        msg: 'ok',
        data: rows,
      });
    }
  });
});

/* POST user info. */
router.post('', function(req, res, next) {
  let body = req.body;
  model.insertOne(body, (err) => {
    if (err) {
      res.json({
        code: 1,
        msg: err.message,
      });
    } else {
      res.json({
        code: 0,
        msg: 'ok',
      });
    }
  });
});

/* POST user info. */
router.post('/login', function(req, res, next) {
  let body = req.body;
  model.selectByUsername(body.username, (err, row) => {
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
      req.session.mime = {
        username: row.username,
        role: row.role,
      };
      res.json({
        code: 0,
        msg: 'ok',
      });
    }
  });
});

module.exports = router;