var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('fhirUtil', { user: req.user });
});

exports.router = router;
exports.setUser = function(){

    console.log("hellow testing!!!!!!");
}