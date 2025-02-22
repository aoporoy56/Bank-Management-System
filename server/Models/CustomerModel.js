const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    accountNo: { type: String, unique: true, },
    password: { type: String },
    balance: { type: Number, default: 10000 },

    // Account Information
    accountTitleEnglish: { type: String, required: true, unique: true },
    accountTitleBangla: { type: String, required: true },
    accountType: { type: String, enum: ["savingsAccounts", "currentAccounts", "fixedAndRecurringDepositAccounts", "specializedAccounts"], default: "savingsAccounts" },
    currency: { type: String, enum: ["BDT", "USD", "EUR"], default: "BDT" },
    selectedDivision: { type: String, required: true },
    selectedDistrict: { type: String, required: true },
    contactAddress: { type: String, required: true },
    sourceOfFund: { type: [String], default: [] },
    selfImageUrl: { type: String, required: true },
    nidImageUrl: { type: String, required: true },
    signatureImageUrl: { type: String, },

    // Customer Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    banglaFullTitle: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    spouseName: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    occupation: { type: String },
    monthlyIncome: { type: Number, min: 0 },
    nationalId: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ , unique: true},
    phone1: { type: String, required: true, match: /^[0-9]{10,15}$/ },
    phone2: { type: String, match: /^[0-9]{10,15}$/ },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    religion: { type: String },
    maritalStatus: { type: String, enum: ["Single", "Married", "MARRIED", "Divorced", "Widowed"] },

    // Nominee Information
    nomineeName: { type: String, required: true },
    relationshipWithAccountHolder: {
        type: String,
        enum: ["Spouse/Child", "Parent", "Sibling", "Other"]
    },
    nomineeDob: { type: Date, required: true },
    nomineePercentage: { type: Number, min: 0, max: 100, required: true },
    nomineeNationalId: { type: String, required: true },
    nomineeIdType: {
        type: String,
        enum: ["NID", "Passport", "Birth Certificate", "Others"]
    },
    nomineeOtherIdType: { type: String },
    nomineeOtherIdDescription: { type: String },
    nomineeAddress: { type: String, required: true },
    isNomineeUnder18: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "pending"},
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

customerSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            // Find the customer with the highest account number
            const lastCustomer = await mongoose.model("Customer").findOne({}, { accountNo: 1 }).sort({ accountNo: -1 }).lean();

            // Generate a new account number
            const prefix = "ACC"; // Account prefix
            const year = new Date().getFullYear(); // Current year
            let newAccountNo;

            if (lastCustomer && lastCustomer.accountNo) {
                // Extract the numeric part from the last account number
                const lastNumber = parseInt(lastCustomer.accountNo.slice(prefix.length), 10);
                newAccountNo = `${prefix}${lastNumber + 1}`; // Increment the number
            } else {
                newAccountNo = `${prefix}${year}000001`; // Start from the first account
            }

            this.accountNo = newAccountNo;
            next();
        } catch (err) {
            next(err); // Pass the error to Mongoose error handlers
        }
    } else {
        next(); // Proceed normally for non-new documents
    }
});
module.exports = mongoose.model("Customer", customerSchema);
