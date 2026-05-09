// var: getPayloadHash
var getPayloadHash = async ({ headers, body }, hashConstructor) => {
  for (let headerName of Object.keys(headers))
    if (headerName.toLowerCase() === SHA256_HEADER)
      return headers[headerName];
  if (body == null)
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer7(body)) {
    let hashCtor = new hashConstructor;
    return hashCtor.update(toUint8Array2(body)), toHex2(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
};
