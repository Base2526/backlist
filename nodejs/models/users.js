const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = new Schema({
    uid: String,
    followUps: [],
    follow_ups: [],
}, { timestamps: true, versionKey: false, collection: 'users' })

const usersModel = mongoose.model('users', usersSchema)
module.exports = usersModel