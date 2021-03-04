const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DepositStatusSchema = new Schema({
    tid: Number,
    name: String
}, { timestamps: true, versionKey: false, collection: 'deposit_status' })

const DepositStatusModel = mongoose.model('deposit_status', DepositStatusSchema)
module.exports = DepositStatusModel