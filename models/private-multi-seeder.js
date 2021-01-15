const Private = require("./privateimages")

const privateSeed = async (dataArray) => {
  let end = 0;
  const dataToBeStored = []
  const check = dataArray.filter(u => (u.result.error != null)).length
  if (check > 0) {
    return -1
  } else if (check == 0) {
    dataArray.forEach((data) => {
      const picData = {
        userGoogleID: data.result.googleID,
        privateImages: {
          collectionName: data.result.name,
          name: data.result.original_filename,
          assetID: data.result.asset_id,
          publicID: data.result.public_id,
          description: [data.result.description1, data.result.description2],
          imageUrl: data.result.secure_url
        }
      }
      dataToBeStored.push(picData);
    })

    await Private.insertMany(dataToBeStored, {ordered: true}).then(() => {
      end++
    }).catch(() => {
      end--
    })
    return end
  }



  return end
}

module.exports = privateSeed
