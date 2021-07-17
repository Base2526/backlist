const mongoose = require( 'mongoose' );

const kittySchema = new mongoose.Schema({
  text: String,
});
module.exports = mongoose.model("Kitten", kittySchema); 