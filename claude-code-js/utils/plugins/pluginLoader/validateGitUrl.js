// function: validateGitUrl
function validateGitUrl(url3) {
  try {
    let parsed = new URL(url3);
    if (!["https:", "http:", "file:"].includes(parsed.protocol)) {
      if (!/^git@[a-zA-Z0-9.-]+:/.test(url3))
        throw Error(`Invalid git URL protocol: ${parsed.protocol}. Only HTTPS, HTTP, file:// and SSH (git@) URLs are supported.`);
    }
    return url3;
  } catch {
    if (/^git@[a-zA-Z0-9.-]+:/.test(url3))
      return url3;
    throw Error(`Invalid git URL: ${url3}`);
  }
}
