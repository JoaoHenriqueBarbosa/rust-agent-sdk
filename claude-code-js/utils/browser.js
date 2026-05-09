// Original: src/utils/browser.ts
function validateUrl(url3) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url3);
  } catch (_error) {
    throw Error(`Invalid URL format: ${url3}`);
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:")
    throw Error(`Invalid URL protocol: must use http:// or https://, got ${parsedUrl.protocol}`);
}
async function openPath(path16) {
  try {
    let platform3 = process.platform;
    if (platform3 === "win32") {
      let { code: code2 } = await execFileNoThrow("explorer", [path16]);
      return code2 === 0;
    }
    let command12 = platform3 === "darwin" ? "open" : "xdg-open", { code } = await execFileNoThrow(command12, [path16]);
    return code === 0;
  } catch (_) {
    return !1;
  }
}
async function openBrowser(url3) {
  try {
    validateUrl(url3);
    let browserEnv = process.env.BROWSER, platform3 = process.platform;
    if (platform3 === "win32") {
      if (browserEnv) {
        let { code: code2 } = await execFileNoThrow(browserEnv, [`"${url3}"`]);
        return code2 === 0;
      }
      let { code } = await execFileNoThrow("rundll32", ["url,OpenURL", url3], {});
      return code === 0;
    } else {
      let command12 = browserEnv || (platform3 === "darwin" ? "open" : "xdg-open"), { code } = await execFileNoThrow(command12, [url3]);
      return code === 0;
    }
  } catch (_) {
    return !1;
  }
}
var init_browser = __esm(() => {
  init_execFileNoThrow();
});
