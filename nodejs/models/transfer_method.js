const mongoose = require('mongoose')
const Schema = mongoose.Schema
const transferMethodSchema = new Schema({
    tid: Number,
    name: String
}, { timestamps: true, versionKey: false, collection: 'transfer_method' })

const TransferMethodModel = mongoose.model('transfer_method', transferMethodSchema)
module.exports = TransferMethodModel