/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
'use strict';
//var fhir = require('fhir');
var Fhir = require('fhir').Fhir;
var fhir = new Fhir();

// var resource = {
//     resourceType: 'Patient',
//     ...
//   };
//   var fhir = new Fhir();
//   var xml = fhir.objToXml(resource);
//   var json = fhir.xmlToJson(xml);
//   var obj = fhir.xmlToObj(xml);
//   var results = fhir.validate(xml, { errorOnUnexpected: true });
//   results = fhir.validate(obj, {});

//var fhirInstance = new fhir;
module.exports = class FHIR {
    constructor() {
        var serverBase = "http://hapi.fhir.org/baseDstu3" ;
        var patientID = "6250999";
        var expected_name = "Johnson";
    }

    setUser() {
        console.log("we just called setUser!");
    }
    getUser() {
        var resource = {
            resourceType: 'Patient'   
          };
          var fhir = new Fhir();
          var xml = fhir.objToXml(resource);
          var json = fhir.xmlToJson(xml);
          var obj = fhir.xmlToObj(xml);
          var results = fhir.validate(xml, { errorOnUnexpected: true });
          results = fhir.validate(obj, {});
          console.log("this is result: ", results)
    }

}


// FhirContext ctx = FhirContext.forDstu3();
// client = ctx.newRestfulGenericClient(baseUrl);