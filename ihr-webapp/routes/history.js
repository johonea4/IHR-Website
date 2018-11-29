var express = require('express');

var router = express.Router();
var dbUtil = require('../utils/dbutil');
var fhirUtil = require('../utils/fhirUtil');

router.get('/', function (req, res) {
    var jsonData;
    //get data then pass in through the renderer
    async function fetch()
    {
        jsonData = await FetchPatient(req, res);
        //console.log("Data: " + jsonData);
        //res.render('history', { user: req.user, userData: jsonData });
    }
    
    fetch();
});

//Use the fhir record for John doe birthdate 1963-06-25.
async function FetchPatient(req, res)
{
    var id;
    await fhirUtil.find('Patient', {given: 'John', gender: 'female', family: 'Doe', birthdate: '1990-11-06', _format:'json'}).then(function(rslt)
    {
        var jsonObj = JSON.stringify(rslt[0], 'id', 1);
        //console.log("data: " + jsonObj);

        var resource = JSON.parse(jsonObj, "resource");
        if(resource != undefined)
        {
            id = resource.resource.id;           
        }
        //console.log(resource.resource.id);
        
        //res.render('history', { user: req.user, userData: jsobj });
        
    });

    if(id == undefined)
    {
        res.render('history', { user: req.user, userData: undefined });
        return;
    }

    await fhirUtil.getPatientMedications(id).then(function(meds)
    {
        console.log("len: " + meds.length);
        //console.log(meds);
        
        var medData = JSON.stringify(meds);
        console.log(medData);
        
        res.render('history', { user: req.user, userData: medData });
    }).catch((error) => 
    {
        console.log(error);
    });
}

exports.router = router;