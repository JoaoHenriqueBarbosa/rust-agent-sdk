// function: resolveParentProxy
function resolveParentProxy(cfg) {
  let http4 = cfg?.http ?? process.env.HTTP_PROXY ?? process.env.http_proxy ?? void 0, https3 = cfg?.https ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? http4, noProxyRaw = cfg?.noProxy ?? process.env.NO_PROXY ?? process.env.no_proxy ?? "";
  if (!http4 && !https3)
    return;
  let parse10 = (u5) => {
    if (!u5)
      return;
    let withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(u5) ? u5 : `http://${u5}`;
    try {
      let parsed = new URL2(withScheme);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:" || !parsed.hostname)
        throw Error("unsupported scheme or empty host");
      return parsed;
    } catch {
      logForDebugging2(`Invalid parent proxy URL, ignoring: ${redactUserinfo(u5)}`, { level: "error" });
      return;
    }
  }, httpUrl = parse10(http4), httpsUrl = parse10(https3);
  if (!httpUrl && !httpsUrl)
    return;
  return { httpUrl, httpsUrl, noProxy: parseNoProxy(noProxyRaw) };
}
