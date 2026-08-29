// function: cleanMcpb
async function cleanMcpb(inputPath) {
  let tmpDir = await fs14.mkdtemp(resolve21(os5.tmpdir(), "mcpb-clean-")), mcpbPath = resolve21(tmpDir, "in.mcpb"), unpackPath = resolve21(tmpDir, "out");
  console.log(" -- Cleaning MCPB...");
  try {
    await fs14.copyFile(inputPath, mcpbPath), console.log(" -- Unpacking MCPB..."), await unpackExtension({ mcpbPath, silent: !0, outputDir: unpackPath });
    let manifestPath = resolve21(unpackPath, "manifest.json"), originalManifest = await fs14.readFile(manifestPath, "utf-8"), manifestData = JSON.parse(originalManifest), manifestVersion = getManifestVersionFromRawData(manifestData);
    if (!manifestVersion)
      throw Error("Unrecognized or unsupported manifest version");
    let result = MANIFEST_SCHEMAS_LOOSE[manifestVersion].safeParse(manifestData);
    if (!result.success)
      throw Error('Unrecoverable manifest issues, please run "mcpb validate"');
    if (await fs14.writeFile(manifestPath, JSON.stringify(result.data, null, 2)), originalManifest.trim() !== (await fs14.readFile(manifestPath, "utf8")).trim())
      console.log(" -- Update manifest to be valid per MCPB schema");
    else
      console.log(" -- Manifest already valid per MCPB schema");
    let nodeModulesPath = resolve21(unpackPath, "node_modules");
    if (existsSync10(nodeModulesPath)) {
      console.log(" -- node_modules found, deleting development dependencies");
      let destroyer = new import_galactus.DestroyerOfModules({
        rootDirectory: unpackPath
      });
      try {
        await destroyer.destroy();
      } catch (error44) {
        if (error44 instanceof Error && error44.message.includes("Failed to locate module"))
          console.log(" -- Some modules already removed, skipping remaining cleanup");
        else
          throw error44;
      }
      console.log(" -- Removed development dependencies from node_modules");
    } else
      console.log(" -- No node_modules, not pruning");
    let before = await fs14.stat(inputPath), { packExtension } = await Promise.resolve().then(() => (init_pack(), exports_pack));
    await packExtension({
      extensionPath: unpackPath,
      outputPath: inputPath,
      silent: !0
    });
    let after = await fs14.stat(inputPath);
    console.log(`
Clean Complete:`), console.log("Before:", import_pretty_bytes.default(before.size)), console.log("After:", import_pretty_bytes.default(after.size));
  } finally {
    await fs14.rm(tmpDir, {
      recursive: !0,
      force: !0
    });
  }
}
