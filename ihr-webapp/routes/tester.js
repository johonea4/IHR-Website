var express = require('express');
var router = express.Router();

var fhirtestUtil = require('../utils/fhirUtil');
var dbTester = require('../utils/dbutil');

fhirtestUtil.connect("http://hapi.fhir.org/baseDstu3");

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
    fhirtestUtil.find('Patient', { name: 'John' }).then(function (result) { console.log(result); res.redirect('/tester/test2') });
    //fhirtestUtil.addPatientMedication('436536');
    fhirtestUtil.getPatientMedications('436536').then(function (result) {
        console.log(result);
    });
});

router.get('/test2', function (req, res) {
    console.log("Testing /test2");
    //fhirtestUtil.addPatient().then(function () { res.redirect('/dashboard') });
    fhirtestUtil.getPatientMedications('436536').then(function (result) {
        console.log(result);
    });
});

router.get('/test3', function (req, res) {
    if (req.user) {
        console.log(req.user);
        dbTester.createPatient({ oid: req.user.oid, name: req.user.displayName, email: req.user.preferred_username, isProvider: false }).then(
            function (result) {
                console.log("Saving:");
                console.log(result);
            });
        dbTester.getAllPatients().then(
            function (result) {
                console.log("Retrieving:");
                console.log(result);
            });
        dbTester.getPatient(req.user.oid).then(function (result) {
            console.log("Reading:");
            console.log(result);
        });
    }
});

exports.router = router;
