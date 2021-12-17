const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let commentSchema = new Schema ({
    "authorID": String,
    "authorName": String,
    "content": String,
    "votes": Number,
    "edited": String,
    "snippet": String
});

module.exports = mongoose.model("comments", commentSchema);