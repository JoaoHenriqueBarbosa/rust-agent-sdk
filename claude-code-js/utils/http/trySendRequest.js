// function: trySendRequest
async function trySendRequest(request2, next) {
  try {
    return [await next(request2), void 0];
  } catch (e) {
    if (isRestError2(e) && e.response)
      return [e.response, e];
    else
      throw e;
  }
}
