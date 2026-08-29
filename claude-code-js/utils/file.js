// Original: src/utils/file.ts
import { chmodSync, writeFileSync as fsWriteFileSync2 } from "fs";
import { realpath as realpath2, stat as stat2 } from "fs/promises";
import { homedir as homedir5 } from "os";
import {
  basename as basename2,
  dirname as dirname7,
  extname,
  isAbsolute as isAbsolute3,
  join as join9,
  normalize as normalize2,
  relative as relative2,
  resolve as resolve4,
  sep as sep2
} from "path";
async function pathExists(path9) {
  try {
    return await stat2(path9), !0;
  } catch {
    return !1;
  }
}
function readFileSafe(filepath) {
  try {
    return getFsImplementation().readFileSync(filepath, { encoding: "utf8" });
  } catch (error41) {
    return logError2(error41), null;
  }
}
function getFileModificationTime(filePath) {
  let fs2 = getFsImplementation();
  return Math.floor(fs2.statSync(filePath).mtimeMs);
}
async function getFileModificationTimeAsync(filePath) {
  let s = await getFsImplementation().stat(filePath);
  return Math.floor(s.mtimeMs);
}
function writeTextContent(filePath, content, encoding, endings) {
  let toWrite = content;
  if (endings === "CRLF")
    toWrite = content.replaceAll(`\r
`, `
`).split(`
`).join(`\r
`);
  writeFileSyncAndFlush_DEPRECATED(filePath, toWrite, { encoding });
}
function detectFileEncoding(filePath) {
  try {
    let fs2 = getFsImplementation(), { resolvedPath } = safeResolvePath(fs2, filePath);
    return detectEncodingForResolvedPath(resolvedPath);
  } catch (error41) {
    if (isFsInaccessible(error41))
      logForDebugging(`detectFileEncoding failed for expected reason: ${error41.code}`, {
        level: "debug"
      });
    else
      logError2(error41);
    return "utf8";
  }
}
function detectLineEndings(filePath, encoding = "utf8") {
  try {
    let fs2 = getFsImplementation(), { resolvedPath } = safeResolvePath(fs2, filePath), { buffer, bytesRead } = fs2.readSync(resolvedPath, { length: 4096 }), content = buffer.toString(encoding, 0, bytesRead);
    return detectLineEndingsForString(content);
  } catch (error41) {
    return logError2(error41), "LF";
  }
}
function convertLeadingTabsToSpaces(content) {
  if (!content.includes("\t"))
    return content;
  return content.replace(/^\t+/gm, (_) => "  ".repeat(_.length));
}
function getAbsoluteAndRelativePaths(path9) {
  let absolutePath = path9 ? expandPath(path9) : void 0, relativePath = absolutePath ? relative2(getCwd(), absolutePath) : void 0;
  return { absolutePath, relativePath };
}
function getDisplayPath(filePath) {
  let { relativePath } = getAbsoluteAndRelativePaths(filePath);
  if (relativePath && !relativePath.startsWith(".."))
    return relativePath;
  let homeDir = homedir5();
  if (filePath.startsWith(homeDir + sep2))
    return "~" + filePath.slice(homeDir.length);
  return filePath;
}
function findSimilarFile(filePath) {
  let fs2 = getFsImplementation();
  try {
    let dir = dirname7(filePath), fileBaseName = basename2(filePath, extname(filePath)), firstMatch = fs2.readdirSync(dir).filter((file2) => basename2(file2.name, extname(file2.name)) === fileBaseName && join9(dir, file2.name) !== filePath)[0];
    if (firstMatch)
      return firstMatch.name;
    return;
  } catch (error41) {
    if (!isENOENT(error41))
      logError2(error41);
    return;
  }
}
async function suggestPathUnderCwd(requestedPath) {
  let cwd2 = getCwd(), cwdParent = dirname7(cwd2), resolvedPath = requestedPath;
  try {
    let resolvedDir = await realpath2(dirname7(requestedPath));
    resolvedPath = join9(resolvedDir, basename2(requestedPath));
  } catch {}
  let cwdParentPrefix = cwdParent === sep2 ? sep2 : cwdParent + sep2;
  if (!resolvedPath.startsWith(cwdParentPrefix) || resolvedPath.startsWith(cwd2 + sep2) || resolvedPath === cwd2)
    return;
  let relFromParent = relative2(cwdParent, resolvedPath), correctedPath = join9(cwd2, relFromParent);
  try {
    return await stat2(correctedPath), correctedPath;
  } catch {
    return;
  }
}
function isCompactLinePrefixEnabled() {
  return !0;
}
function addLineNumbers({
  content,
  startLine
}) {
  if (!content)
    return "";
  let lines = content.split(/\r?\n/);
  if (isCompactLinePrefixEnabled())
    return lines.map((line, index) => `${index + startLine}	${line}`).join(`
`);
  return lines.map((line, index) => {
    let numStr = String(index + startLine);
    if (numStr.length >= 6)
      return `${numStr}\u2192${line}`;
    return `${numStr.padStart(6, " ")}\u2192${line}`;
  }).join(`
`);
}
function stripLineNumberPrefix(line) {
  return line.match(/^\s*\d+[\u2192\t](.*)$/)?.[1] ?? line;
}
function isDirEmpty(dirPath) {
  try {
    return getFsImplementation().isDirEmptySync(dirPath);
  } catch (e) {
    return isENOENT(e);
  }
}
function readFileSyncCached(filePath) {
  let { content } = fileReadCache.readFile(filePath);
  return content;
}
function writeFileSyncAndFlush_DEPRECATED(filePath, content, options = { encoding: "utf-8" }) {
  let fs2 = getFsImplementation(), targetPath = filePath;
  try {
    let linkTarget = fs2.readlinkSync(filePath);
    targetPath = isAbsolute3(linkTarget) ? linkTarget : resolve4(dirname7(filePath), linkTarget), logForDebugging(`Writing through symlink: ${filePath} -> ${targetPath}`);
  } catch {}
  let tempPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`, targetMode, targetExists = !1;
  try {
    targetMode = fs2.statSync(targetPath).mode, targetExists = !0, logForDebugging(`Preserving file permissions: ${targetMode.toString(8)}`);
  } catch (e) {
    if (!isENOENT(e))
      throw e;
    if (options.mode !== void 0)
      targetMode = options.mode, logForDebugging(`Setting permissions for new file: ${targetMode.toString(8)}`);
  }
  try {
    logForDebugging(`Writing to temp file: ${tempPath}`);
    let writeOptions = {
      encoding: options.encoding,
      flush: !0
    };
    if (!targetExists && options.mode !== void 0)
      writeOptions.mode = options.mode;
    if (fsWriteFileSync2(tempPath, content, writeOptions), logForDebugging(`Temp file written successfully, size: ${content.length} bytes`), targetExists && targetMode !== void 0)
      chmodSync(tempPath, targetMode), logForDebugging("Applied original permissions to temp file");
    logForDebugging(`Renaming ${tempPath} to ${targetPath}`), fs2.renameSync(tempPath, targetPath), logForDebugging(`File ${targetPath} written atomically`);
  } catch (atomicError) {
    logForDebugging(`Failed to write file atomically: ${atomicError}`, {
      level: "error"
    }), logEvent("tengu_atomic_write_error", {});
    try {
      logForDebugging(`Cleaning up temp file: ${tempPath}`), fs2.unlinkSync(tempPath);
    } catch (cleanupError) {
      logForDebugging(`Failed to clean up temp file: ${cleanupError}`);
    }
    logForDebugging(`Falling back to non-atomic write for ${targetPath}`);
    try {
      let fallbackOptions = {
        encoding: options.encoding,
        flush: !0
      };
      if (!targetExists && options.mode !== void 0)
        fallbackOptions.mode = options.mode;
      fsWriteFileSync2(targetPath, content, fallbackOptions), logForDebugging(`File ${targetPath} written successfully with non-atomic fallback`);
    } catch (fallbackError) {
      throw logForDebugging(`Non-atomic write also failed: ${fallbackError}`), fallbackError;
    }
  }
}
function getDesktopPath() {
  let platform2 = getPlatform(), homeDir = homedir5();
  if (platform2 === "macos")
    return join9(homeDir, "Desktop");
  if (platform2 === "windows") {
    let windowsHome = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
    if (windowsHome) {
      let desktopPath2 = `/mnt/c${windowsHome.replace(/^[A-Z]:/, "")}/Desktop`;
      if (getFsImplementation().existsSync(desktopPath2))
        return desktopPath2;
    }
    try {
      let userDirs = getFsImplementation().readdirSync("/mnt/c/Users");
      for (let user of userDirs) {
        if (user.name === "Public" || user.name === "Default" || user.name === "Default User" || user.name === "All Users")
          continue;
        let potentialDesktopPath = join9("/mnt/c/Users", user.name, "Desktop");
        if (getFsImplementation().existsSync(potentialDesktopPath))
          return potentialDesktopPath;
      }
    } catch (error41) {
      logError2(error41);
    }
  }
  let desktopPath = join9(homeDir, "Desktop");
  if (getFsImplementation().existsSync(desktopPath))
    return desktopPath;
  return homeDir;
}
function isFileWithinReadSizeLimit(filePath, maxSizeBytes = MAX_OUTPUT_SIZE) {
  try {
    return getFsImplementation().statSync(filePath).size <= maxSizeBytes;
  } catch {
    return !1;
  }
}
function normalizePathForComparison(filePath) {
  let normalized = normalize2(filePath);
  if (getPlatform() === "windows")
    normalized = normalized.replace(/\//g, "\\").toLowerCase();
  return normalized;
}
function pathsEqual(path1, path22) {
  return normalizePathForComparison(path1) === normalizePathForComparison(path22);
}
var MAX_OUTPUT_SIZE = 262144, FILE_NOT_FOUND_CWD_NOTE = "Note: your current working directory is";
var init_file = __esm(() => {
  init_cwd2();
  init_debug();
  init_errors();
  init_fileRead();
  init_fileReadCache();
  init_fsOperations();
  init_log3();
  init_path2();
  init_platform();
});
