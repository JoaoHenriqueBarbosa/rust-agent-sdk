// Original: src/utils/bash/registry.ts
async function loadFigSpec(command19) {
  if (!command19 || command19.includes("/") || command19.includes("\\"))
    return null;
  if (command19.includes(".."))
    return null;
  if (command19.startsWith("-") && command19 !== "-")
    return null;
  try {
    let module = await import(`@withfig/autocomplete/build/${command19}.js`);
    return module.default || module;
  } catch {
    return null;
  }
}
var getCommandSpec;
var init_registry2 = __esm(() => {
  init_memoize2();
  init_specs();
  getCommandSpec = memoizeWithLRU(async (command19) => {
    return specs_default.find((s2) => s2.name === command19) || await loadFigSpec(command19) || null;
  }, (command19) => command19);
});
