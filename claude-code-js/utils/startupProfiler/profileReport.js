// function: profileReport
function profileReport() {
  if (reported)
    return;
  if (reported = !0, logStartupPerf(), DETAILED_PROFILING) {
    let path2 = getStartupPerfLogPath(), dir = dirname3(path2);
    getFsImplementation().mkdirSync(dir), writeFileSync_DEPRECATED(path2, getReport(), {
      encoding: "utf8",
      flush: !0
    }), logForDebugging("Startup profiling report:"), logForDebugging(getReport());
  }
}
