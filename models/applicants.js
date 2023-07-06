const mongoose = require('mongoose')
const { Schema } = mongoose;

const ApplicantsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    jobCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobcategory"
    },
    jobTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobtype"
    },
    jobListingId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Joblisting"
    },
    status: {
        type: String,
        default: "new"
        // new application -> new
        // verified by admin -> verified
        // rejected by admin -> rejected
    },
    message: {
        type: String,
        default: ""
    }

}, { timestamps: true })


const Applicant = mongoose.model('applicant', ApplicantsSchema);
module.exports = Applicant;