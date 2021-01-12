const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/imagerDB", {useNewUrlParser: true, useUnifiedTopology: true});

const publicImageSchema = new mongoose.Schema({
  picture: [{
    name: String,
    description: String,
    imageUrl: String
  }]
});

module.exports = new mongoose.model("Public", publicImageSchema)
