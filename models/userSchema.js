const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/imagerDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  name: String,
  googleId: String,
  profilePic: String
})

module.exports = mongoose.model("User", userSchema)
