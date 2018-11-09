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

    find(query) {
        results = [];

        this.client.search({
            type: query.type,
            query: query.query
        }).then(function (res) {
            var bundle = res.data;
            var count = (bundle.entry && bundle.entry.length) || 0;
            for (var i = 0; i < count; i++) {
                results.push(bundle.entry[i]);
                }
            }).catch(errFunc);

        return results;
    }

    getPatient(pid) {
        results = null;
        this.client.read({ type: 'Patient', id: pid }).then(function (res) {
            results = res.data();
        }).catch(errFunc);

        return results;
    }
}


// Will clean up later. for now, just kept below for reference...

// var resource = {
//     resourceType: 'Patient'   
//   };
//   var fhir = new Fhir();
//   var xml = fhir.objToXml(resource);
//   var json = fhir.xmlToJson(xml);
//   var obj = fhir.xmlToObj(xml);
//   var results = fhir.validate(xml, { errorOnUnexpected: true });
//   results = fhir.validate(obj, {});
//   console.log("this is result: ", results)

// FhirContext ctx = FhirContext.forDstu3();
// client = ctx.newRestfulGenericClient(baseUrl);