/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
'use strict';
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
        return new Promise(
            async (resolve, reject) => {
                var results = [];
                try {
                    const res = await this.client.search({ type: 'MedicationStatement', query: { subject: patientID } });
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
}

