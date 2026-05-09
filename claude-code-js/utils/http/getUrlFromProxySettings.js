// function: getUrlFromProxySettings
function getUrlFromProxySettings(settings) {
  let parsedProxyUrl;
  try {
    parsedProxyUrl = new URL(settings.host);
  } catch {
    throw Error(`Expecting a valid host string in proxy settings, but found "${settings.host}".`);
  }
  if (parsedProxyUrl.port = String(settings.port), settings.username)
    parsedProxyUrl.username = settings.username;
  if (settings.password)
    parsedProxyUrl.password = settings.password;
  return parsedProxyUrl;
}
