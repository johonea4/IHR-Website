var express = require('express');
var router = express.Router();

var fhirUtil = require('../utils/fhirUtil');
var dbutil = require('../utils/dbutil');

var fhirtestUtil = new fhirUtil("http://hapi.fhir.org/baseDstu3");

router.get('/', function (req, res) {
    res.render('UserDataEntry', { formAction: "tester/submit" });
    console.log("Testing /");
});

router.post('/submit', function (req, res) {
    var str = "Testing /submit"
    str += "<br>" + req.body.firstname;
    str += "<br>" + req.body.lastname;
    str += "<br>" + req.body.gender;
    str += "<br>" + req.body.dob;
    str += "<br>" + req.body.emailaddress;
    str += "<br>" + req.body.fhirserver;

    res.write(str);
    res.end();
});

router.get('/test1', function (req, res) {
    console.log("Testing /test1");
    //fhirtestUtil.find('Patient', { name: 'John' }, function (result) { console.log(result); res.redirect('/tester/test2') });
    //fhirtestUtil.addPatientMedication('436536');
    fhirtestUtil.getPatientMedications('436536');
});

router.get('/test2', function (req, res) {
    fhirtestUtil.addPatient().then(function () { res.redirect('/dashboard') });
   console.log("Testing /test2");
});

exports.router = router;
