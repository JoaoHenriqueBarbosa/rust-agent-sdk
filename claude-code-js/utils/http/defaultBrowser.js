// function: defaultBrowser
async function defaultBrowser(_execFileAsync = execFileAsync4) {
  let { stdout } = await _execFileAsync("reg", [
    "QUERY",
    " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
    "/v",
    "ProgId"
  ]), match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(stdout);
  if (!match)
    throw new UnknownBrowserError(`Cannot find Windows browser in stdout: ${JSON.stringify(stdout)}`);
  let { id } = match.groups, dotIndex = id.lastIndexOf("."), hyphenIndex = id.lastIndexOf("-"), baseIdByDot = dotIndex === -1 ? void 0 : id.slice(0, dotIndex), baseIdByHyphen = hyphenIndex === -1 ? void 0 : id.slice(0, hyphenIndex);
  return windowsBrowserProgIds[id] ?? windowsBrowserProgIds[baseIdByDot] ?? windowsBrowserProgIds[baseIdByHyphen] ?? { name: id, id };
}
