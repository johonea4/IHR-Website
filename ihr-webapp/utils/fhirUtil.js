/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
'use strict';

var mkFhir = require('fhir.js');

var errFunc = function (res) {
    //Error responses
    if (res.status) {
        console.log('Error', res.status);
    }

    //Errors
    if (res.message) {
        console.log('Error', res.message);
    }
}

/******************************************************************************
 * FHIR class providing main function interfacing with FHIR server.
 *****************************************************************************/
module.exports = class fhirUtil {
    constructor(resourceUrl) {
        this.client = mkFhir({ baseUrl: resourceUrl });
    }

    async find(type, query, cb) {
        var results = [];

        try {
            const res = await this.client.search({ type: type, query: query });
            const bundle = res.data;
            var count = (bundle.entry && bundle.entry.length) || 0;
            for (var i = 0; i < count; i++) {
                results.push(bundle.entry[i]);
            }
        } catch (err) {
            errFunc(err);
        }

        cb(results);
        return results;
    }

    async getPatient(pid,cb) {
        var results = null;
        try {
            let res = await this.client.read({ type: 'Patient', id: pid });
            results = res.data();
        } catch (err) {
            errFunc(err);
        }

        cb(results);
        return results;
    }
    async addPatient() {
        var entry = {
            name: [{
                use: "official",
                text: "Eric Lin",
                family: "Lin",
                given: "Eric"
            }],
            gender: "male",
            birthDate: "1970-01-01",
            resourceType: 'Patient',
            status: "active",
            medicationCodeableConcept: {
                coding: [{
                    system: "http://snomed.info/ct",
                    code: "318632005",
                    display: "carvedilol 25 mg"
                }],
                text: "carvedilol 25 mg"
            },
            subject: { "reference": "Patient/23129" },
            taken: "y",
            dosage: [{
                text: "twice daily",
                timing: {
                    repeat: {
                        frequency: 2,
                        period: 1,
                        periodUnit: "d"
                    }
                },
                doseQuantity: {
                    value: 1,
                    unit: "tablet",
                    system: "http://snomed.info/ct",
                    code: "428673006"
                }
            }]
        };
        console.log("need to see this first...");
        try {
            let res = await this.client.create({ type: 'Patient', resource: entry });
            console.log("are we here?");
            console.log(res);
        } catch (err) {
            errFunc(err);
        }   
    }       
}

