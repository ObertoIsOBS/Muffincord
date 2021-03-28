const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");
const Guild = require("./Guild");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    type: Number,
    name: String,
    messages: Array,
    members: Array,
    permissions: Number,
    guild: Guild,
    created: Date
})

exports = mongoose.model("Channel", schema);