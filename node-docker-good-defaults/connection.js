// const mongoose = require("mongoose");
// var config = require("./config")
// const connectMongoose = () => {
//   return mongoose.connect(config.mongo.url, {
//                                         useNewUrlParser : true,
//                                         useFindAndModify: false, // optional
//                                         useCreateIndex  : true,
//                                         useUnifiedTopology : true
//                                       });
// }
// module.exports = connectMongoose;

const mongoose = require('mongoose');
mongoose.connect('mongodb://root:example@mongo:27017/bl?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true});

const dboose = mongoose.connection;
dboose.on('error', console.error.bind(console, 'connection error:'));
dboose.once('open', async function() {
  // we're connected!
  console.log('Connected successfully to database!')

  // const silence = new kittySchema({ name: 'Silence' });
  // console.log(`silence ${silence}`)

  // await new kittySchema({ name: 'Silence' }).save()
});

module.exports = dboose;