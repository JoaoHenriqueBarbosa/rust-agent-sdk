// var: retry
var retry = (toRetry, maxRetries) => {
  let promise2 = toRetry();
  for (let i2 = 0;i2 < maxRetries; i2++)
    promise2 = promise2.catch(toRetry);
  return promise2;
};
