var config = {};
config.mongo = {};

// mongo  admin:password@
// config.mongo.url = 'mongodb://mongo:U29ta2lkMDU4ODQ4Mzkx@mongo:27017/banlist';
// config.mongo.url = "mongodb://mongo:27099/bl";

/*
let MONGO_USERNAME = 'root';
let MONGO_PASSWORD = 'example';
let MONGO_HOSTNAME = 'mongo';
let MONGO_PORT = '27017';
let MONGO_DATABASE_NAME = 'bl';

// Connection URL
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;
*/

// config.mongo.url = "mongodb://root:example@mongo:27017/bl";

config.mongo.url = "mongodb://root:example@mongo:27017/bl";

/*
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=example
*/ 

module.exports = config;