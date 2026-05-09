// function: getInstallationEnv
function getInstallationEnv() {
  if (getPlatform() === "linux")
    return {
      ...process.env,
      DISPLAY: ""
    };
  return;
}
