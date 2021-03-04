const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lotterysSchema = new Schema({
    tid: Number,
    name: String,
    end_time: String,
    is_open: Boolean,
    image_url: String,
    weight: Number,
    rounds: [],
}, { timestamps: true, versionKey: false, collection: 'lotterys' })

const LotterysModel = mongoose.model('lotterys', lotterysSchema)
module.exports = LotterysModel

/*

$data['tid']       = $tag_term->tid;
        $data['name']      = $tag_term->name;;
        $data['end_time']  = $end_time;
        $data['is_open']   = $is_open;
        $data['image_url'] = $image_url;
        $data['weight']    = $weight;
        $data['type_lottery']= $type_lottery;*/