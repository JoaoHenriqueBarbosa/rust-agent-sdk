// function: hasDockerCGroup
function hasDockerCGroup() {
  try {
    return fs4.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return !1;
  }
}
