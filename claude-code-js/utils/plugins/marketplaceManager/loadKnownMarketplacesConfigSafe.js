// function: loadKnownMarketplacesConfigSafe
async function loadKnownMarketplacesConfigSafe() {
  try {
    return await loadKnownMarketplacesConfig();
  } catch {
    return {};
  }
}
