var express = require('express');

var router = express.Router();
var dbUtil = require('../utils/dbutil');

router.get('/', function (req, res) {
    var jsonData;
    //get data then pass in through the renderer
    async function fetch()
    {
        jsonData = await FetchPatient(req, res);
    }
    
    fetch();
});

//Use the fhir record for John doe birthdate 1963-06-25.
async function FetchPatient(req, res)
{
    dbUtil.getPatient(req.user.oid).then(async function(p)
    {
        var medData = JSON.stringify(p);
        res.render('history', { user: req.user, userData: medData });
    });
}

exports.router = router;