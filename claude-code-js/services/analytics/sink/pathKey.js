// function: pathKey
function pathKey(options = {}) {
  let {
    env: env2 = process.env,
    platform: platform2 = process.platform
  } = options;
  if (platform2 !== "win32")
    return "PATH";
  return Object.keys(env2).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}
