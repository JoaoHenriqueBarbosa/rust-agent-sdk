// function: resolveDeepestExistingAncestorSync
function resolveDeepestExistingAncestorSync(fs2, absolutePath) {
  let dir = absolutePath, segments = [];
  while (dir !== nodePath.dirname(dir)) {
    let st;
    try {
      st = fs2.lstatSync(dir);
    } catch {
      segments.unshift(nodePath.basename(dir)), dir = nodePath.dirname(dir);
      continue;
    }
    if (st.isSymbolicLink())
      try {
        let resolved = fs2.realpathSync(dir);
        return segments.length === 0 ? resolved : nodePath.join(resolved, ...segments);
      } catch {
        let target = fs2.readlinkSync(dir), absTarget = nodePath.isAbsolute(target) ? target : nodePath.resolve(nodePath.dirname(dir), target);
        return segments.length === 0 ? absTarget : nodePath.join(absTarget, ...segments);
      }
    try {
      let resolved = fs2.realpathSync(dir);
      if (resolved !== dir)
        return segments.length === 0 ? resolved : nodePath.join(resolved, ...segments);
    } catch {}
    return;
  }
  return;
}
