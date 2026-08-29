// Original: src/utils/doctorDiagnostic.ts
import { readFile as readFile18, realpath as realpath5 } from "fs/promises";
import { homedir as homedir22 } from "os";
import { delimiter as delimiter2, join as join65, posix as posix2, win32 } from "path";
function getNormalizedPaths() {
  let invokedPath = process.argv[1] || "", execPath2 = process.execPath || process.argv[0] || "";
  if (getPlatform() === "windows")
    invokedPath = invokedPath.split(win32.sep).join(posix2.sep), execPath2 = execPath2.split(win32.sep).join(posix2.sep);
  return [invokedPath, execPath2];
}
async function getCurrentInstallationType() {
  return "development";
}
async function getInstallationPath() {
  return getCwd();
}
function getInvokedBinary() {
  try {
    if (isInBundledMode())
      return process.execPath || "unknown";
    return process.argv[1] || "unknown";
  } catch {
    return "unknown";
  }
}
async function detectMultipleInstallations() {
  let fs16 = getFsImplementation(), installations = [], localPath = join65(homedir22(), ".claude", "local");
  if (await localInstallationExists())
    installations.push({ type: "npm-local", path: localPath });
  let packagesToCheck = ["@anthropic-ai/claude-code"], npmResult = await execFileNoThrow("npm", [
    "-g",
    "config",
    "get",
    "prefix"
  ]);
  if (npmResult.code === 0 && npmResult.stdout) {
    let npmPrefix = npmResult.stdout.trim(), isWindows3 = getPlatform() === "windows", globalBinPath = isWindows3 ? join65(npmPrefix, "claude") : join65(npmPrefix, "bin", "claude"), globalBinExists = !1;
    try {
      await fs16.stat(globalBinPath), globalBinExists = !0;
    } catch {}
    if (globalBinExists) {
      let isCurrentHomebrewInstallation = !1;
      try {
        if ((await realpath5(globalBinPath)).includes("/Caskroom/"))
          isCurrentHomebrewInstallation = detectHomebrew();
      } catch {}
      if (!isCurrentHomebrewInstallation)
        installations.push({ type: "npm-global", path: globalBinPath });
    } else
      for (let packageName of packagesToCheck) {
        let globalPackagePath = isWindows3 ? join65(npmPrefix, "node_modules", packageName) : join65(npmPrefix, "lib", "node_modules", packageName);
        try {
          await fs16.stat(globalPackagePath), installations.push({
            type: "npm-global-orphan",
            path: globalPackagePath
          });
        } catch {}
      }
  }
  let nativeBinPath = join65(homedir22(), ".local", "bin", "claude");
  try {
    await fs16.stat(nativeBinPath), installations.push({ type: "native", path: nativeBinPath });
  } catch {}
  if (getGlobalConfig().installMethod === "native") {
    let nativeDataPath = join65(homedir22(), ".local", "share", "claude");
    try {
      if (await fs16.stat(nativeDataPath), !installations.some((i5) => i5.type === "native"))
        installations.push({ type: "native", path: nativeDataPath });
    } catch {}
  }
  return installations;
}
async function detectConfigurationIssues(type) {
  let warnings = [];
  try {
    let raw = await readFile18(join65(getManagedFilePath(), "managed-settings.json"), "utf-8"), parsed = jsonParse(raw), field = parsed && typeof parsed === "object" ? parsed.strictPluginOnlyCustomization : void 0;
    if (field !== void 0 && typeof field !== "boolean")
      if (!Array.isArray(field))
        warnings.push({
          issue: `managed-settings.json: strictPluginOnlyCustomization has an invalid value (expected true or an array, got ${typeof field})`,
          fix: `The field is silently ignored (schema .catch rescues it). Set it to true, or an array of: ${CUSTOMIZATION_SURFACES.join(", ")}.`
        });
      else {
        let unknown3 = field.filter((x4) => typeof x4 === "string" && !CUSTOMIZATION_SURFACES.includes(x4));
        if (unknown3.length > 0)
          warnings.push({
            issue: `managed-settings.json: strictPluginOnlyCustomization has ${unknown3.length} value(s) this client doesn't recognize: ${unknown3.map(String).join(", ")}`,
            fix: `These are silently ignored (forwards-compat). Known surfaces for this version: ${CUSTOMIZATION_SURFACES.join(", ")}. Either remove them, or this client is older than the managed-settings intended.`
          });
      }
  } catch {}
  let config10 = getGlobalConfig();
  if (type === "development")
    return warnings;
  if (type === "native") {
    let pathDirectories = (process.env.PATH || "").split(delimiter2), homeDir = homedir22(), localBinPath = join65(homeDir, ".local", "bin"), normalizedLocalBinPath = localBinPath;
    if (getPlatform() === "windows")
      normalizedLocalBinPath = localBinPath.split(win32.sep).join(posix2.sep);
    if (!pathDirectories.some((dir) => {
      let normalizedDir = dir;
      if (getPlatform() === "windows")
        normalizedDir = dir.split(win32.sep).join(posix2.sep);
      let trimmedDir = normalizedDir.replace(/\/+$/, ""), trimmedRawDir = dir.replace(/[/\\]+$/, "");
      return trimmedDir === normalizedLocalBinPath || trimmedRawDir === "~/.local/bin" || trimmedRawDir === "$HOME/.local/bin";
    }))
      if (getPlatform() === "windows") {
        let windowsLocalBinPath = localBinPath.split(posix2.sep).join(win32.sep);
        warnings.push({
          issue: `Native installation exists but ${windowsLocalBinPath} is not in your PATH`,
          fix: "Add it by opening: System Properties \u2192 Environment Variables \u2192 Edit User PATH \u2192 New \u2192 Add the path above. Then restart your terminal."
        });
      } else {
        let shellType = getShellType(), configFile = getShellConfigPaths()[shellType], displayPath = configFile ? configFile.replace(homedir22(), "~") : "your shell config file";
        warnings.push({
          issue: "Native installation exists but ~/.local/bin is not in your PATH",
          fix: `Run: echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${displayPath} then open a new terminal or run: source ${displayPath}`
        });
      }
  }
  if (!isEnvTruthy(process.env.DISABLE_INSTALLATION_CHECKS)) {
    if (type === "npm-local" && config10.installMethod !== "local")
      warnings.push({
        issue: `Running from local installation but config install method is '${config10.installMethod}'`,
        fix: "Consider using native installation: claude install"
      });
    if (type === "native" && config10.installMethod !== "native")
      warnings.push({
        issue: `Running native installation but config install method is '${config10.installMethod}'`,
        fix: "Run claude install to update configuration"
      });
  }
  if (type === "npm-global" && await localInstallationExists())
    warnings.push({
      issue: "Local installation exists but not being used",
      fix: "Consider using native installation: claude install"
    });
  let existingAlias = await findClaudeAlias(), validAlias = await findValidClaudeAlias();
  if (type === "npm-local") {
    if (!await which("claude") && !validAlias)
      if (existingAlias)
        warnings.push({
          issue: "Local installation not accessible",
          fix: `Alias exists but points to invalid target: ${existingAlias}. Update alias: alias claude="~/.claude/local/claude"`
        });
      else
        warnings.push({
          issue: "Local installation not accessible",
          fix: 'Create alias: alias claude="~/.claude/local/claude"'
        });
  }
  return warnings;
}
function detectLinuxGlobPatternWarnings() {
  if (getPlatform() !== "linux")
    return [];
  let warnings = [], globPatterns = SandboxManager2.getLinuxGlobPatternWarnings();
  if (globPatterns.length > 0) {
    let displayPatterns = globPatterns.slice(0, 3).join(", "), remaining = globPatterns.length - 3, patternList = remaining > 0 ? `${displayPatterns} (${remaining} more)` : displayPatterns;
    warnings.push({
      issue: "Glob patterns in sandbox permission rules are not fully supported on Linux",
      fix: `Found ${globPatterns.length} pattern(s): ${patternList}. On Linux, glob patterns in Edit/Read rules will be ignored.`
    });
  }
  return warnings;
}
async function getDoctorDiagnostic() {
  let installationType = await getCurrentInstallationType(), version5 = typeof MACRO < "u" ? "2.1.90" : "unknown", installationPath = await getInstallationPath(), invokedBinary = getInvokedBinary(), multipleInstallations = await detectMultipleInstallations(), warnings = await detectConfigurationIssues(installationType);
  if (warnings.push(...detectLinuxGlobPatternWarnings()), installationType === "native") {
    let npmInstalls = multipleInstallations.filter((i5) => i5.type === "npm-global" || i5.type === "npm-global-orphan" || i5.type === "npm-local"), isWindows3 = getPlatform() === "windows";
    for (let install of npmInstalls)
      if (install.type === "npm-global") {
        let uninstallCmd = "npm -g uninstall @anthropic-ai/claude-code";
        warnings.push({
          issue: `Leftover npm global installation at ${install.path}`,
          fix: `Run: ${uninstallCmd}`
        });
      } else if (install.type === "npm-global-orphan")
        warnings.push({
          issue: `Orphaned npm global package at ${install.path}`,
          fix: isWindows3 ? `Run: rmdir /s /q "${install.path}"` : `Run: rm -rf ${install.path}`
        });
      else if (install.type === "npm-local")
        warnings.push({
          issue: `Leftover npm local installation at ${install.path}`,
          fix: isWindows3 ? `Run: rmdir /s /q "${install.path}"` : `Run: rm -rf ${install.path}`
        });
  }
  let configInstallMethod = getGlobalConfig().installMethod || "not set", hasUpdatePermissions = null;
  if (installationType === "npm-global") {
    if (hasUpdatePermissions = (await checkGlobalInstallPermissions()).hasPermissions, !hasUpdatePermissions && !getAutoUpdaterDisabledReason())
      warnings.push({
        issue: "Insufficient permissions for auto-updates",
        fix: "Do one of: (1) Re-install node without sudo, or (2) Use `claude install` for native installation"
      });
  }
  let ripgrepStatusRaw = getRipgrepStatus(), ripgrepStatus2 = {
    working: ripgrepStatusRaw.working ?? !0,
    mode: ripgrepStatusRaw.mode,
    systemPath: ripgrepStatusRaw.mode === "system" ? ripgrepStatusRaw.path : null
  }, packageManager = installationType === "package-manager" ? await getPackageManager() : void 0;
  return {
    installationType,
    version: version5,
    installationPath,
    invokedBinary,
    configInstallMethod,
    autoUpdates: (() => {
      let reason = getAutoUpdaterDisabledReason();
      return reason ? `disabled (${formatAutoUpdaterDisabledReason(reason)})` : "enabled";
    })(),
    hasUpdatePermissions,
    multipleInstallations,
    warnings,
    packageManager,
    ripgrepStatus: ripgrepStatus2
  };
}
var init_doctorDiagnostic = __esm(() => {
  init_execa();
  init_autoUpdater();
  init_config4();
  init_cwd2();
  init_envUtils();
  init_execFileNoThrow();
  init_fsOperations();
  init_localInstaller();
  init_packageManagers();
  init_platform();
  init_ripgrep();
  init_sandbox_adapter();
  init_managedPath();
  init_types3();
  init_shellConfig();
  init_slowOperations();
  init_which();
});
