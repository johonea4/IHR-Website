var express = require('express');
var FHIR = require('./testFHIR.js');
var router = express.Router();

var fhir= new FHIR();
router.get('/', function (req, res) {
    fhir.getUser();
    res.render('fhirUtil', { user: req.user });
});

router.get('/getUser', function (req, res) {
     fhir.getUser();
});

router.get('/setUser', function (req, res) {
    fhir.setUser();
});

exports.router = router;