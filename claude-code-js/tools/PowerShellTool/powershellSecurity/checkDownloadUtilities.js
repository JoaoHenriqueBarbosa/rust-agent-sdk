// function: checkDownloadUtilities
function checkDownloadUtilities(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (lower === "start-bitstransfer")
      return {
        behavior: "ask",
        message: "Command downloads files via BITS transfer"
      };
    if (lower === "certutil" || lower === "certutil.exe") {
      if (cmd.args.some((a2) => {
        let la = a2.toLowerCase();
        return la === "-urlcache" || la === "/urlcache";
      }))
        return {
          behavior: "ask",
          message: "Command uses certutil to download from a URL"
        };
    }
    if (lower === "bitsadmin" || lower === "bitsadmin.exe") {
      if (cmd.args.some((a2) => a2.toLowerCase() === "/transfer"))
        return {
          behavior: "ask",
          message: "Command downloads files via BITS transfer"
        };
    }
  }
  return { behavior: "passthrough" };
}
