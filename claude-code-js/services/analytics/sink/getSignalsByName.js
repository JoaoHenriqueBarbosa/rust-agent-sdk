// var: getSignalsByName
var getSignalsByName = () => {
  let signals = getSignals();
  return Object.fromEntries(signals.map(getSignalByName));
}, getSignalByName = ({
  name,
  number: number4,
  description,
  supported,
  action,
  forced,
  standard
}) => [name, { name, number: number4, description, supported, action, forced, standard }], signalsByName, getSignalsByNumber = () => {
  let signals = getSignals(), length = SIGRTMAX + 1, signalsA = Array.from({ length }, (value, number4) => getSignalByNumber(number4, signals));
  return Object.assign({}, ...signalsA);
}, getSignalByNumber = (number4, signals) => {
  let signal = findSignalByNumber(number4, signals);
  if (signal === void 0)
    return {};
  let { name, description, supported, action, forced, standard } = signal;
  return {
    [number4]: {
      name,
      number: number4,
      description,
      supported,
      action,
      forced,
      standard
    }
  };
}, findSignalByNumber = (number4, signals) => {
  let signal = signals.find(({ name }) => constants2.signals[name] === number4);
  if (signal !== void 0)
    return signal;
  return signals.find((signalA) => signalA.number === number4);
}, signalsByNumber;
