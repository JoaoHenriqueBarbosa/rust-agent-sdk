// function: usePrefix
function usePrefix({ status = "idle", theme }) {
  let [showLoader, setShowLoader] = useState9(!1), [tick, setTick] = useState9(0), { prefix, spinner } = makeTheme(theme);
  if (useEffect11(() => {
    if (status === "loading") {
      let tickInterval, inc = -1, delayTimeout = setTimeout(AsyncResource2.bind(() => {
        setShowLoader(!0), tickInterval = setInterval(AsyncResource2.bind(() => {
          inc = inc + 1, setTick(inc % spinner.frames.length);
        }), spinner.interval);
      }), 300);
      return () => {
        clearTimeout(delayTimeout), clearInterval(tickInterval);
      };
    } else
      setShowLoader(!1);
  }, [status]), showLoader)
    return spinner.frames[tick];
  return typeof prefix === "string" ? prefix : prefix[status === "loading" ? "idle" : status];
}
