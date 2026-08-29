// function: extractTokenClaims
function extractTokenClaims(encodedToken, base64Decode) {
  let jswPayload = getJWSPayload(encodedToken);
  try {
    let base64Decoded = base64Decode(jswPayload);
    return JSON.parse(base64Decoded);
  } catch (err) {
    throw createClientAuthError(tokenParsingError);
  }
}
