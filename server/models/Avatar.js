const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let avatarSchema = new Schema ({
    "user": String,
    "encoding": String,
    "mimetype": String,
    "buffer": Buffer
});


module.exports = mongoose.model("avatar", avatarSchema);