var express = require('express');

var router = express.Router();

router.post('/', function (req, res) {
    req.session.destroy(function (err) {
        req.logOut();
        res.redirect('/');
    });
});

exports.router = router;