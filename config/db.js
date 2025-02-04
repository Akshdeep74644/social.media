const mongoose = require("mongoose")

const connectTomongodb = async ()=>{
    try {
       await mongoose.connect(process.env.mongodbkey).then(()=>{
            console.log("connect to database")
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectTomongodb;