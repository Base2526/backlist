const crypto = require('crypto');
const _ = require('lodash')

const SessionsSchema    = require('../models/SessionsSchema')

const AES_METHOD = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16, checked with php
const password = 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36'; // Must be 256 bytes (32 characters)

exports.encrypt = (text) => {

    if (process.versions.openssl <= '1.0.1f') {
        throw new Error('OpenSSL Version too old, vulnerability to Heartbleed')
    }

    let password = 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36'; // Must be 256 bytes (32 characters)
    let AES_METHOD = 'aes-256-cbc';
    let IV_LENGTH = 16; // For AES, this is always 16, checked with php
    
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(AES_METHOD, Buffer.from(password), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.decrypt = (text) => {
    let password = 'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36'; // Must be 256 bytes (32 characters)

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

exports.isEmpty = (value) => {
    return (value == null || value.length === 0);
}

exports.elasticField = (hit) =>{
    let _id             = hit._id;
    let ref             = hit._source.ref;
    let title           = hit._source.title;
    let name_surname    = _.isEmpty(hit._source.name_surname) ? "" : hit._source.name_surname; 
    let owner_id        = hit._source.owner_id;
    let transfer_amount = _.isEmpty(hit._source.field_transfer_amount) ? "" : hit._source.field_transfer_amount; 
    let detail          = _.isEmpty(hit._source.detail) ? "" : hit._source.detail;
    let nid             = hit._source.nid;
    let id_card_number  = _.isEmpty(hit._source.id_card_number) ? [] : hit._source.id_card_number ;
    let images          = hit._source.images;
    let status          = hit._source.status;
    let app_followers   = _.isEmpty(hit._source.app_followers) ? [] : hit._source.app_followers;
    let created         = hit._source.created;
    let changed         = hit._source.changed;

    return {_id, ref, nid, owner_id, name_surname, title, transfer_amount, detail, id_card_number, images, status, app_followers, created, changed}
}

exports.isExpiry = async(req) =>{
    let sessions_schema = await SessionsSchema.findOne({ "_id": req.sessionID })
    if(_.isEmpty(sessions_schema)){
        return true;
    }
    return false;
}