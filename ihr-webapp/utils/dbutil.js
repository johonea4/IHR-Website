var mongoose = require('mongoose');
var schema = mongoose.Schema;

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
        startDate: Date, // Start date of medication
        endDate: Date, // End date of medication
        frequency: Number, // How many times per day should it be taken
        quantity: Number, // How much should be taken per dosage
        units: String, // Units for dosage 
        isOpioid: Boolean // Boolean to set if medication is an opioid. Need to place Addiction warning around these
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

module.exports = class dbutil {
    constructor(dburl) {
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
};