const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "post"
    }

})

module.exports = mongoose.model("user", userModel);