// function: redactSensitiveUrlParams
function redactSensitiveUrlParams(url3) {
  try {
    let parsedUrl = new URL(url3);
    for (let param of SENSITIVE_OAUTH_PARAMS)
      if (parsedUrl.searchParams.has(param))
        parsedUrl.searchParams.set(param, "[REDACTED]");
    return parsedUrl.toString();
  } catch {
    return url3;
  }
}
