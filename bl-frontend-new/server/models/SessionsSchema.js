const mongoose = require( 'mongoose' );

const SessionsSchema = new mongoose.Schema({
    _id: String,
    expires: Date,
    session: String
},
{
    timestamps: true
});
module.exports = mongoose.model("sessions", SessionsSchema); 