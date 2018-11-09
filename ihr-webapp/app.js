/* So, we are going to create the main app JavaScript file.
 * This file will provide the following:
 * 
 * 1. 
 */

'use strict';

/******************************************************************************
 * Module dependencies.
 *****************************************************************************/

var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');


/******************************************************************************
 * Our Module dependencies.
 *****************************************************************************/
var login = require('./routes/login');
var dashboard = require('./routes/dashboard');
var history = require('./routes/history');
var tester = require('./routes/tester');
var logout = require('./routes/logout');
var userdataentry = require('./routes/UserDataEntry');

//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(methodOverride());
app.use(cookieParser());

app.use(expressSession({ secret: 'ihrwebapp021806131221', resave: true, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index', { user: req.user });
    //console.log(req.user.sub);
    //console.log(req.user.oid);
});

app.use('/login', login.router);
app.use('/dashboard', login.ensureAuthenticated, dashboard.router);
app.use('/history', login.ensureAuthenticated, history.router);
app.use('/tester', tester.router);
app.use('/logout', logout.router);
app.use('/UserDataEntry', login.ensureAuthenticated, userdataentry.router)
//Emma add 11.4
app.use(express.static('public'))

app.listen(3000);
