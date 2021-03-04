const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listBankSchema = new Schema({
    tid: Number,
    name: String
}, { timestamps: true, versionKey: false, collection: 'list_bank' })

const ListBankModel = mongoose.model('list_bank', listBankSchema)
module.exports = ListBankModel