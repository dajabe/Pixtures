function objectify(arrArr, keys) {
  return arrArr.map((arr) => {
    let obj = {}
    keys.map((key, i) => {
      obj[key] = arr[i]
    })
    return obj
  })
}

module.exports = objectify
