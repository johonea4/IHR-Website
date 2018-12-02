var express = require('express');

var router = express.Router();
var dbUtil = require('../utils/dbutil');

var request = require('superagent')

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

router.post('/createevent', function (req, res) {

    var title = req.body.medName;
    var body = req.body.instructions;
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1)

    var startTime = today.toISOString().split('T')[0] + 'T00:00:00';
    var endTime = tomorrow.toISOString().split('T')[0] + '00:00:00';

    var event = {
        subject: "Take " + title,
        body: {
            content: body,
            contentType: "Text"
        },
        start: {
            "dateTime": startTime,
            "timeZone": "Pacific Standard Time"
        },
        end: {
            dateTime: endTime,
            timeZone: "Pacific Standard Time"
        },
        isReminderOn: true,
        isAllDay: true
    };

    var message = JSON.stringify(event);
    var accessToken = req.user.accessToken;

    request.post('https://graph.microsoft.com/v1.0/me/calendar/events')
        .send(message)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('Content-Type', 'application/json')
        .set('Content-Length', message.length)
        .end((err, res) => {
            console.log(err);
        });
    res.redirect('/history');
});

exports.router = router;