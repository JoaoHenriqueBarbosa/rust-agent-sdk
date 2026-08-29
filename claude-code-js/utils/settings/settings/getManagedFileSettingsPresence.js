// function: getManagedFileSettingsPresence
function getManagedFileSettingsPresence() {
  let { settings: base2 } = parseSettingsFile(getManagedSettingsFilePath()), hasBase = !!base2 && Object.keys(base2).length > 0, hasDropIns = !1, dropInDir = getManagedSettingsDropInDir();
  try {
    hasDropIns = getFsImplementation().readdirSync(dropInDir).some((d) => (d.isFile() || d.isSymbolicLink()) && d.name.endsWith(".json") && !d.name.startsWith("."));
  } catch {}
  return { hasBase, hasDropIns };
}
