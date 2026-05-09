// function: handleNullableResponseAndWrappableBody
function handleNullableResponseAndWrappableBody(responseObject) {
  let combinedHeadersAndBody = {
    ...responseObject.headers,
    ...responseObject.body
  };
  if (responseObject.hasNullableType && Object.getOwnPropertyNames(combinedHeadersAndBody).length === 0)
    return responseObject.shouldWrapBody ? { body: null } : null;
  else
    return responseObject.shouldWrapBody ? {
      ...responseObject.headers,
      body: responseObject.body
    } : combinedHeadersAndBody;
}
