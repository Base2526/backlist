const mongoose = require( 'mongoose' );

const ContentsSchema = new mongoose.Schema({
    nid             : Number,
    type            : String,
    title           : String,
    name_surname    : String,
    owner_id        : Number,
    transfer_amount : String,
    detail          : String,
    selling_website : String,
    id_card_number  : String,
    merchant_bank_account : [],
    images          : [],
    status          : Boolean, 
    created         : String,
    changed         : String,
    langcode        : String,
},
{
    timestamps: true
});
module.exports = mongoose.model("contents", ContentsSchema); 