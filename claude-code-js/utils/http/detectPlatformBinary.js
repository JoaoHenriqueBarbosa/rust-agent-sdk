// function: detectPlatformBinary
function detectPlatformBinary({ [platform2]: platformBinary }, { wsl }) {
  if (wsl && is_wsl_default)
    return detectArchBinary(wsl);
  if (!platformBinary)
    throw Error(`${platform2} is not supported`);
  return detectArchBinary(platformBinary);
}
