module.exports = (objectParams) => {
  for (let property in objectParams) {
    if (/Id|id/.test(property)) objectParams[property] = Number(objectParams[property])
  }
  return objectParams
}