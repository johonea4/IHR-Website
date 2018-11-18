/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
'use strict';
var jquery = require("jquery");
var mkFhir = require('fhir.js');

var errFunc = function (res) {
    //Error responses
    if (res.status) {
        console.log('Error Status: ', res.status);
    }

    //Errors
    if (res.message) {
        console.log('Error Message: ', res.message);
    }
}

/******************************************************************************
 * FHIR class providing main function interfacing with FHIR server.
 *****************************************************************************/
module.exports = class fhirUtil {
    constructor(resourceUrl) {
        this.client = mkFhir({ baseUrl: resourceUrl });
    }

    async find(type, query) {
        return new Promise(
            async (resolve, reject) => {
                var results = [];
                try {
                    const res = await this.client.search({ type: type, query: query });
                    const bundle = res.data;
                    var count = (bundle.entry && bundle.entry.length) || 0;
                    for (var i = 0; i < count; i++) {
                        results.push(bundle.entry[i]);
                    }
                    resolve(results);
                } catch (err) {
                    errFunc(err);
                    reject(err);
                }
            });
    }

    async getPatient(pid) {
        return new Promise(
            async (resolve, reject) => {
                var results = null;
                try {
                    let res = await this.client.read({ type: 'Patient', id: pid });
                    results = res.data();
                    resolve(result);
                } catch (err) {
                    errFunc(err);
                    reject(err);
                }
            });
        return results;
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
}

