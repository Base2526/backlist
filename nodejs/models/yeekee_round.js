const mongoose = require('mongoose')
const Schema = mongoose.Schema
const yeekeeRoundSchema = new Schema({
    tid: Number,
    name: String,
    weight: Number
}, { timestamps: true, versionKey: false, collection: 'yeekee_round' })

const YeekeeRoundModel = mongoose.model('yeekee_round', yeekeeRoundSchema)
module.exports = YeekeeRoundModel