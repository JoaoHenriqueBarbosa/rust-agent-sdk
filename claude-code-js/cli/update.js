// Original: src/cli/update.ts
var exports_update = {};
__export(exports_update, {
  update: () => update2
});
async function update2() {
  logEvent("tengu_update_check", {}), writeToStdout(`Current version: 2.1.90
`);
  let channel = getInitialSettings()?.autoUpdatesChannel ?? "latest";
  writeToStdout(`Checking for updates to ${channel} version...
`), logForDebugging("update: Starting update check"), logForDebugging("update: Running diagnostic");
  let diagnostic = await getDoctorDiagnostic();
  if (logForDebugging(`update: Installation type: ${diagnostic.installationType}`), logForDebugging(`update: Config install method: ${diagnostic.configInstallMethod}`), diagnostic.multipleInstallations.length > 1) {
    writeToStdout(`
`), writeToStdout(source_default.yellow("Warning: Multiple installations found") + `
`);
    for (let install2 of diagnostic.multipleInstallations) {
      let current = diagnostic.installationType === install2.type ? " (currently running)" : "";
      writeToStdout(`- ${install2.type} at ${install2.path}${current}
`);
    }
  }
  if (diagnostic.warnings.length > 0) {
    writeToStdout(`
`);
    for (let warning of diagnostic.warnings)
      logForDebugging(`update: Warning detected: ${warning.issue}`), logForDebugging(`update: Showing warning: ${warning.issue}`), writeToStdout(source_default.yellow(`Warning: ${warning.issue}
`)), writeToStdout(source_default.bold(`Fix: ${warning.fix}
`));
  }
  let config11 = getGlobalConfig();
  if (!config11.installMethod && diagnostic.installationType !== "package-manager") {
    writeToStdout(`
`), writeToStdout(`Updating configuration to track installation method...
`);
    let detectedMethod = "unknown";
    switch (diagnostic.installationType) {
      case "npm-local":
        detectedMethod = "local";
        break;
      case "native":
        detectedMethod = "native";
        break;
      case "npm-global":
        detectedMethod = "global";
        break;
      default:
        detectedMethod = "unknown";
    }
    saveGlobalConfig((current) => ({
      ...current,
      installMethod: detectedMethod
    })), writeToStdout(`Installation method set to: ${detectedMethod}
`);
  }
  if (diagnostic.installationType === "development")
    writeToStdout(`
`), writeToStdout(source_default.yellow("Warning: Cannot update development build") + `
`), await gracefulShutdown(1);
  if (diagnostic.installationType === "package-manager") {
    let packageManager = await getPackageManager();
    if (writeToStdout(`
`), packageManager === "homebrew") {
      writeToStdout(`Claude is managed by Homebrew.
`);
      let latest = await getLatestVersion(channel);
      if (latest && !gte("2.1.90", latest))
        writeToStdout(`Update available: ${"2.1.90"} \u2192 ${latest}
`), writeToStdout(`
`), writeToStdout(`To update, run:
`), writeToStdout(source_default.bold("  brew upgrade claude-code") + `
`);
      else
        writeToStdout(`Claude is up to date!
`);
    } else if (packageManager === "winget") {
      writeToStdout(`Claude is managed by winget.
`);
      let latest = await getLatestVersion(channel);
      if (latest && !gte("2.1.90", latest))
        writeToStdout(`Update available: ${"2.1.90"} \u2192 ${latest}
`), writeToStdout(`
`), writeToStdout(`To update, run:
`), writeToStdout(source_default.bold("  winget upgrade Anthropic.ClaudeCode") + `
`);
      else
        writeToStdout(`Claude is up to date!
`);
    } else if (packageManager === "apk") {
      writeToStdout(`Claude is managed by apk.
`);
      let latest = await getLatestVersion(channel);
      if (latest && !gte("2.1.90", latest))
        writeToStdout(`Update available: ${"2.1.90"} \u2192 ${latest}
`), writeToStdout(`
`), writeToStdout(`To update, run:
`), writeToStdout(source_default.bold("  apk upgrade claude-code") + `
`);
      else
        writeToStdout(`Claude is up to date!
`);
    } else
      writeToStdout(`Claude is managed by a package manager.
`), writeToStdout(`Please use your package manager to update.
`);
    await gracefulShutdown(0);
  }
  if (config11.installMethod && diagnostic.configInstallMethod !== "not set" && diagnostic.installationType !== "package-manager") {
    let { installationType: runningType, configInstallMethod: configExpects } = diagnostic, normalizedRunningType = {
      "npm-local": "local",
      "npm-global": "global",
      native: "native",
      development: "development",
      unknown: "unknown"
    }[runningType] || runningType;
    if (normalizedRunningType !== configExpects && configExpects !== "unknown")
      writeToStdout(`
`), writeToStdout(source_default.yellow("Warning: Configuration mismatch") + `
`), writeToStdout(`Config expects: ${configExpects} installation
`), writeToStdout(`Currently running: ${runningType}
`), writeToStdout(source_default.yellow(`Updating the ${runningType} installation you are currently using`) + `
`), saveGlobalConfig((current) => ({
        ...current,
        installMethod: normalizedRunningType
      })), writeToStdout(`Config updated to reflect current installation method: ${normalizedRunningType}
`);
  }
  if (diagnostic.installationType === "native") {
    logForDebugging("update: Detected native installation, using native updater");
    try {
      let result = await installLatest(channel, !0);
      if (result.lockFailed) {
        let pidInfo = result.lockHolderPid ? ` (PID ${result.lockHolderPid})` : "";
        writeToStdout(source_default.yellow(`Another Claude process${pidInfo} is currently running. Please try again in a moment.`) + `
`), await gracefulShutdown(0);
      }
      if (!result.latestVersion)
        process.stderr.write(`Failed to check for updates
`), await gracefulShutdown(1);
      if (result.latestVersion === "2.1.90")
        writeToStdout(source_default.green("Claude Code is up to date (2.1.90)") + `
`);
      else
        writeToStdout(source_default.green(`Successfully updated from 2.1.90 to version ${result.latestVersion}`) + `
`), await regenerateCompletionCache();
      await gracefulShutdown(0);
    } catch (error44) {
      process.stderr.write(`Error: Failed to install native update
`), process.stderr.write(String(error44) + `
`), process.stderr.write(`Try running "claude doctor" for diagnostics
`), await gracefulShutdown(1);
    }
  }
  if (config11.installMethod !== "native")
    await removeInstalledSymlink();
  logForDebugging("update: Checking npm registry for latest version"), logForDebugging("update: Package URL: @anthropic-ai/claude-code"), logForDebugging(`update: Running: ${`npm view @anthropic-ai/claude-code@${channel === "stable" ? "stable" : "latest"} version`}`);
  let latestVersion = await getLatestVersion(channel);
  if (logForDebugging(`update: Latest version from npm: ${latestVersion || "FAILED"}`), !latestVersion) {
    if (logForDebugging("update: Failed to get latest version from npm registry"), process.stderr.write(source_default.red("Failed to check for updates") + `
`), process.stderr.write(`Unable to fetch latest version from npm registry
`), process.stderr.write(`
`), process.stderr.write(`Possible causes:
`), process.stderr.write(`  \u2022 Network connectivity issues
`), process.stderr.write(`  \u2022 npm registry is unreachable
`), process.stderr.write(`  \u2022 Corporate proxy/firewall blocking npm
`), !"@anthropic-ai/claude-code".startsWith("@anthropic"))
      process.stderr.write(`  \u2022 Internal/development build not published to npm
`);
    process.stderr.write(`
`), process.stderr.write(`Try:
`), process.stderr.write(`  \u2022 Check your internet connection
`), process.stderr.write(`  \u2022 Run with --debug flag for more details
`);
    let packageName = "@anthropic-ai/claude-code";
    process.stderr.write(`  \u2022 Manually check: npm view ${packageName} version
`), process.stderr.write(`  \u2022 Check if you need to login: npm whoami
`), await gracefulShutdown(1);
  }
  if (latestVersion === "2.1.90")
    writeToStdout(source_default.green("Claude Code is up to date (2.1.90)") + `
`), await gracefulShutdown(0);
  writeToStdout(`New version available: ${latestVersion} (current: 2.1.90)
`), writeToStdout(`Installing update...
`);
  let useLocalUpdate = !1, updateMethodName = "";
  switch (diagnostic.installationType) {
    case "npm-local":
      useLocalUpdate = !0, updateMethodName = "local";
      break;
    case "npm-global":
      useLocalUpdate = !1, updateMethodName = "global";
      break;
    case "unknown": {
      let isLocal = await localInstallationExists();
      useLocalUpdate = isLocal, updateMethodName = isLocal ? "local" : "global", writeToStdout(source_default.yellow("Warning: Could not determine installation type") + `
`), writeToStdout(`Attempting ${updateMethodName} update based on file detection...
`);
      break;
    }
    default:
      process.stderr.write(`Error: Cannot update ${diagnostic.installationType} installation
`), await gracefulShutdown(1);
  }
  writeToStdout(`Using ${updateMethodName} installation update method...
`), logForDebugging(`update: Update method determined: ${updateMethodName}`), logForDebugging(`update: useLocalUpdate: ${useLocalUpdate}`);
  let status2;
  if (useLocalUpdate)
    logForDebugging("update: Calling installOrUpdateClaudePackage() for local update"), status2 = await installOrUpdateClaudePackage(channel);
  else
    logForDebugging("update: Calling installGlobalPackage() for global update"), status2 = await installGlobalPackage();
  switch (logForDebugging(`update: Installation status: ${status2}`), status2) {
    case "success":
      writeToStdout(source_default.green(`Successfully updated from 2.1.90 to version ${latestVersion}`) + `
`), await regenerateCompletionCache();
      break;
    case "no_permissions":
      if (process.stderr.write(`Error: Insufficient permissions to install update
`), useLocalUpdate)
        process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update @anthropic-ai/claude-code
`);
      else
        process.stderr.write(`Try running with sudo or fix npm permissions
`), process.stderr.write(`Or consider using native installation with: claude install
`);
      await gracefulShutdown(1);
      break;
    case "install_failed":
      if (process.stderr.write(`Error: Failed to install update
`), useLocalUpdate)
        process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update @anthropic-ai/claude-code
`);
      else
        process.stderr.write(`Or consider using native installation with: claude install
`);
      await gracefulShutdown(1);
      break;
    case "in_progress":
      process.stderr.write(`Error: Another instance is currently performing an update
`), process.stderr.write(`Please wait and try again later
`), await gracefulShutdown(1);
      break;
  }
  await gracefulShutdown(0);
}
var init_update = __esm(() => {
  init_source();
  init_autoUpdater();
  init_completionCache();
  init_config4();
  init_debug();
  init_doctorDiagnostic();
  init_gracefulShutdown();
  init_localInstaller();
  init_nativeInstaller();
  init_packageManagers();
  init_settings2();
});
