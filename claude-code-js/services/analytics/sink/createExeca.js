// var: createExeca
var createExeca = (mapArguments, boundOptions, deepOptions, setBoundExeca) => {
  let createNested = (mapArguments2, boundOptions2, setBoundExeca2) => createExeca(mapArguments2, boundOptions2, deepOptions, setBoundExeca2), boundExeca = (...execaArguments) => callBoundExeca({
    mapArguments,
    deepOptions,
    boundOptions,
    setBoundExeca,
    createNested
  }, ...execaArguments);
  if (setBoundExeca !== void 0)
    setBoundExeca(boundExeca, createNested, boundOptions);
  return boundExeca;
}, callBoundExeca = ({ mapArguments, deepOptions = {}, boundOptions = {}, setBoundExeca, createNested }, firstArgument, ...nextArguments) => {
  if (isPlainObject2(firstArgument))
    return createNested(mapArguments, mergeOptions(boundOptions, firstArgument), setBoundExeca);
  let { file: file2, commandArguments, options, isSync } = parseArguments({
    mapArguments,
    firstArgument,
    nextArguments,
    deepOptions,
    boundOptions
  });
  return isSync ? execaCoreSync(file2, commandArguments, options) : execaCoreAsync(file2, commandArguments, options, createNested);
}, parseArguments = ({ mapArguments, firstArgument, nextArguments, deepOptions, boundOptions }) => {
  let callArguments = isTemplateString(firstArgument) ? parseTemplates(firstArgument, nextArguments) : [firstArgument, ...nextArguments], [initialFile, initialArguments, initialOptions] = normalizeParameters(...callArguments), mergedOptions = mergeOptions(mergeOptions(deepOptions, boundOptions), initialOptions), {
    file: file2 = initialFile,
    commandArguments = initialArguments,
    options = mergedOptions,
    isSync = !1
  } = mapArguments({ file: initialFile, commandArguments: initialArguments, options: mergedOptions });
  return {
    file: file2,
    commandArguments,
    options,
    isSync
  };
};
