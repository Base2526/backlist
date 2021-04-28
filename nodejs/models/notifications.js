const mongoose = require('mongoose')
const Schema = mongoose.Schema
const notificationsSchema = new Schema({
    uid: String,
    notification: [],
}, { timestamps: true, versionKey: false, collection: 'notifications' })

const notificationsModel = mongoose.model('notifications', notificationsSchema)
module.exports = notificationsModel