// Original: src/utils/claudeInChrome/setupPortable.ts
import { readdir as readdir24 } from "fs/promises";
import { join as join124 } from "path";
function getExtensionIds() {
  return [PROD_EXTENSION_ID];
}
async function detectExtensionInstallationPortable(browserPaths, log3) {
  if (browserPaths.length === 0)
    return log3?.("[Claude in Chrome] No browser paths to check"), { isInstalled: !1, browser: null };
  let extensionIds = getExtensionIds();
  for (let { browser, path: browserBasePath } of browserPaths) {
    let browserProfileEntries = [];
    try {
      browserProfileEntries = await readdir24(browserBasePath, {
        withFileTypes: !0
      });
    } catch (e) {
      if (isFsInaccessible(e))
        continue;
      throw e;
    }
    let profileDirs = browserProfileEntries.filter((entry) => entry.isDirectory()).filter((entry) => entry.name === "Default" || entry.name.startsWith("Profile ")).map((entry) => entry.name);
    if (profileDirs.length > 0)
      log3?.(`[Claude in Chrome] Found ${browser} profiles: ${profileDirs.join(", ")}`);
    for (let profile7 of profileDirs)
      for (let extensionId of extensionIds) {
        let extensionPath = join124(browserBasePath, profile7, "Extensions", extensionId);
        try {
          return await readdir24(extensionPath), log3?.(`[Claude in Chrome] Extension ${extensionId} found in ${browser} ${profile7}`), { isInstalled: !0, browser };
        } catch {}
      }
  }
  return log3?.("[Claude in Chrome] Extension not found in any browser"), { isInstalled: !1, browser: null };
}
async function isChromeExtensionInstalledPortable(browserPaths, log3) {
  return (await detectExtensionInstallationPortable(browserPaths, log3)).isInstalled;
}
var PROD_EXTENSION_ID = "fcoeoabgfenejglbffodgkkbkcdhcgfn";
var init_setupPortable = __esm(() => {
  init_errors();
});
