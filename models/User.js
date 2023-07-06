const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    adminId: {
        type: String,
        default: "",
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: Number,
        default: 1,
    },

}, { timestamps: true })

const User = mongoose.model('user', UserSchema);
module.exports = User;



