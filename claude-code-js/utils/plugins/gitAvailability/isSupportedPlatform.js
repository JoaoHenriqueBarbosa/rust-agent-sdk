// function: isSupportedPlatform
function isSupportedPlatform() {
  let platform3 = getPlatform2();
  if (platform3 === "linux")
    return getWslVersion2() !== "1";
  return platform3 === "macos";
}
