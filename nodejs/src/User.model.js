const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

// db.collection('Person').watch().
//     on('change', data => console.log(new Date(), data));

module.exports = User;