const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionsSchema = new Schema({}, { timestamps: true, versionKey: false, collection: 'sessions' })

const SessionsModel = mongoose.model('sessions', sessionsSchema)
module.exports = SessionsModel