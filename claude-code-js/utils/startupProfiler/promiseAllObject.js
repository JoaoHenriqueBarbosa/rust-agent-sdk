// function: promiseAllObject
function promiseAllObject(promisesObj) {
  let keys2 = Object.keys(promisesObj), promises = keys2.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    let resolvedObj = {};
    for (let i = 0;i < keys2.length; i++)
      resolvedObj[keys2[i]] = results[i];
    return resolvedObj;
  });
}
