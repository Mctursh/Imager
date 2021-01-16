const mongoose = require("mongoose")

//connecting to mongoose server
mongoose.connect("mongodb://localhost:27017/imagerDB", {useNewUrlParser: true, useUnifiedTopology: true});

//definning the scgema forthr public Image collections
const publicImageSchema = new mongoose.Schema({
  collectionName: String,
  name: String,
  assetID: String,
  publicID: String,
  imageUrl: String
});

//exporting the model for use in other part of the project
module.exports = new mongoose.model("Public", publicImageSchema)
