// function: saveConfig
function saveConfig(file2, config5, defaultConfig) {
  let dir = dirname12(file2);
  getFsImplementation().mkdirSync(dir);
  let filteredConfig = pickBy_default(config5, (value, key) => jsonStringify(value) !== jsonStringify(defaultConfig[key]));
  if (writeFileSyncAndFlush_DEPRECATED(file2, jsonStringify(filteredConfig, null, 2), {
    encoding: "utf-8",
    mode: 384
  }), file2 === getGlobalClaudeFile())
    globalConfigWriteCount++;
}
