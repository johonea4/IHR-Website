'use strict';

var express = require('express');
var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
var config = require('../config');

var dbutil = require('../utils/dbutil')

var users = [];

exports.findByOid = function (oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.oid === oid) {
            return fn(null, user);
        }
    }
    return fn(null, null);
};

passport.serializeUser(function (user, done) {
    done(null, user.oid);
});

passport.deserializeUser(function (oid, done) {
    exports.findByOid(oid, function (err, user) {
        done(err, user);
    });
});

passport.use(new OIDCStrategy({
        identityMetadata: config.creds.identityMetadata,
        clientID: config.creds.clientID,
        responseType: config.creds.responseType,
        responseMode: config.creds.responseMode,
        redirectUrl: config.creds.redirectUrl,
        allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
        clientSecret: config.creds.clientSecret,
        validateIssuer: config.creds.validateIssuer,
        isB2C: config.creds.isB2C,
        issuer: config.creds.issuer,
        passReqToCallback: config.creds.passReqToCallback,
        scope: config.creds.scope,
        loggingLevel: config.creds.loggingLevel,
        nonceLifetime: config.creds.nonceLifetime,
        nonceMaxAmount: config.creds.nonceMaxAmount,
        useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
        cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
        clockSkew: config.creds.clockSkew,
    },
    function (iss, sub, profile, accessToken, refreshToken, done) {
            if (!profile.oid) {
                return done(new Error("No oid found"), null);
        }
        profile.accessToken = accessToken;
            // asynchronous verification, for effect...
            process.nextTick(function () {
                exports.findByOid(profile.oid, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        // "Auto-registration"
                        users.push(profile);
                        return done(null, profile);
                    }
                    return done(null, user);
                });
            });
        }
    )
);

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
};

var router = express.Router();
router.get('/', function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
        {
            response: res,
            resourceURL: config.resourceURL,
            customState: 'my_state',
            failureRedirect: '/',
            session: false
        })(req, res, next);
    },
    function (req, res) {
        res.redirect('/');
});

router.get('/auth/openid/return',
    function (req, res, next) {
        passport.authenticate('azuread-openidconnect',
            {
                response: res,
                failureRedirect: '/',
            })(req, res, next);
    },
    function (req, res) {
        res.redirect('/');
    });

router.post('/auth/openid/return',
    function (req, res, next) {
        passport.authenticate('azuread-openidconnect',
            {
                response: res,                      // required
                failureRedirect: '/',
            }
        )(req, res, next);
    },
    function (req, res) {
        //---- Save user to database here ---//
        dbutil.getPatient(req.user.oid).then(function (rslt) {
            if (rslt == undefined) {
                rslt = dbutil.createPatient({
                    oid: req.user.oid,
                    name: req.user.displayName,
                    email: req.user.preferred_username,
                    isProvider: false
                });
            }
            return rslt;
        }).then(function (rslt) {
            //--- update data from all resources
            dbutil.updateResources(rslt.userInfo.oid);
        });
        res.redirect('/');
   });

exports.router = router;