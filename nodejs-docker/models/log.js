const mongoose = require( 'mongoose' );

const logSchema = new mongoose.Schema({
  text: String,
  tags: {type: Array, index: true},
  timestamp: {type: Date, index: true, default: Date.now, expires: '30d'}
});

module.exports = mongoose.model("Logs", logSchema); 