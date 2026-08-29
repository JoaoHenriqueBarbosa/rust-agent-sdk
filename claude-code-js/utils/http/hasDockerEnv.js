// function: hasDockerEnv
function hasDockerEnv() {
  try {
    return fs4.statSync("/.dockerenv"), !0;
  } catch {
    return !1;
  }
}
