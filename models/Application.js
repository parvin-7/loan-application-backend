const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserLogin", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    residenceType: { type: String, required: true },
    monthlyIncome: { type: Number, required: true },
    previousLoan: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    dependencies: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
});

module.exports = mongoose.model("Application", ApplicationSchema);