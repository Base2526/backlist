const mongoose = require( 'mongoose' );

const ArticlesSchema = new mongoose.Schema({
    nid: String,
    title: String,
    body: String,
},
{
    timestamps: true
});
module.exports = mongoose.model("articles", ArticlesSchema); 