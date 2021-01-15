const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/imagerDB", {useNewUrlParser: true, useUnifiedTopology: true});

const publicImageSchema = new mongoose.Schema({
  collectionName: String,
  name: String,
  description: Array,
  assetID: String,
  publicID: String,
  imageUrl: String
});

module.exports = new mongoose.model("Public", publicImageSchema)
