const mongoose = require('mongoose')
const Schema = mongoose.Schema

const huayListBankSchema = new Schema({
    tid: Number,
    name: String,
    huay_name_bank: String,
    huay_number_bank: String,
}, { timestamps: true, versionKey: false, collection: 'huay_list_bank' })

const HuayListBankModel = mongoose.model('huay_list_bank', huayListBankSchema)
module.exports = HuayListBankModel