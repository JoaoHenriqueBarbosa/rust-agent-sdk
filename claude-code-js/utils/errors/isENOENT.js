// function: isENOENT
function isENOENT(e) {
  return getErrnoCode(e) === "ENOENT";
}
