const mongoose = require('mongoose')
const Schema = mongoose.Schema

const awardsSchema = new Schema({
    type_lotterys: String,
    round_tid: String,
    date: String,
    data: {}
}, { timestamps: true, versionKey: false, collection: 'awards' })

const AwardsModel = mongoose.model('awards', awardsSchema)
module.exports = AwardsModel