const mongoose = require("mongoose");
const Identifier = require("../classes/Identifier");
const ClientUser = require("./ClientUser");

const schema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    token: mongoose.Types.ObjectId,
    type: String,
    user: ClientUser
})

exports = mongoose.model("UserToken", schema);