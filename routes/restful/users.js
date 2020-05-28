var express = require('express');
var router = express.Router();

let model = require('../../models/user');

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
router.put('', function(req, res, next) {
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

module.exports = router;