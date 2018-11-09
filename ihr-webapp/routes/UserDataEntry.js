var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('UserDataEntry', {
        formAction: "UserDataEntry/submit" });
});

router.post('/submit', function (req, res) {
    console.log('UserDataEntry /submit');
});

exports.router = router;