var express = require('express');

var router = express.Router();
var dbUtil = require('../utils/dbutil');


router.get('/', function (req, res) {
    async function FetchWrapper()
    {
        await FetchData(req, res);    
    }

    FetchWrapper();
});

async function FetchData(req, res)
{
    dbUtil.getPatient(req.user.oid).then(async function(p)
    {
        var medData = JSON.stringify(p);
        res.render('dashboard', { user: req.user, chartData: medData });
    });    
}

exports.router = router;