// function: isInsideContainer
function isInsideContainer() {
  if (cachedResult === void 0)
    cachedResult = hasContainerEnv() || isDocker();
  return cachedResult;
}
