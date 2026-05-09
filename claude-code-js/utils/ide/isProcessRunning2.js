// function: isProcessRunning2
function isProcessRunning2(pid) {
  try {
    return process.kill(pid, 0), !0;
  } catch {
    return !1;
  }
}
