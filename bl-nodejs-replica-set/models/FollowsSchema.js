const mongoose = require( 'mongoose' );

const FollowsSchema = new mongoose.Schema({
    uid: String,
    value: [],
},
{
    timestamps: true
});
module.exports = mongoose.model("Follows", FollowsSchema); 

/*
เก็บแยกตาม uid โดยจะมี value เก็บ id: [id ของ content ที่ follow], status: [true/false], date:Date.now(), local:[true/false เก้บ ว่ามีการ syc มา server หรือยัง ถ้า ยังจะเป้น true]
*/