// function: isScratchpadPath
function isScratchpadPath(absolutePath) {
  if (!isScratchpadEnabled())
    return !1;
  let scratchpadDir = getScratchpadDir(), normalizedPath = normalize15(absolutePath);
  return normalizedPath === scratchpadDir || normalizedPath.startsWith(scratchpadDir + sep32);
}
