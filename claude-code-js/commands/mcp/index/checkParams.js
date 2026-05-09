// function: checkParams
function checkParams(text2, opts, cb) {
  if (typeof text2 > "u")
    throw Error("String required as first argument");
  if (typeof cb > "u")
    cb = opts, opts = {};
  if (typeof cb !== "function")
    if (!canPromise())
      throw Error("Callback required as last argument");
    else
      opts = cb || {}, cb = null;
  return {
    opts,
    cb
  };
}
