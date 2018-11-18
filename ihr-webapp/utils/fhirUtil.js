/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
'use strict';
var jquery = require("jquery");
var mkFhir = require('fhir.js');

var errFunc = function (res) {
    //Error responses
    if (res.status) {
        console.log('Error Resopnse', res.status);
    }

    //Errors
    if (res.message) {
        console.log('Error Message', res.message);
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
            status: "active"
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
    async addPatientMedication( patientID ) {

        var entry = {
            resourceType: "MedicationStatement",
            //id: "23201",
            meta: {
                versionId: "1",
                lastUpdated: "2018-10-01T07:31:49.588+00:00"
            },
            status: "active",
            medicationCodeableConcept: {
                coding: [{
                    system: "http://snomed.info/ct",
                    code: "321323009",
                    display: "buspirone 5mg"
                }],
                text: "buspirone 5mg"
            },
            subject: {
                reference: "Patient/" + patientID
            },
            effectiveDateTime: "2018-05-12T04:04:13.435+00:00",
            taken: "y",
            dosage: [{
                    text: "3 times daily",
                    timing: {
                        repeat: {
                        frequency: 3,
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
        }
        try {
            let res = await this.client.create({ type: 'MedicationStatement', resource: entry });
            console.log(res);
        } catch (err) {
            errFunc(err);
        }  
    }
    async getPatientMedications(patientID) {
        var results = [];

        try {
            const res = await this.client.search({ type: 'MedicationStatement', resource:{subject : {reference: 'Patient/'+patientID }}});
            //var bundle = res.data;
            
            //var count = (bundle.entry && bundle.entry.length) || 0;
            
            //var count = 1;
            //console.log(bundle);
            //var newBundle = this.client.nextPage({bundle:res.data});
            //console.log(bundle.nextPage);
            //console.log(bundle._page);
            //console.log(bundle._count);
            //console.log(this.client.nextPage( {bundle : res.data}));
            var bundle = this.getNext(res);
            console.log();
            //console.log(this.client._page);
            //console.log(this.client._count);
            //for (var i = 0; i < count; i++) {
                //console.log(bundle.entry[i].resource.subject.reference);
                //results.push(bundle.entry[i]);
            //}
        } catch (err) {
            errFunc(err);
        }

        //cb(results);
        return results;   
    }   
    getNext (bundle) {
        var i;
        var d = bundle.data.entry;
        var entries = [];
        for (i = 0; i < d.length; i++) {
            entries.push(d[i].resource);
        }
        var def = jquery.Deferred();
        this.client.nextPage({bundle:bundle.data}).then(function (r) {
            jquery.when(getNext(r)).then(function (t) {
                def.resolve(entries.concat(t));
            });
        }, function(err) {def.resolve(entries)});
        return def.promise();
  }    
}

