const crypto = require('crypto');

// exports.method = function() {
//     return "method"
// };

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