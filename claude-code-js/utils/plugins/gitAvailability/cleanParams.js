// function: cleanParams
function cleanParams(params, data) {
  let p4 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  return typeof p4 === "string" ? { message: p4 } : p4;
}
