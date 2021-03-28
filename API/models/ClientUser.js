const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    username: String,
    discriminator: Number,
    acceptingFriends: Boolean,
    created: Date,
    password: String,
    email: String,
    friends: Array,
    requests: {
        incoming: Array,
        outgoing: Array
    },
    groups: Array,
    guilds: Array,
    emailVerified: Boolean
})

exports = mongoose.model("User", schema);