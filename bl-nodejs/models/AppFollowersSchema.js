const mongoose = require( 'mongoose' );

const AppFollowersSchema = new mongoose.Schema({
    nid: String,
    value: [],
},
{
    timestamps: true
});
module.exports = mongoose.model("AppFollowers", AppFollowersSchema); 