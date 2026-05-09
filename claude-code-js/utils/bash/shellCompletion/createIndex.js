// function: createIndex
function createIndex(keys3, docs, {
  getFn = Config2.getFn,
  fieldNormWeight = Config2.fieldNormWeight
} = {}) {
  let myIndex = new FuseIndex({
    getFn,
    fieldNormWeight
  });
  return myIndex.setKeys(keys3.map(createKey)), myIndex.setSources(docs), myIndex.create(), myIndex;
}
