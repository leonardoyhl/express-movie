var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        site: {
            name: 'MRS',
            desc: 'Movie Recommendation System'
        },
    }); // Express
});

module.exports = router;
