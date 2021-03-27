const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");
const Guild = require("./Guild");
const User = require("./User");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: Identifier,
    guild: Guild,
    user: User,
    roles: Array,
    created: Date
})

exports = mongoose.model("Member", schema);