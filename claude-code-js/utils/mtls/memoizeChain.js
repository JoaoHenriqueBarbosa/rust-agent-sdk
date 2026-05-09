// function: memoizeChain
function memoizeChain(providers, treatAsExpired) {
  let chain2 = internalCreateChain(providers), activeLock, passiveLock, credentials, provider = async (options) => {
    if (options?.forceRefresh)
      return await chain2(options);
    if (credentials?.expiration) {
      if (credentials?.expiration?.getTime() < Date.now())
        credentials = void 0;
    }
    if (activeLock)
      await activeLock;
    else if (!credentials || treatAsExpired?.(credentials))
      if (credentials) {
        if (!passiveLock)
          passiveLock = chain2(options).then((c3) => {
            credentials = c3;
          }).finally(() => {
            passiveLock = void 0;
          });
      } else
        return activeLock = chain2(options).then((c3) => {
          credentials = c3;
        }).finally(() => {
          activeLock = void 0;
        }), provider(options);
    return credentials;
  };
  return provider;
}
