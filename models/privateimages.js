const mongoose = require("mongoose")

//connecting to mongoose server
mongoose.connect("mongodb+srv://admin-ayoade:" + process.env.MONGO_CLUSTER_PASSWORD + "@cluster0.4d1r2.mongodb.net/" + process.env.MONGO_CLUSTER_DB_NAME + "?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});


//definning the scgema forthr Private Image collections
const privateImageSchema = new mongoose.Schema({
  userGoogleID: String,
  privateImages: {
    collectionName: String,
    name: String,
    assetID: String,
    publicID: String,
    imageUrl: String
  }
})

//exporting the model for use in other part of the project
module.exports = mongoose.model("Private", privateImageSchema);
