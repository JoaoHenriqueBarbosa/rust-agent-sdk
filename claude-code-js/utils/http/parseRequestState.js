// function: parseRequestState
function parseRequestState(base64Decode, state2) {
  if (!base64Decode)
    throw createClientAuthError(noCryptoObject);
  if (!state2)
    throw createClientAuthError(invalidState);
  try {
    let splitState = state2.split(RESOURCE_DELIM), libraryState = splitState[0], userState = splitState.length > 1 ? splitState.slice(1).join(RESOURCE_DELIM) : "", libraryStateString = base64Decode(libraryState), libraryStateObj = JSON.parse(libraryStateString);
    return {
      userRequestState: userState || "",
      libraryState: libraryStateObj
    };
  } catch (e) {
    throw createClientAuthError(invalidState);
  }
}
