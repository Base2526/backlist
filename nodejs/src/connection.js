const mongoose = require("mongoose");

const User = require("./User.model");

var config = require("./utils/config")

// const connection = "mongodb://mongo:27017/mongo_test";
// const connection = 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/huay?replicaSet=rs0';
/*
mongoose.connect('mongodb://mongo1:27017,mongo2:27018,mongo3:27019/mongo_test', {
  useNewUrlParser : true,
  useFindAndModify: false, // optional
  useCreateIndex  : true,
  replicaSet      : 'rs0', // We use this from the entrypoint in the docker-compose file
})
*/


const connectMongoose = () => {
  // return mongoose.connect(connection);
  console.log('Mongoose version:', mongoose.version);
  // mongoose.set('useUnifiedTopology', true);
  // mongoose.set('useNewUrlParser', true);
  // mongoose.connect(connectionString, { useFindAndModify: false });

  return mongoose.connect(config.mongo.url, {
                                        // useNewUrlParser : true,
                                        useFindAndModify: false, // optional
                                        useCreateIndex  : true,
                                       // useUnifiedTopology : true,
                                        // replicaSet      : 'rs0', // We use this from the entrypoint in the docker-compose file
                                        // dbName: 'mongo_test'
                                      });
};

module.exports = connectMongoose;