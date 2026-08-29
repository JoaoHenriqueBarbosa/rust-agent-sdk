// function: beginRefresh
async function beginRefresh(getAccessToken, retryIntervalInMs, refreshTimeout) {
  async function tryGetAccessToken() {
    if (Date.now() < refreshTimeout)
      try {
        return await getAccessToken();
      } catch {
        return null;
      }
    else {
      let finalToken = await getAccessToken();
      if (finalToken === null)
        throw Error("Failed to refresh access token.");
      return finalToken;
    }
  }
  let token = await tryGetAccessToken();
  while (token === null)
    await delay2(retryIntervalInMs), token = await tryGetAccessToken();
  return token;
}
