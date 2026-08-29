// Original: src/utils/genericProcessUtils.ts
function isProcessRunning(pid) {
  if (pid <= 1)
    return !1;
  try {
    return process.kill(pid, 0), !0;
  } catch {
    return !1;
  }
}
async function getAncestorPidsAsync(pid, maxDepth = 10) {
  if (process.platform === "win32") {
    let script2 = `
      $pid = ${String(pid)}
      $ancestors = @()
      for ($i = 0; $i -lt ${maxDepth}; $i++) {
        $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
        if (-not $proc -or -not $proc.ParentProcessId -or $proc.ParentProcessId -eq 0) { break }
        $pid = $proc.ParentProcessId
        $ancestors += $pid
      }
      $ancestors -join ','
    `.trim(), result2 = await execFileNoThrowWithCwd("powershell.exe", ["-NoProfile", "-Command", script2], { timeout: 3000 });
    if (result2.code !== 0 || !result2.stdout?.trim())
      return [];
    return result2.stdout.trim().split(",").filter(Boolean).map((p4) => parseInt(p4, 10)).filter((p4) => !isNaN(p4));
  }
  let script = `pid=${String(pid)}; for i in $(seq 1 ${maxDepth}); do ppid=$(ps -o ppid= -p $pid 2>/dev/null | tr -d ' '); if [ -z "$ppid" ] || [ "$ppid" = "0" ] || [ "$ppid" = "1" ]; then break; fi; echo $ppid; pid=$ppid; done`, result = await execFileNoThrowWithCwd("sh", ["-c", script], {
    timeout: 3000
  });
  if (result.code !== 0 || !result.stdout?.trim())
    return [];
  return result.stdout.trim().split(`
`).filter(Boolean).map((p4) => parseInt(p4, 10)).filter((p4) => !isNaN(p4));
}
function getProcessCommand(pid) {
  try {
    let pidStr = String(pid), command12 = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${pidStr}\\").CommandLine"` : `ps -o command= -p ${pidStr}`, result = execSyncWithDefaults_DEPRECATED(command12, { timeout: 1000 });
    return result ? result.trim() : null;
  } catch {
    return null;
  }
}
async function getAncestorCommandsAsync(pid, maxDepth = 10) {
  if (process.platform === "win32") {
    let script2 = `
      $currentPid = ${String(pid)}
      $commands = @()
      for ($i = 0; $i -lt ${maxDepth}; $i++) {
        $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$currentPid" -ErrorAction SilentlyContinue
        if (-not $proc) { break }
        if ($proc.CommandLine) { $commands += $proc.CommandLine }
        if (-not $proc.ParentProcessId -or $proc.ParentProcessId -eq 0) { break }
        $currentPid = $proc.ParentProcessId
      }
      $commands -join [char]0
    `.trim(), result2 = await execFileNoThrowWithCwd("powershell.exe", ["-NoProfile", "-Command", script2], { timeout: 3000 });
    if (result2.code !== 0 || !result2.stdout?.trim())
      return [];
    return result2.stdout.split("\x00").filter(Boolean);
  }
  let script = `currentpid=${String(pid)}; for i in $(seq 1 ${maxDepth}); do cmd=$(ps -o command= -p $currentpid 2>/dev/null); if [ -n "$cmd" ]; then printf '%s\\0' "$cmd"; fi; ppid=$(ps -o ppid= -p $currentpid 2>/dev/null | tr -d ' '); if [ -z "$ppid" ] || [ "$ppid" = "0" ] || [ "$ppid" = "1" ]; then break; fi; currentpid=$ppid; done`, result = await execFileNoThrowWithCwd("sh", ["-c", script], {
    timeout: 3000
  });
  if (result.code !== 0 || !result.stdout?.trim())
    return [];
  return result.stdout.split("\x00").filter(Boolean);
}
var init_genericProcessUtils = __esm(() => {
  init_execFileNoThrow();
});
