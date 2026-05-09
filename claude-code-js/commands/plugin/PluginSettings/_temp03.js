// function: _temp03
function _temp03(s2) {
  let count4 = s2.plugins.errors.length;
  for (let m4 of s2.plugins.installationStatus.marketplaces)
    if (m4.status === "failed")
      count4++;
  return count4;
}
