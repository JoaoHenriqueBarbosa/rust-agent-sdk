// function: getDecodedResponseStream
function getDecodedResponseStream(stream10, headers) {
  let contentEncoding = headers.get("Content-Encoding");
  if (contentEncoding === "gzip") {
    let unzip = zlib2.createGunzip();
    return stream10.pipe(unzip), unzip;
  } else if (contentEncoding === "deflate") {
    let inflate = zlib2.createInflate();
    return stream10.pipe(inflate), inflate;
  }
  return stream10;
}
