// function: findSeedMarketplaceLocation
async function findSeedMarketplaceLocation(seedDir, name3) {
  let dirCandidate = join97(seedDir, "marketplaces", name3), jsonCandidate = join97(seedDir, "marketplaces", `${name3}.json`);
  for (let candidate of [dirCandidate, jsonCandidate])
    try {
      return await readCachedMarketplace(candidate), candidate;
    } catch {}
  return null;
}
