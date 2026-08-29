// Original: src/utils/windowsPaths.ts
import * as path8 from "path";
import * as pathWin32 from "path/win32";
function checkPathExists(path9) {
  try {
    return execSync_DEPRECATED(`dir "${path9}"`, { stdio: "pipe" }), !0;
  } catch {
    return !1;
  }
}
function findExecutable(executable) {
  if (executable === "git") {
    let defaultLocations = [
      "C:\\Program Files\\Git\\cmd\\git.exe",
      "C:\\Program Files (x86)\\Git\\cmd\\git.exe"
    ];
    for (let location of defaultLocations)
      if (checkPathExists(location))
        return location;
  }
  try {
    let paths2 = execSync_DEPRECATED(`where.exe ${executable}`, {
      stdio: "pipe",
      encoding: "utf8"
    }).trim().split(`\r
`).filter(Boolean), cwd2 = getCwd().toLowerCase();
    for (let candidatePath of paths2) {
      let normalizedPath = path8.resolve(candidatePath).toLowerCase();
      if (path8.dirname(normalizedPath).toLowerCase() === cwd2 || normalizedPath.startsWith(cwd2 + path8.sep)) {
        logForDebugging(`Skipping potentially malicious executable in current directory: ${candidatePath}`);
        continue;
      }
      return candidatePath;
    }
    return null;
  } catch {
    return null;
  }
}
function setShellIfWindows() {
  if (getPlatform() === "windows") {
    let gitBashPath = findGitBashPath();
    process.env.SHELL = gitBashPath, logForDebugging(`Using bash path: "${gitBashPath}"`);
  }
}
var findGitBashPath, windowsPathToPosixPath, posixPathToWindowsPath;
var init_windowsPaths = __esm(() => {
  init_memoize();
  init_cwd2();
  init_debug();
  init_execSyncWrapper();
  init_memoize2();
  init_platform();
  findGitBashPath = memoize_default(() => {
    if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
      if (checkPathExists(process.env.CLAUDE_CODE_GIT_BASH_PATH))
        return process.env.CLAUDE_CODE_GIT_BASH_PATH;
      console.error(`Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`), process.exit(1);
    }
    let gitPath = findExecutable("git");
    if (gitPath) {
      let bashPath = pathWin32.join(gitPath, "..", "..", "bin", "bash.exe");
      if (checkPathExists(bashPath))
        return bashPath;
    }
    console.error("Claude Code on Windows requires git-bash (https://git-scm.com/downloads/win). If installed but not in PATH, set environment variable pointing to your bash.exe, similar to: CLAUDE_CODE_GIT_BASH_PATH=C:\\Program Files\\Git\\bin\\bash.exe"), process.exit(1);
  }), windowsPathToPosixPath = memoizeWithLRU((windowsPath) => {
    if (windowsPath.startsWith("\\\\"))
      return windowsPath.replace(/\\/g, "/");
    let match = windowsPath.match(/^([A-Za-z]):[/\\]/);
    if (match)
      return "/" + match[1].toLowerCase() + windowsPath.slice(2).replace(/\\/g, "/");
    return windowsPath.replace(/\\/g, "/");
  }, (p) => p, 500), posixPathToWindowsPath = memoizeWithLRU((posixPath) => {
    if (posixPath.startsWith("//"))
      return posixPath.replace(/\//g, "\\");
    let cygdriveMatch = posixPath.match(/^\/cygdrive\/([A-Za-z])(\/|$)/);
    if (cygdriveMatch) {
      let driveLetter = cygdriveMatch[1].toUpperCase(), rest = posixPath.slice(("/cygdrive/" + cygdriveMatch[1]).length);
      return driveLetter + ":" + (rest || "\\").replace(/\//g, "\\");
    }
    let driveMatch = posixPath.match(/^\/([A-Za-z])(\/|$)/);
    if (driveMatch) {
      let driveLetter = driveMatch[1].toUpperCase(), rest = posixPath.slice(2);
      return driveLetter + ":" + (rest || "\\").replace(/\//g, "\\");
    }
    return posixPath.replace(/\//g, "\\");
  }, (p) => p, 500);
});
