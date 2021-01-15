const Private = require("./privateimages");


const privateSingle = async (data) => {
  let end = 0;
  const check = data.filter(u => (u.result.error != null)).length
  if (check > 0) {
    return -1
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
    await Private.create(picData).then(() => {
      end++
    }).catch(() => {
      end--
    })
    return end
  }
}
module.exports = privateSingle
