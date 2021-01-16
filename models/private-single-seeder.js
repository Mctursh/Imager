const Private = require("./privateimages");

//helper that adds data into the Private DB
const privateSingle = async (data) => {
  let end = 0;

  //checks to see if the data failed to upload to cloudinary
  const check = data.filter(u => (u.result.error != null)).length

  ///runs if the data failed to upload
  if (check > 0) {
    return -1

    //runs if no data failed
  } else if (check == 0) {
    const picData = {
      userGoogleID: data[0].result.googleID,
      privateImages: {
        collectionName: data[0].result.name,
        name: data[0].result.original_filename,
        assetID: data[0].result.asset_id,
        publicID: data[0].result.public_id,
        description: [data[0].result.description1, data[0].result.description2],
        imageUrl: data[0].result.secure_url
      }
    }

    //async for adding data into DB
    await Private.create(picData).then(() => {
      end++
    }).catch(() => {
      end--
    })
    return end
  }
}
module.exports = privateSingle
