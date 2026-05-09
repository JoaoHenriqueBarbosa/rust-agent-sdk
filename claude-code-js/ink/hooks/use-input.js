// Original: src/ink/hooks/use-input.ts
var import_react19, useInput = (inputHandler, options = {}) => {
  let { setRawMode, internal_exitOnCtrlC, internal_eventEmitter } = use_stdin_default();
  import_react19.useLayoutEffect(() => {
    if (options.isActive === !1)
      return;
    return setRawMode(!0), () => {
      setRawMode(!1);
    };
  }, [options.isActive, setRawMode]);
  let handleData = useEventCallback((event) => {
    if (options.isActive === !1)
      return;
    let { input, key } = event;
    if (!(input === "c" && key.ctrl) || !internal_exitOnCtrlC)
      inputHandler(input, key, event);
  });
  import_react19.useEffect(() => {
    return internal_eventEmitter?.on("input", handleData), () => {
      internal_eventEmitter?.removeListener("input", handleData);
    };
  }, [internal_eventEmitter, handleData]);
}, use_input_default;
var init_use_input = __esm(() => {
  init_dist4();
  init_use_stdin();
  import_react19 = __toESM(require_react_development(), 1), use_input_default = useInput;
});
