/*
   uniqueId: unique_id,
  //       socketId: socket.id,
  //       platform,
  //       createdAt: new Date(),
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const socketsSchema = new Schema({
    uniqueId: String,
    socketId: String,
    platform: String
}, { timestamps: true, versionKey: false, collection: 'sockets' })

const socketsModel = mongoose.model('sockets', socketsSchema)
module.exports = socketsModel