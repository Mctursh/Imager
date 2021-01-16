const mongoose = require("mongoose")

//connecting to mongoose server
mongoose.connect("mongodb://localhost:27017/imagerDB", {useNewUrlParser: true, useUnifiedTopology: true});

//definning the scgema forthr user collections
const userSchema = new mongoose.Schema({
  name: String,
  googleID: String,
  profilePic: String,
})

//exporting the model for use in other part of the project
module.exports = mongoose.model("User", userSchema)
