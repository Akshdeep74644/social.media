const mongoose = require('mongoose')
const date = require('date-and-time');

const postModel = new mongoose.Schema({
    content: {
        type: String
    },
    like:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    date:  {
        type: Date,
        default: Date.now()
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("post", postModel);