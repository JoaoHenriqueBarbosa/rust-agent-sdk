// var: mergeOptions
var mergeOptions = (boundOptions, options) => {
  let newOptions = Object.fromEntries(Object.entries(options).map(([optionName, optionValue]) => [
    optionName,
    mergeOption(optionName, boundOptions[optionName], optionValue)
  ]));
  return { ...boundOptions, ...newOptions };
}, mergeOption = (optionName, boundOptionValue, optionValue) => {
  if (DEEP_OPTIONS.has(optionName) && isPlainObject2(boundOptionValue) && isPlainObject2(optionValue))
    return { ...boundOptionValue, ...optionValue };
  return optionValue;
}, DEEP_OPTIONS;
