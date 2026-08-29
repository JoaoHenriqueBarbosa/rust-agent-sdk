// function: getDeserializedResponse
function getDeserializedResponse(responseString) {
  if (!responseString || responseString.indexOf("=") < 0)
    return null;
  try {
    let normalizedResponse = stripLeadingHashOrQuery(responseString), deserializedHash = Object.fromEntries(new URLSearchParams(normalizedResponse));
    if (deserializedHash.code || deserializedHash.ear_jwe || deserializedHash.error || deserializedHash.error_description || deserializedHash.state)
      return deserializedHash;
  } catch (e) {
    throw createClientAuthError(hashNotDeserialized);
  }
  return null;
}
