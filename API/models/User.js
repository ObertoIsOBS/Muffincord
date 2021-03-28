const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    username: String,
    discriminator: Number,
    created: Date,
    status: Number,
    acceptingFriends: Boolean
})

exports = mongoose.model("User", schema);