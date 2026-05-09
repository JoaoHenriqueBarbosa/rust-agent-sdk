// function: getPlatform3
function getPlatform3() {
  let os6 = env3.platform, arch2 = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
  if (!arch2) {
    let error44 = Error(`Unsupported architecture: ${process.arch}`);
    throw logForDebugging(`Native installer does not support architecture: ${process.arch}`, { level: "error" }), error44;
  }
  if (os6 === "linux" && envDynamic.isMuslEnvironment())
    return `linux-${arch2}-musl`;
  return `${os6}-${arch2}`;
}
