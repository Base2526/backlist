const mongoose = require( 'mongoose' );

const SocketsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    t: String,
    socketId: String,
    sessionId: String,
    auth: Number,
    device_detect: String,
    geolocation:  String,
},
{
    timestamps: true
});
module.exports = mongoose.model("Sockets", SocketsSchema); 