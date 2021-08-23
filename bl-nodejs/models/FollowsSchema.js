const mongoose = require( 'mongoose' );

const FollowsSchema = new mongoose.Schema({
    nid: String,
    value: [],
},
{
    timestamps: true
});
module.exports = mongoose.model("Follows", FollowsSchema); 