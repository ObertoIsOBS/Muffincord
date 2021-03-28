const mongoose = require("mongoose");
const Channel = require("./Channel");
const Identifier = require("../classes/Identifier");
const User = require("./User");
const Member = require("./Member");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    channel: Channel,
    author: User,
    member: Member,
    content: String,
    attachements: Array,
    system: Boolean,
    created: Date
})

exports = mongoose.model("Message", schema);