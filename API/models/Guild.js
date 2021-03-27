const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    members: Array,
    channels: Array,
    roles: Array,
    created: Date
})

exports = mongoose.model("Guild", schema);