const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactUsSchema = new Schema({
    line_at:  String,
    url_qrcode: String
}, { timestamps: true, versionKey: false, collection: 'contact_us' })

const ContactUsModel = mongoose.model('contact_us', contactUsSchema)
module.exports = ContactUsModel