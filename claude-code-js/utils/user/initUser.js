// function: initUser
async function initUser() {
  if (cachedEmail === null && !emailFetchPromise)
    emailFetchPromise = getEmailAsync(), cachedEmail = await emailFetchPromise, emailFetchPromise = null, getCoreUserData.cache.clear?.();
}
