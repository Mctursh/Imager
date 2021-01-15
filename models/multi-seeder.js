const Public = require("./publicimages");


const publicSeed = async (dataArray) => {
  let end = 0;
  const dataToBeStored = []
  const check = dataArray.filter(u => (u.result.error != null)).length
  if (check > 0) {
    return -1
  } else if (check == 0) {
    dataArray.forEach((data) => {
      const picData = {
        collectionName: data.result.name,
        name: data.result.original_filename,
        assetID: data.result.asset_id,
        publicID: data.result.public_id,
        description: [data.result.description1, data.result.description2],
        imageUrl: data.result.secure_url
      }
      dataToBeStored.push(picData);
    })
    await Public.insertMany(dataToBeStored, {ordered: true}).then(() => {
      end++
    }).catch(() => {
      end--
    })
    return end
  }
}

module.exports = publicSeed
