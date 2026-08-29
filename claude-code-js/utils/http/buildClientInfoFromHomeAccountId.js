// function: buildClientInfoFromHomeAccountId
function buildClientInfoFromHomeAccountId(homeAccountId) {
  if (!homeAccountId)
    throw createClientAuthError(clientInfoDecodingError);
  let clientInfoParts = homeAccountId.split(CLIENT_INFO_SEPARATOR, 2);
  return {
    uid: clientInfoParts[0],
    utid: clientInfoParts.length < 2 ? "" : clientInfoParts[1]
  };
}
