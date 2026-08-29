// function: handleRedirect
async function handleRedirect(next, response7, maxRetries, allowCrossOriginRedirects, currentRetries = 0) {
  let { request: request2, status, headers } = response7, locationHeader = headers.get("location");
  if (locationHeader && (status === 300 || status === 301 && allowedRedirect.includes(request2.method) || status === 302 && allowedRedirect.includes(request2.method) || status === 303 && request2.method === "POST" || status === 307) && currentRetries < maxRetries) {
    let url3 = new URL(locationHeader, request2.url);
    if (!allowCrossOriginRedirects) {
      let originalUrl = new URL(request2.url);
      if (url3.origin !== originalUrl.origin)
        return logger11.verbose(`Skipping cross-origin redirect from ${originalUrl.origin} to ${url3.origin}.`), response7;
    }
    if (request2.url = url3.toString(), status === 303)
      request2.method = "GET", request2.headers.delete("Content-Length"), delete request2.body;
    request2.headers.delete("Authorization");
    let res = await next(request2);
    return handleRedirect(next, res, maxRetries, allowCrossOriginRedirects, currentRetries + 1);
  }
  return response7;
}
