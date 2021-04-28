const mongoose = require('mongoose')
const Schema = mongoose.Schema
const socketsSchema = new Schema({
    uniqueId: String,
    socketId: String,
    platform: String,
    uid: String
}, { timestamps: true, versionKey: false, collection: 'sockets' })

const socketsModel = mongoose.model('sockets', socketsSchema)
module.exports = socketsModel