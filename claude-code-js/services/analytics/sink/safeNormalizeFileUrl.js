// var: safeNormalizeFileUrl
var safeNormalizeFileUrl = (file2, name) => {
  let fileString = normalizeFileUrl(normalizeDenoExecPath(file2));
  if (typeof fileString !== "string")
    throw TypeError(`${name} must be a string or a file URL: ${fileString}.`);
  return fileString;
}, normalizeDenoExecPath = (file2) => isDenoExecPath(file2) ? file2.toString() : file2, isDenoExecPath = (file2) => typeof file2 !== "string" && file2 && Object.getPrototypeOf(file2) === String.prototype, normalizeFileUrl = (file2) => file2 instanceof URL ? fileURLToPath(file2) : file2;
