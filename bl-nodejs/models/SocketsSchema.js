const mongoose = require( 'mongoose' );

const SocketsSchema = new mongoose.Schema({
    t: String,
    socketId: String,
    platform: String,
    auth: String,
},
{
    timestamps: true
});
module.exports = mongoose.model("Sockets", SocketsSchema); 