// function: ensureScratchpadDir
async function ensureScratchpadDir() {
  if (!isScratchpadEnabled())
    throw Error("Scratchpad directory feature is not enabled");
  let fs18 = getFsImplementation(), scratchpadDir = getScratchpadDir();
  return await fs18.mkdir(scratchpadDir, { mode: 448 }), scratchpadDir;
}
