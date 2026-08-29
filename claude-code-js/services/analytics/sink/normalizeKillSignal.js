// var: normalizeKillSignal
var normalizeKillSignal = (killSignal) => {
  if (killSignal === 0)
    throw TypeError("Invalid option `killSignal`: 0 cannot be used.");
  return normalizeSignal2(killSignal, "option `killSignal`");
}, normalizeSignalArgument = (signal) => signal === 0 ? signal : normalizeSignal2(signal, "`subprocess.kill()`'s argument"), normalizeSignal2 = (signalNameOrInteger, optionName) => {
  if (Number.isInteger(signalNameOrInteger))
    return normalizeSignalInteger(signalNameOrInteger, optionName);
  if (typeof signalNameOrInteger === "string")
    return normalizeSignalName(signalNameOrInteger, optionName);
  throw TypeError(`Invalid ${optionName} ${String(signalNameOrInteger)}: it must be a string or an integer.
${getAvailableSignals()}`);
}, normalizeSignalInteger = (signalInteger, optionName) => {
  if (signalsIntegerToName.has(signalInteger))
    return signalsIntegerToName.get(signalInteger);
  throw TypeError(`Invalid ${optionName} ${signalInteger}: this signal integer does not exist.
${getAvailableSignals()}`);
}, getSignalsIntegerToName = () => new Map(Object.entries(constants3.signals).reverse().map(([signalName, signalInteger]) => [signalInteger, signalName])), signalsIntegerToName, normalizeSignalName = (signalName, optionName) => {
  if (signalName in constants3.signals)
    return signalName;
  if (signalName.toUpperCase() in constants3.signals)
    throw TypeError(`Invalid ${optionName} '${signalName}': please rename it to '${signalName.toUpperCase()}'.`);
  throw TypeError(`Invalid ${optionName} '${signalName}': this signal name does not exist.
${getAvailableSignals()}`);
}, getAvailableSignals = () => `Available signal names: ${getAvailableSignalNames()}.
