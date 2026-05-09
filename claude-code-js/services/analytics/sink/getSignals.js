// var: getSignals
var getSignals = () => {
  let realtimeSignals = getRealtimeSignals();
  return [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
}, normalizeSignal = ({
  name,
  number: defaultNumber,
  description,
  action,
  forced = !1,
  standard
}) => {
  let {
    signals: { [name]: constantSignal }
  } = constants, supported = constantSignal !== void 0;
  return { name, number: supported ? constantSignal : defaultNumber, description, supported, action, forced, standard };
};
