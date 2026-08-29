// function: createGetRequest
function createGetRequest(url3) {
  return new HttpRequest({
    protocol: url3.protocol,
    hostname: url3.hostname,
    port: Number(url3.port),
    path: url3.pathname,
    query: Array.from(url3.searchParams.entries()).reduce((acc, [k, v]) => {
      return acc[k] = v, acc;
    }, {}),
    fragment: url3.hash
  });
}
