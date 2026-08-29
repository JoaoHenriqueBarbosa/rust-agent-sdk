// function: proxyAuthHeader
function proxyAuthHeader(proxyUrl) {
  if (!proxyUrl.username && !proxyUrl.password)
    return;
  try {
    let creds = `${decodeURIComponent(proxyUrl.username)}:${decodeURIComponent(proxyUrl.password)}`;
    return `Basic ${Buffer.from(creds).toString("base64")}`;
  } catch {
    let creds = `${proxyUrl.username}:${proxyUrl.password}`;
    return `Basic ${Buffer.from(creds).toString("base64")}`;
  }
}
