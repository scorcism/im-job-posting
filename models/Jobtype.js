const mongoose = require('mongoose')
const { Schema } = mongoose;

const JobtypeSchema = new Schema({
    name: {
        type: String,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    jobCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobcategory"
    }

}, { timestamps: true })

const Jobtype = mongoose.model('jobtype', JobtypeSchema);
module.exports = Jobtype;