// function: getConfig
function getConfig(file2, createDefault, throwOnInvalid) {
  if (!configReadingAllowed)
    throw Error("Config accessed before allowed.");
  let fs4 = getFsImplementation();
  try {
    let fileContent = fs4.readFileSync(file2, {
      encoding: "utf-8"
    });
    try {
      let parsedConfig = jsonParse(stripBOM(fileContent));
      return {
        ...createDefault(),
        ...parsedConfig
      };
    } catch (error41) {
      let errorMessage2 = error41 instanceof Error ? error41.message : String(error41);
      throw new ConfigParseError(errorMessage2, file2, createDefault());
    }
  } catch (error41) {
    if (getErrnoCode(error41) === "ENOENT") {
      let backupPath = findMostRecentBackup(file2);
      if (backupPath)
        process.stderr.write(`
Claude configuration file not found at: ${file2}
A backup file exists at: ${backupPath}
You can manually restore it by running: cp "${backupPath}" "${file2}"

`);
      return createDefault();
    }
    if (error41 instanceof ConfigParseError && throwOnInvalid)
      throw error41;
    if (error41 instanceof ConfigParseError) {
      if (logForDebugging(`Config file corrupted, resetting to defaults: ${error41.message}`, { level: "error" }), !insideGetConfig) {
        insideGetConfig = !0;
        try {
          logError2(error41);
          let hasBackup = !1;
          try {
            fs4.statSync(`${file2}.backup`), hasBackup = !0;
          } catch {}
          logEvent("tengu_config_parse_error", {
            has_backup: hasBackup
          });
        } finally {
          insideGetConfig = !1;
        }
      }
      process.stderr.write(`
Claude configuration file at ${file2} is corrupted: ${error41.message}
`);
      let fileBase = basename4(file2), corruptedBackupDir = getConfigBackupDir();
      try {
        fs4.mkdirSync(corruptedBackupDir);
      } catch (mkdirErr) {
        if (getErrnoCode(mkdirErr) !== "EEXIST")
          throw mkdirErr;
      }
      let existingCorruptedBackups = fs4.readdirStringSync(corruptedBackupDir).filter((f) => f.startsWith(`${fileBase}.corrupted.`)), corruptedBackupPath, alreadyBackedUp = !1, currentContent = fs4.readFileSync(file2, { encoding: "utf-8" });
      for (let backup of existingCorruptedBackups)
        try {
          let backupContent = fs4.readFileSync(join20(corruptedBackupDir, backup), { encoding: "utf-8" });
          if (currentContent === backupContent) {
            alreadyBackedUp = !0;
            break;
          }
        } catch {}
      if (!alreadyBackedUp) {
        corruptedBackupPath = join20(corruptedBackupDir, `${fileBase}.corrupted.${Date.now()}`);
        try {
          fs4.copyFileSync(file2, corruptedBackupPath), logForDebugging(`Corrupted config backed up to: ${corruptedBackupPath}`, {
            level: "error"
          });
        } catch {}
      }
      let backupPath = findMostRecentBackup(file2);
      if (corruptedBackupPath)
        process.stderr.write(`The corrupted file has been backed up to: ${corruptedBackupPath}
`);
      else if (alreadyBackedUp)
        process.stderr.write(`The corrupted file has already been backed up.
`);
      if (backupPath)
        process.stderr.write(`A backup file exists at: ${backupPath}
You can manually restore it by running: cp "${backupPath}" "${file2}"

`);
      else
        process.stderr.write(`
`);
    }
    return createDefault();
  }
}
