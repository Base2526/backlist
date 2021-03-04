const mongoose = require('mongoose')
const Schema = mongoose.Schema

const peopleSchema = new Schema({
    uid:  String,
    name: String,
    email: String,
    roles: [String],
    image_url: String,
    credit_balance: Number,
    banks:[],
    user_access:{}
}, { timestamps: true, versionKey: false, collection: 'people' })

const PeopleModel = mongoose.model('people', peopleSchema)
module.exports = PeopleModel