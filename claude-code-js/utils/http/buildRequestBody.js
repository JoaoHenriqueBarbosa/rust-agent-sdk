// function: buildRequestBody
async function buildRequestBody(request2, parts, boundary) {
  let sources = [
    stringToUint8Array2(`--${boundary}`, "utf-8"),
    ...parts.flatMap((part) => [
      stringToUint8Array2(`\r
`, "utf-8"),
      stringToUint8Array2(encodeHeaders(part.headers), "utf-8"),
      stringToUint8Array2(`\r
`, "utf-8"),
      part.body,
      stringToUint8Array2(`\r
--${boundary}`, "utf-8")
    ]),
    stringToUint8Array2(`--\r
\r
`, "utf-8")
  ], contentLength = getTotalLength(sources);
  if (contentLength)
    request2.headers.set("Content-Length", contentLength);
  request2.body = await concat(sources);
}
