const mongoose = require('mongoose')


const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_STRING)
        .then(() => {
            console.log("Connected to db")
        })
        .catch((error) => {
            console.log("ERROR!!!!!: ", error)
        })
}


module.exports = connectToMongo; 