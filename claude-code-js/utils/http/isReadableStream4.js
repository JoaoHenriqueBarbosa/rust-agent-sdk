// function: isReadableStream4
function isReadableStream4(body) {
  return body && typeof body.pipe === "function";
}
