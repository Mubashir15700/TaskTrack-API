const mongoose = require("mongoose");

const jobApplicantsSchema = new mongoose.Schema({

});

const applicants = mongoose.model("applicants", jobApplicantsSchema);

module.exports = applicants;
