// function: isFsInaccessible
function isFsInaccessible(e) {
  let code = getErrnoCode(e);
  return code === "ENOENT" || code === "EACCES" || code === "EPERM" || code === "ENOTDIR" || code === "ELOOP";
}
