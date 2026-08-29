// var: getRealtimeSignals
var getRealtimeSignals = () => {
  let length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal);
}, getRealtimeSignal = (value, index) => ({
  name: `SIGRT${index + 1}`,
  number: SIGRTMIN + index,
  action: "terminate",
  description: "Application-specific signal (realtime)",
  standard: "posix"
}), SIGRTMIN = 34, SIGRTMAX = 64;
