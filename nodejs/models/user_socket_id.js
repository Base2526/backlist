const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSocketIDSchema = new Schema({
    uid: Number,
    data: [],
}, { timestamps: true, versionKey: false, collection: 'user_socket_id' })

const UserSocketIDModel = mongoose.model('user_socket_id', UserSocketIDSchema)
module.exports = UserSocketIDModel