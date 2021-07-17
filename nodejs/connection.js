const mongoose = require("mongoose");
var config = require("./config")
const connectMongoose = () => {
  return mongoose.connect(config.mongo.url, {
                                        "user": "root",
                                        "pass": "example",
                                        "useMongoClient": true,
                                        useNewUrlParser : true,
                                        useFindAndModify: false, // optional
                                        useCreateIndex  : true,
                                        useUnifiedTopology : true
                                      });
}
module.exports = connectMongoose;