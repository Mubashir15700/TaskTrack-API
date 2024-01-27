const mongoose = require("mongoose");

const JobApplicantsSchema = new mongoose.Schema({

});

const Applicants = mongoose.model("Applicants", JobApplicantsSchema);

module.exports = Applicants;
