const mongoose = require('mongoose')
const { Schema } = mongoose;

const CandidateSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    name: {
        type: String,
    },

    email: {
        type: String,
    },

    skills: [String],

    experience: {
        type: String
    },

    salaryExpected: {
        type: String
    }

}, { timestamps: true })


const Candidate = mongoose.model('candidate', CandidateSchema);
module.exports = Candidate;