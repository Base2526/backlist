const mongoose = require('mongoose')
const Schema = mongoose.Schema
const followerPostSchema = new Schema({
    post_id: String,
    follower: [],
}, { timestamps: true, versionKey: false, collection: 'follower_post' })

const followerPostModel = mongoose.model('follower_post', followerPostSchema)
module.exports = followerPostModel