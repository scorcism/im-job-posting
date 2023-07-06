const mongoose = require('mongoose')
const { Schema } = mongoose;

const JoblistingSchema = new Schema({
    adminId: {
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
    title: {
        type: String,
    },
    companydetails: {
        name: String,
        established: Number,
    },

    tags: [String],

    skills:[String],

    experiencereq: {
        type: Number,
    },

    description: {
        type: String
    },

    salary: {
        type: Number,
    }

}, { timestamps: true })

const Joblisting = mongoose.model('joblisting', JoblistingSchema);
module.exports = Joblisting;