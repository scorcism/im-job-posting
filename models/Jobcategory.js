const mongoose = require('mongoose')
const { Schema } = mongoose;

const JobcategorySchema = new Schema({
    name:{
        type:String,
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

const Jobcategory = mongoose.model('jobcategory', JobcategorySchema);
module.exports = Jobcategory;