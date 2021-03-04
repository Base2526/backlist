const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chitsSchema = new Schema({
    uid: String,
    chait_type: String,
    data: [],
    round: {}
}, { timestamps: true, versionKey: false, collection: 'chits' })

const ChitsModel = mongoose.model('chits', chitsSchema)
module.exports = ChitsModel