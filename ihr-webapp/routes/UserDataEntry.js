var express = require('express');

var router = express.Router();
var dbutil = require('../utils/dbutil');
var fhirutil = require('../utils/fhirUtil');

var status = undefined;
//undefined: form not started
//1: at form
//2: submit form
//3: processing
//4: success
//5: failure
//6: done

router.get('/', function (req, res) {
    status = 1;
    res.render('UserDataEntry', {
        formAction: "UserDataEntry/submit" });
});

router.post('/submit', function (req, res) {
    console.log('UserDataEntry /submit');

    if (status == undefined) {
        res.redirect('/UserDataEntry')
    }

    if (status == 6) {
        res.redirect('/');
    }

    if (status == 1) {
        status = 2;

        try {
            var qry = {
                given: req.body.firstname.toLowerCase(),
                family: req.body.lastname.toLowerCase(),
                gender: req.body.gender.toLowerCase(),
                birthdate: req.body.dob,
            }
            fhirutil.connect(req.body.fhirserver);
            fhirutil.find('Patient', qry).then(function (rslt) {
                status = 3;
                if (rslt.length > 0) {
                    dbutil.getPatient(req.user.oid).then(async function (p) {
                        p.fhirResources.push({
                            url: req.body.fhirserver,
                            patientId: rslt[0].resource.id,
                            validated: true
                        });
                        await p.save();
                        await dbutil.updateResources(p.userInfo.oid);
                        status = 4;
                    });
                }
                else {
                    status = 5;
                }
            }).catch(function (err) {
                status = 5;
            });
        }
        catch (err) {
            status = 5;
        }
    }

    res.render('status', { processing: true });
});

router.get('/submit', function (req, res) {

    if (status < 2) {
        res.redirect('/UserDataEntry')
    }

    else if (status == 3) {
        res.render('status', { processing: true });
    }
    else if (status == 4) {
        status = 6;
        res.render('status', { processing: false, success: true, failure: false });
    }
    else if (status == 5) {
        status = 6
        res.render('status', { processing: false, success: false, failure: true });
    }
    else if (status == 6) {
        res.redirect('/');
    }

});
exports.router = router;