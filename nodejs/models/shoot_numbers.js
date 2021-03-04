const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shootNumbersSchema = new Schema({
    round_id: String,
    number: String,
    uid: String,
    user: {},
    date: String,
}, { timestamps: true, versionKey: false, collection: 'shoot_numbers' })

const ShootNumbersModel = mongoose.model('shoot_numbers', shootNumbersSchema)
module.exports = ShootNumbersModel