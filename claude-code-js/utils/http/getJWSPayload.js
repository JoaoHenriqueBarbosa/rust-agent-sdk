// function: getJWSPayload
function getJWSPayload(authToken) {
  if (!authToken)
    throw createClientAuthError(nullOrEmptyToken);
  let matches = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(authToken);
  if (!matches || matches.length < 4)
    throw createClientAuthError(tokenParsingError);
  return matches[2];
}
