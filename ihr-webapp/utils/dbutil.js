var mongoose = require('mongoose');
var schema = mongoose.Schema;
var fhirutil = require('./fhirUtil');

var userSchema = new schema({
    oid: { type: String, required: true, unique: true }, //Provided by Azure AD
    name: String, // Name of user from Microsoft Account
    email: String, // Email From Microsoft Account
    isProvider: Boolean, // Is this user a provider
});

var patientSchema = new schema({
    userInfo: userSchema,
    fhirResources: [{
        url: String, // URL for fhir resource
        patientId: String, // Patient Id from resource
        validated: Boolean // Was this user Validated for this resource?
    }], // Array of fhir resources for user
    medications: [{
        resourceUrl: String, // fhir resource url, or MANUAL for manual entries or PROVIDER for provider entries
        resourceId: String, // Resource Id from fhir resource. null if manual or provider 
        name: String, // Name of medication
        instructions: String,
        frequency: Number, // How many times per day should it be taken
        period: Number,
        periodUnit: String,
        doseQuantity: Number, // How much should be taken per dosage
        doseUnits: String, // Units for dosage 
        asNeeded: Boolean // Boolean to set if medication is on as needed basis
    }],
    allowedProviders: [{
        oid: String,
        access: String, // either R, or RW
    }]
});

var providerSchema = new schema({
    userInfo: userSchema,
    verified: Boolean // Has the provider been validated
});

var instance;

class dbutil {
    constructor() {
    }

    connect(dburl){
        mongoose.connect(dburl);
        this.patientModel = mongoose.model('patientModel', patientSchema);
        this.providerModel = mongoose.model('providerModel', providerSchema);
}

    async createPatient(info) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var p = new this.patientModel({ userInfo: info });
                    p.save();
                    resolve(p);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
    }

    async createProvider(info) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var p = new this.providerModel({ userInfo: info });
                    p.save();
                    resolve(p);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
    }

    async getAllPatients() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var p = [];
                    p = await this.patientModel.find({});
                    resolve(p);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
    }

    async getAllProviders() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var p = await this.providerModel.find({});
                    resolve(p);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
    }

    async getPatient(id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var p = await this.patientModel.findOne({ 'userInfo.oid': id });
                    resolve(p);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
    }

    async getProvider(id) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var p = await this.providerModel.findOne({ 'userInfo.oid': id });
                    resolve(p);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
    }

    async updateResources(id) {
        var patient = await this.getPatient(id);
        var resources = patient.fhirResources;
        patient.medications.length = 0;

        for (var i = 0; i < resources.length; i++) {
            await fhirutil.connect(resources[i].url);
            var records = await fhirutil.getPatientMedications(resources[i].patientId);

            for (var j = 0; j < records.length; j++) {
                patient.medications.push({
                    resourceUrl: records[j].fullUrl,
                    resourceId: records[j].resource.id,
                    name: records[j].text.div,
                    instructions: records[j].dosage[0].text,
                    frequency: records[j].dosage[0].timing.frequency,
                    period: records[j].dosage[0].timing.period,
                    periodUnit: records[j].dosage[0].timimg.periodUnit,
                    doseQuantity: records[j].dosage[0].doseQuantity.value,
                    doseUnits: records[j].dosage[0].doseQuantity.unit,
                    asNeeded: records[j].dosage[0].asNeededBoolean
                });
            }
        }
        patient.save();
    }
};

var instance = new dbutil();

module.exports = instance;