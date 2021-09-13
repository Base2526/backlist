const mongoose = require( 'mongoose' );

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: Number,
    account_name: String,
    email: String,
    display_name: String,
    pass: String,
    image_url: String,
    gender: String,
    type_login: String,
},
{
    timestamps: true
});
module.exports = mongoose.model("user", UserSchema); 