// function: getErrnoPath
function getErrnoPath(e) {
  if (e && typeof e === "object" && "path" in e && typeof e.path === "string")
    return e.path;
  return;
}
