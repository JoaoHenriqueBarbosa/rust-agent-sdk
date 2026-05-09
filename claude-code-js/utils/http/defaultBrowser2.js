// function: defaultBrowser2
async function defaultBrowser2() {
  if (process19.platform === "darwin") {
    let id = await defaultBrowserId();
    return { name: await bundleName(id), id };
  }
  if (process19.platform === "linux") {
    let { stdout } = await execFileAsync5("xdg-mime", ["query", "default", "x-scheme-handler/http"]), id = stdout.trim();
    return { name: titleize(id.replace(/.desktop$/, "").replace("-", " ")), id };
  }
  if (process19.platform === "win32")
    return defaultBrowser();
  throw Error("Only macOS, Linux, and Windows are supported");
}
