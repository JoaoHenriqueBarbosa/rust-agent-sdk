// function: loadManagedFileSettings
function loadManagedFileSettings() {
  let errors3 = [], merged = {}, found = !1, { settings, errors: baseErrors } = parseSettingsFile(getManagedSettingsFilePath());
  if (errors3.push(...baseErrors), settings && Object.keys(settings).length > 0)
    merged = mergeWith_default(merged, settings, settingsMergeCustomizer), found = !0;
  let dropInDir = getManagedSettingsDropInDir();
  try {
    let entries = getFsImplementation().readdirSync(dropInDir).filter((d) => (d.isFile() || d.isSymbolicLink()) && d.name.endsWith(".json") && !d.name.startsWith(".")).map((d) => d.name).sort();
    for (let name of entries) {
      let { settings: settings2, errors: fileErrors } = parseSettingsFile(join17(dropInDir, name));
      if (errors3.push(...fileErrors), settings2 && Object.keys(settings2).length > 0)
        merged = mergeWith_default(merged, settings2, settingsMergeCustomizer), found = !0;
    }
  } catch (e) {
    let code = getErrnoCode(e);
    if (code !== "ENOENT" && code !== "ENOTDIR")
      logError2(e);
  }
  return { settings: found ? merged : null, errors: errors3 };
}
