const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let snippetSchema = new Schema ({
    "authorID": String,
    "authorName": String,
    "content": String,
    "title": String,
    "edited": String,
    "votes": Number
});

module.exports = mongoose.model("snippets", snippetSchema);