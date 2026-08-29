// function: resourceUrlFromServerUrl
function resourceUrlFromServerUrl(url3) {
  let resourceURL = typeof url3 === "string" ? new URL(url3) : new URL(url3.href);
  return resourceURL.hash = "", resourceURL;
}
