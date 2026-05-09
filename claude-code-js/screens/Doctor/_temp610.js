// function: _temp610
function _temp610(diag10) {
  return (diag10.installationType === "native" ? getGcsDistTags : getNpmDistTags)().catch(_temp513);
}
