// var: normalizeCwd
var normalizeCwd = (cwd2 = getDefaultCwd()) => {
  let cwdString = safeNormalizeFileUrl(cwd2, 'The "cwd" option');
  return path5.resolve(cwdString);
}, getDefaultCwd = () => {
  try {
    return process7.cwd();
  } catch (error41) {
    throw error41.message = `The current directory does not exist.
${error41.message}`, error41;
  }
}, fixCwdError = (originalMessage, cwd2) => {
  if (cwd2 === getDefaultCwd())
    return originalMessage;
  let cwdStat;
  try {
    cwdStat = statSync2(cwd2);
  } catch (error41) {
    return `The "cwd" option is invalid: ${cwd2}.
${error41.message}
${originalMessage}`;
  }
  if (!cwdStat.isDirectory())
    return `The "cwd" option is not a directory: ${cwd2}.
${originalMessage}`;
  return originalMessage;
};
