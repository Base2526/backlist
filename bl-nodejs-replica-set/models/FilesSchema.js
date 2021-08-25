const mongoose = require( 'mongoose' );

const FilesSchema = new mongoose.Schema({
    fid: String,
    bn_medium: String,
    bn_thumbnail: String,
},
{
    timestamps: true
});
module.exports = mongoose.model("files", FilesSchema); 