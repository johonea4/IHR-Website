var express = require('express');

var router = express.Router();
var dbutil = require('../utils/dbutil');
var fhirutil = require('../utils/fhirUtil');

router.get('/', function (req, res) {
    res.render('UserDataEntry', {
        formAction: "UserDataEntry/submit" });
});

router.post('/submit', function (req, res) {
    console.log('UserDataEntry /submit');
    var qry = {
        given: req.body.firstname,
        family: req.body.lastname,
        gender: req.body.gender,
        birthdate: req.body.dob,
    }

    fhirutil.connect(req.body.fhirserver);
    fhirutil.find('Patient', qry).then(function (rslt) {
        if (rslt.length > 0) {
            dbutil.getPatient(req.user.oid).then(function (p) {
                p.fhirResources.push({
                    url: req.body.fhirserver,
                    patientId: rslt.resource.id,
                    validated: true
                })
            })
        }
    })
});

exports.router = router;