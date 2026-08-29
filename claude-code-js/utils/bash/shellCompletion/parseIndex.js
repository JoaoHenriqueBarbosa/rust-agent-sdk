// function: parseIndex
function parseIndex(data, {
  getFn = Config2.getFn,
  fieldNormWeight = Config2.fieldNormWeight
} = {}) {
  let {
    keys: keys3,
    records
  } = data, myIndex = new FuseIndex({
    getFn,
    fieldNormWeight
  });
  return myIndex.setKeys(keys3), myIndex.setIndexRecords(records), myIndex;
}
