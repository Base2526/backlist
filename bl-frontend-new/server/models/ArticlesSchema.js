const mongoose = require( 'mongoose' );

const ArticlesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nid: Number,
    title: String,
    body: String,
},
{
    timestamps: true
});
module.exports = mongoose.model("articles", ArticlesSchema); 