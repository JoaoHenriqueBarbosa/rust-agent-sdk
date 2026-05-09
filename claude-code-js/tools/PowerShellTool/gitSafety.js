// Original: src/tools/PowerShellTool/gitSafety.ts
import { basename as basename21, posix as posix4, resolve as resolve30, sep as sep15 } from "path";
function resolveCwdReentry(normalized) {
  if (!normalized.startsWith("../"))
    return normalized;
  let cwdBase = basename21(getCwd()).toLowerCase();
  if (!cwdBase)
    return normalized;
  let prefix = "../" + cwdBase + "/", s2 = normalized;
  while (s2.startsWith(prefix))
    s2 = s2.slice(prefix.length);
  if (s2 === "../" + cwdBase)
    return ".";
  return s2;
}
function normalizeGitPathArg(arg) {
  let s2 = arg;
  if (s2.length > 0 && (PS_TOKENIZER_DASH_CHARS.has(s2[0]) || s2[0] === "/")) {
    let c3 = s2.indexOf(":", 1);
    if (c3 > 0)
      s2 = s2.slice(c3 + 1);
  }
  if (s2 = s2.replace(/^['"]|['"]$/g, ""), s2 = s2.replace(/`/g, ""), s2 = s2.replace(/^(?:[A-Za-z0-9_.]+\\){0,3}FileSystem::/i, ""), s2 = s2.replace(/^[A-Za-z]:(?![/\\])/, ""), s2 = s2.replace(/\\/g, "/"), s2 = s2.split("/").map((c3) => {
    if (c3 === "")
      return c3;
    let prev;
    do {
      if (prev = c3, c3 = c3.replace(/ +$/, ""), c3 === "." || c3 === "..")
        return c3;
      c3 = c3.replace(/\.+$/, "");
    } while (c3 !== prev);
    return c3 || ".";
  }).join("/"), s2 = posix4.normalize(s2), s2.startsWith("./"))
    s2 = s2.slice(2);
  return s2.toLowerCase();
}
function resolveEscapingPathToCwdRelative(n5) {
  let cwd2 = getCwd(), abs = resolve30(cwd2, n5), cwdWithSep = cwd2.endsWith(sep15) ? cwd2 : cwd2 + sep15, absLower = abs.toLowerCase(), cwdLower = cwd2.toLowerCase(), cwdWithSepLower = cwdWithSep.toLowerCase();
  if (absLower === cwdLower)
    return ".";
  if (!absLower.startsWith(cwdWithSepLower))
    return null;
  return abs.slice(cwdWithSep.length).replace(/\\/g, "/").toLowerCase();
}
function matchesGitInternalPrefix(n5) {
  if (n5 === "head" || n5 === ".git")
    return !0;
  if (n5.startsWith(".git/") || /^git~\d+($|\/)/.test(n5))
    return !0;
  for (let p4 of GIT_INTERNAL_PREFIXES) {
    if (p4 === "head")
      continue;
    if (n5 === p4 || n5.startsWith(p4 + "/"))
      return !0;
  }
  return !1;
}
function isGitInternalPathPS(arg) {
  let n5 = resolveCwdReentry(normalizeGitPathArg(arg));
  if (matchesGitInternalPrefix(n5))
    return !0;
  if (n5.startsWith("../") || n5.startsWith("/") || /^[a-z]:/.test(n5)) {
    let rel = resolveEscapingPathToCwdRelative(n5);
    if (rel !== null && matchesGitInternalPrefix(rel))
      return !0;
  }
  return !1;
}
function isDotGitPathPS(arg) {
  let n5 = resolveCwdReentry(normalizeGitPathArg(arg));
  if (matchesDotGitPrefix(n5))
    return !0;
  if (n5.startsWith("../") || n5.startsWith("/") || /^[a-z]:/.test(n5)) {
    let rel = resolveEscapingPathToCwdRelative(n5);
    if (rel !== null && matchesDotGitPrefix(rel))
      return !0;
  }
  return !1;
}
function matchesDotGitPrefix(n5) {
  if (n5 === ".git" || n5.startsWith(".git/"))
    return !0;
  return /^git~\d+($|\/)/.test(n5);
}
var GIT_INTERNAL_PREFIXES;
var init_gitSafety = __esm(() => {
  init_cwd2();
  init_parser5();
  GIT_INTERNAL_PREFIXES = ["head", "objects", "refs", "hooks"];
});
