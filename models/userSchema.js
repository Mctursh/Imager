const mongoose = require("mongoose")

//connecting to mongoose server
mongoose.connect("mongodb+srv://admin-ayoade:" + process.env.MONGO_CLUSTER_PASSWORD + "@cluster0.4d1r2.mongodb.net/" + process.env.MONGO_CLUSTER_DB_NAME + "?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

//definning the scgema forthr user collections
const userSchema = new mongoose.Schema({
  name: String,
  googleID: String,
  profilePic: String,
})

//exporting the model for use in other part of the project
module.exports = mongoose.model("User", userSchema)
