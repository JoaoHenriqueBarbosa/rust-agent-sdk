// function: isDocker
function isDocker() {
  if (isDockerCached === void 0)
    isDockerCached = hasDockerEnv() || hasDockerCGroup();
  return isDockerCached;
}
