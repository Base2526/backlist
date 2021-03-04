const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name:  String,
  category: String,
  price: Number,
  tags: [String]
}, { timestamps: true, versionKey: false })

const ProductModel = mongoose.model('Product', productSchema)

// ProductModel.watch().on('change', data =>{
//   console.log(new Date(), data)
// });

module.exports = ProductModel