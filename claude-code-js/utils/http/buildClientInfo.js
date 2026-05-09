// function: buildClientInfo
function buildClientInfo(rawClientInfo, base64Decode) {
  if (!rawClientInfo)
    throw createClientAuthError(clientInfoEmptyError);
  try {
    let decodedClientInfo = base64Decode(rawClientInfo);
    return JSON.parse(decodedClientInfo);
  } catch (e) {
    throw createClientAuthError(clientInfoDecodingError);
  }
}
