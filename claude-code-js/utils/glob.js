// Original: src/utils/glob.ts
import { basename as basename23, dirname as dirname37, isAbsolute as isAbsolute22, join as join84, sep as sep19 } from "path";
function extractGlobBaseDirectory(pattern) {
  let globChars = /[*?[{]/, match = pattern.match(globChars);
  if (!match || match.index === void 0) {
    let dir = dirname37(pattern), file2 = basename23(pattern);
    return { baseDir: dir, relativePattern: file2 };
  }
  let staticPrefix = pattern.slice(0, match.index), lastSepIndex = Math.max(staticPrefix.lastIndexOf("/"), staticPrefix.lastIndexOf(sep19));
  if (lastSepIndex === -1)
    return { baseDir: "", relativePattern: pattern };
  let baseDir = staticPrefix.slice(0, lastSepIndex), relativePattern = pattern.slice(lastSepIndex + 1);
  if (baseDir === "" && lastSepIndex === 0)
    baseDir = "/";
  if (getPlatform() === "windows" && /^[A-Za-z]:$/.test(baseDir))
    baseDir = baseDir + sep19;
  return { baseDir, relativePattern };
}
async function glob(filePattern, cwd2, { limit, offset }, abortSignal, toolPermissionContext) {
  let searchDir = cwd2, searchPattern = filePattern;
  if (isAbsolute22(filePattern)) {
    let { baseDir, relativePattern } = extractGlobBaseDirectory(filePattern);
    if (baseDir)
      searchDir = baseDir, searchPattern = relativePattern;
  }
  let ignorePatterns = normalizePatternsToPath(getFileReadIgnorePatterns(toolPermissionContext), searchDir), noIgnore = isEnvTruthy(process.env.CLAUDE_CODE_GLOB_NO_IGNORE || "true"), hidden2 = isEnvTruthy(process.env.CLAUDE_CODE_GLOB_HIDDEN || "true"), args = [
    "--files",
    "--glob",
    searchPattern,
    "--sort=modified",
    ...noIgnore ? ["--no-ignore"] : [],
    ...hidden2 ? ["--hidden"] : []
  ];
  for (let pattern of ignorePatterns)
    args.push("--glob", `!${pattern}`);
  for (let exclusion of await getGlobExclusionsForPluginCache(searchDir))
    args.push("--glob", exclusion);
  let absolutePaths = (await ripGrep(args, searchDir, abortSignal)).map((p4) => isAbsolute22(p4) ? p4 : join84(searchDir, p4)), truncated = absolutePaths.length > offset + limit;
  return { files: absolutePaths.slice(offset, offset + limit), truncated };
}
var init_glob = __esm(() => {
  init_envUtils();
  init_filesystem();
  init_platform();
  init_orphanedPluginFilter();
  init_ripgrep();
});
