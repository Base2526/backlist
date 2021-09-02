const mongoose = require( 'mongoose' );

const kittySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  text: String,
});
module.exports = mongoose.model("Kitten", kittySchema); 