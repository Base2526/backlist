const mongoose = require( 'mongoose' );

const AppFollowersSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nid: String,
    value: [],
},
{
    timestamps: true
});
module.exports = mongoose.model("AppFollowers", AppFollowersSchema); 

/*
เก็บแยกตาม id ของ content โดยจะมี value เก็บ uid: [user id ของคนที follow], status: [true/false], date:Date.now()
*/