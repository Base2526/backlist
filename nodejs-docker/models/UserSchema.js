const mongoose = require( 'mongoose' );

const UserSchema = new mongoose.Schema({
    uid: String,
    email: String,
    name: String,
    pass: String,
    image_url: String,
    gender: String,
    type_login: String,
});
module.exports = mongoose.model("user", UserSchema); 