const Public = require("./publicimages");

//helper that adds data single into the Publib DB
const publicSingle = async (data) => {
  let end = 0;

  //checks to see if the data failed to upload to cloudinary
  const check = data.filter(u => (u.result.error != null)).length

  //runs if the data failed to upload
  if (check > 0) {
    return -1

    //runs if no data failed
  } else if (check == 0) {
    const picData = {
      collectionName: data[0].result.name,
      name: data[0].result.original_filename,
      assetID: data[0].result.asset_id,
      publicID: data[0].result.public_id,
      imageUrl: data[0].result.secure_url
    }

    //async for adding data into DB
    await Public.create(picData).then(function() {
      end++
    }).catch(function() {
      end--
    })
    return end
  }
}

module.exports = publicSingle
