// function: getVendorArchitecture
function getVendorArchitecture() {
  let arch2 = process.arch;
  switch (arch2) {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      return logForDebugging2("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", { level: "error" }), null;
    default:
      return logForDebugging2(`[SeccompFilter] Unsupported architecture: ${arch2}. Only x64 and arm64 are supported.`), null;
  }
}
