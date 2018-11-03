var express = require('express');
var FHIR = new require('./testFHIR.js');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('fhirUtil', { user: req.user });
    FHIR.setUser();
    FHIR.getUser();
});



exports.router = router;