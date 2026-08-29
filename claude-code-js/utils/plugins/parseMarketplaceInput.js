// Original: src/utils/plugins/parseMarketplaceInput.ts
import { homedir as homedir31 } from "os";
import { resolve as resolve42 } from "path";
async function parseMarketplaceInput(input) {
  let trimmed = input.trim(), fs17 = getFsImplementation(), sshMatch = trimmed.match(/^([a-zA-Z0-9._-]+@[^:]+:.+?(?:\.git)?)(#(.+))?$/);
  if (sshMatch?.[1]) {
    let url3 = sshMatch[1], ref = sshMatch[3];
    return ref ? { source: "git", url: url3, ref } : { source: "git", url: url3 };
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    let fragmentMatch = trimmed.match(/^([^#]+)(#(.+))?$/), urlWithoutFragment = fragmentMatch?.[1] || trimmed, ref = fragmentMatch?.[3];
    if (urlWithoutFragment.endsWith(".git") || urlWithoutFragment.includes("/_git/"))
      return ref ? { source: "git", url: urlWithoutFragment, ref } : { source: "git", url: urlWithoutFragment };
    let url3;
    try {
      url3 = new URL(urlWithoutFragment);
    } catch (_err) {
      return { source: "url", url: urlWithoutFragment };
    }
    if (url3.hostname === "github.com" || url3.hostname === "www.github.com") {
      if (url3.pathname.match(/^\/([^/]+\/[^/]+?)(\/|\.git|$)/)?.[1]) {
        let gitUrl = urlWithoutFragment.endsWith(".git") ? urlWithoutFragment : `${urlWithoutFragment}.git`;
        return ref ? { source: "git", url: gitUrl, ref } : { source: "git", url: gitUrl };
      }
    }
    return { source: "url", url: urlWithoutFragment };
  }
  let isWindowsPath = process.platform === "win32" && (trimmed.startsWith(".\\") || trimmed.startsWith("..\\") || /^[a-zA-Z]:[/\\]/.test(trimmed));
  if (trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("/") || trimmed.startsWith("~") || isWindowsPath) {
    let resolvedPath5 = resolve42(trimmed.startsWith("~") ? trimmed.replace(/^~/, homedir31()) : trimmed), stats;
    try {
      stats = await fs17.stat(resolvedPath5);
    } catch (e) {
      let code = getErrnoCode(e);
      return {
        error: code === "ENOENT" ? `Path does not exist: ${resolvedPath5}` : `Cannot access path: ${resolvedPath5} (${code ?? e})`
      };
    }
    if (stats.isFile())
      if (resolvedPath5.endsWith(".json"))
        return { source: "file", path: resolvedPath5 };
      else
        return {
          error: `File path must point to a .json file (marketplace.json), but got: ${resolvedPath5}`
        };
    else if (stats.isDirectory())
      return { source: "directory", path: resolvedPath5 };
    else
      return {
        error: `Path is neither a file nor a directory: ${resolvedPath5}`
      };
  }
  if (trimmed.includes("/") && !trimmed.startsWith("@")) {
    if (trimmed.includes(":"))
      return null;
    let fragmentMatch = trimmed.match(/^([^#@]+)(?:[#@](.+))?$/), repo = fragmentMatch?.[1] || trimmed, ref = fragmentMatch?.[2];
    return ref ? { source: "github", repo, ref } : { source: "github", repo };
  }
  return null;
}
var init_parseMarketplaceInput = __esm(() => {
  init_errors();
  init_fsOperations();
});
