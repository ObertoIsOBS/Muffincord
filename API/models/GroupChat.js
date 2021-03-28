const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");
const User = require("./User");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    members: Array,
    name: String,
    owner: User,
    created: Date
})

exports = mongoose.model("GroupChat", schema);