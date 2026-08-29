// function: settingsMergeCustomizer
function settingsMergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue) && Array.isArray(srcValue))
    return mergeArrays(objValue, srcValue);
  return;
}
