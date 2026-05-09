// function: findApplySeccompPath
function findApplySeccompPath(seccompBinaryPath) {
  if (seccompBinaryPath) {
    if (fs11.existsSync(seccompBinaryPath))
      return logForDebugging2(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${seccompBinaryPath}`), seccompBinaryPath;
    logForDebugging2(`[SeccompFilter] Explicit path provided but file not found: ${seccompBinaryPath}`);
  }
  let arch2 = getVendorArchitecture();
  if (!arch2)
    return logForDebugging2(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
  logForDebugging2(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${arch2}`);
  for (let binaryPath of getLocalSeccompPaths("apply-seccomp"))
    if (fs11.existsSync(binaryPath))
      return logForDebugging2(`[SeccompFilter] Found apply-seccomp binary: ${binaryPath} (${arch2})`), binaryPath;
  for (let globalBase of getGlobalNpmPaths()) {
    let binaryPath = join31(globalBase, "vendor", "seccomp", arch2, "apply-seccomp");
    if (fs11.existsSync(binaryPath))
      return logForDebugging2(`[SeccompFilter] Found apply-seccomp binary in global install: ${binaryPath} (${arch2})`), binaryPath;
  }
  return logForDebugging2(`[SeccompFilter] apply-seccomp binary not found in any expected location (${arch2})`), null;
}
