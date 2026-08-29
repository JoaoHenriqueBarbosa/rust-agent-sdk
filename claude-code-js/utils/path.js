// Original: src/utils/path.ts
import { homedir as homedir4 } from "os";
import { dirname as dirname6, isAbsolute as isAbsolute2, join as join8, normalize, relative, resolve as resolve3 } from "path";
function expandPath(path9, baseDir) {
  let actualBaseDir = baseDir ?? getCwd() ?? getFsImplementation().cwd();
  if (typeof path9 !== "string")
    throw TypeError(`Path must be a string, received ${typeof path9}`);
  if (typeof actualBaseDir !== "string")
    throw TypeError(`Base directory must be a string, received ${typeof actualBaseDir}`);
  if (path9.includes("\x00") || actualBaseDir.includes("\x00"))
    throw Error("Path contains null bytes");
  let trimmedPath = path9.trim();
  if (!trimmedPath)
    return normalize(actualBaseDir).normalize("NFC");
  if (trimmedPath === "~")
    return homedir4().normalize("NFC");
  if (trimmedPath.startsWith("~/"))
    return join8(homedir4(), trimmedPath.slice(2)).normalize("NFC");
  let processedPath = trimmedPath;
  if (getPlatform() === "windows" && trimmedPath.match(/^\/[a-z]\//i))
    try {
      processedPath = posixPathToWindowsPath(trimmedPath);
    } catch {
      processedPath = trimmedPath;
    }
  if (isAbsolute2(processedPath))
    return normalize(processedPath).normalize("NFC");
  return resolve3(actualBaseDir, processedPath).normalize("NFC");
}
function toRelativePath(absolutePath) {
  let relativePath = relative(getCwd(), absolutePath);
  return relativePath.startsWith("..") ? absolutePath : relativePath;
}
function getDirectoryForPath(path9) {
  let absolutePath = expandPath(path9);
  if (absolutePath.startsWith("\\\\") || absolutePath.startsWith("//"))
    return dirname6(absolutePath);
  try {
    if (getFsImplementation().statSync(absolutePath).isDirectory())
      return absolutePath;
  } catch {}
  return dirname6(absolutePath);
}
function containsPathTraversal(path9) {
  return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(path9);
}
function normalizePathForConfigKey(path9) {
  return normalize(path9).replace(/\\/g, "/");
}
var init_path2 = __esm(() => {
  init_cwd2();
  init_fsOperations();
  init_platform();
  init_windowsPaths();
  init_sessionStoragePortable();
});
