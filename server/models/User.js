const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema ({
    "name": String,
    "email": String,
    "password": String,
    "registerDate": String,
    "bio": String,
    "avatar": String,
    "commentVotes": Array,
    "snippetVotes": Array
});

module.exports = mongoose.model("users", userSchema);