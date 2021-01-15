const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/imagerDB", {useNewUrlParser: true, useUnifiedTopology: true});


const privateImageSchema = new mongoose.Schema({
  userGoogleID: String,
  privateImages: {
    collectionName: String,
    name: String,
    description: Array,
    assetID: String,
    publicID: String,
    imageUrl: String
  }
})

module.exports = mongoose.model("Private", privateImageSchema);
