// function: parseExpirationTimestamp
function parseExpirationTimestamp(body) {
  if (typeof body.expires_on === "number")
    return body.expires_on * 1000;
  if (typeof body.expires_on === "string") {
    let asNumber = +body.expires_on;
    if (!isNaN(asNumber))
      return asNumber * 1000;
    let asDate = Date.parse(body.expires_on);
    if (!isNaN(asDate))
      return asDate;
  }
  if (typeof body.expires_in === "number")
    return Date.now() + body.expires_in * 1000;
  throw Error(`Failed to parse token expiration from body. expires_in="${body.expires_in}", expires_on="${body.expires_on}"`);
}
