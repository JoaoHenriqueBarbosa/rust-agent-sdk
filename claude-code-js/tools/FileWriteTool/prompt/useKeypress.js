// function: useKeypress
function useKeypress(userHandler) {
  let signal = useRef7(userHandler);
  signal.current = userHandler, useEffect11((rl) => {
    let ignore = !1, handler = withUpdates((_input, event) => {
      if (ignore)
        return;
      signal.current(event, rl);
    });
    return rl.input.on("keypress", handler), () => {
      ignore = !0, rl.input.removeListener("keypress", handler);
    };
  }, []);
}
