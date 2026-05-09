// Original: src/utils/plugins/pluginVersioning.ts
import { createHash as createHash18 } from "crypto";
async function calculatePluginVersion(pluginId, source, manifest, installPath, providedVersion, gitCommitSha) {
  if (manifest?.version)
    return logForDebugging(`Using manifest version for ${pluginId}: ${manifest.version}`), manifest.version;
  if (providedVersion)
    return logForDebugging(`Using provided version for ${pluginId}: ${providedVersion}`), providedVersion;
  if (gitCommitSha) {
    let shortSha = gitCommitSha.substring(0, 12);
    if (typeof source === "object" && source.source === "git-subdir") {
      let normPath = source.path.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, ""), pathHash = createHash18("sha256").update(normPath).digest("hex").substring(0, 8), v2 = `${shortSha}-${pathHash}`;
      return logForDebugging(`Using git-subdir SHA+path version for ${pluginId}: ${v2} (path=${normPath})`), v2;
    }
    return logForDebugging(`Using pre-resolved git SHA for ${pluginId}: ${shortSha}`), shortSha;
  }
  if (installPath) {
    let sha = await getGitCommitSha2(installPath);
    if (sha) {
      let shortSha = sha.substring(0, 12);
      return logForDebugging(`Using git SHA for ${pluginId}: ${shortSha}`), shortSha;
    }
  }
  return logForDebugging(`No version found for ${pluginId}, using 'unknown'`), "unknown";
}
function getGitCommitSha2(dirPath) {
  return getHeadForDir(dirPath);
}
var init_pluginVersioning = __esm(() => {
  init_debug();
  init_gitFilesystem();
});
