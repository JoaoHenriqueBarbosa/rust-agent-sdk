// function: getBodyLength
function getBodyLength(body) {
  if (!body)
    return 0;
  else if (Buffer.isBuffer(body))
    return body.length;
  else if (isReadableStream4(body))
    return null;
  else if (isArrayBuffer8(body))
    return body.byteLength;
  else if (typeof body === "string")
    return Buffer.from(body).length;
  else
    return null;
}
