// function: createFetchWithInit
function createFetchWithInit(baseFetch = fetch, baseInit) {
  if (!baseInit)
    return baseFetch;
  return async (url3, init2) => {
    let mergedInit = {
      ...baseInit,
      ...init2,
      headers: init2?.headers ? { ...normalizeHeaders(baseInit.headers), ...normalizeHeaders(init2.headers) } : baseInit.headers
    };
    return baseFetch(url3, mergedInit);
  };
}
