// function: writeMcpjsonFile
async function writeMcpjsonFile(config10) {
  let mcpJsonPath = join51(getCwd(), ".mcp.json"), existingMode;
  try {
    existingMode = (await stat17(mcpJsonPath)).mode;
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      throw e;
  }
  let tempPath = `${mcpJsonPath}.tmp.${process.pid}.${Date.now()}`, handle = await open5(tempPath, "w", existingMode ?? 420);
  try {
    await handle.writeFile(jsonStringify(config10, null, 2), {
      encoding: "utf8"
    }), await handle.datasync();
  } finally {
    await handle.close();
  }
  try {
    if (existingMode !== void 0)
      await chmod2(tempPath, existingMode);
    await rename(tempPath, mcpJsonPath);
  } catch (e) {
    try {
      await unlink2(tempPath);
    } catch {}
    throw e;
  }
}
