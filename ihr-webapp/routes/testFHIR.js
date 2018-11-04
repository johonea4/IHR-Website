/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
'use strict';

//var Fhir = require('fhir').Fhir;
var mkFhir = require('fhir.js');
//var fhir = new Fhir();


/******************************************************************************
 * FHIR class providing main function interfacing with FHIR server.
 *****************************************************************************/
module.exports = class FHIR {
    constructor() {
        this.serverBase = "http://hapi.fhir.org/baseDstu3" ;
        this.patientID = "6250999";
        this.expected_name = "Johnson";
    }

    setUser() {
        console.log("we just called setUser!");
    }
    getUser() {

        console.log("This is URL: ", this.serverBase);
        console.log("This is patientID: ", this.patientID);
        console.log("this is expected_name: ", this.expected_name);

        console.log("making requrest to FHIR test server DSTU3...Please wait for callback.");
        var client = mkFhir({
            baseUrl: "http://hapi.fhir.org/baseDstu3"
        });
        
        client
            .search( {type: 'Patient', query: { 'birthdate': '1974' }})
            .then(function(res){
                var bundle = res.data;
                var count = (bundle.entry && bundle.entry.length) || 0;
                console.log("# Patients born in 1974: ", count);
            })
            .catch(function(res){
                //Error responses
                if (res.status){
                    console.log('Error', res.status);
                }
        
                //Errors
                if (res.message){
                    console.log('Error', res.message);
                }
            });
        


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