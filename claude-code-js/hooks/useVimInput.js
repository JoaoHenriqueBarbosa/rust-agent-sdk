// Original: src/hooks/useVimInput.ts
function useVimInput(props) {
  let vimStateRef = import_react246.default.useRef(createInitialVimState()), [mode, setMode] = import_react246.useState("INSERT"), persistentRef = import_react246.default.useRef(createInitialPersistentState()), textInput = useTextInput({ ...props, inputFilter: void 0 }), { onModeChange, inputFilter } = props, switchToInsertMode = import_react246.useCallback((offset) => {
    if (offset !== void 0)
      textInput.setOffset(offset);
    vimStateRef.current = { mode: "INSERT", insertedText: "" }, setMode("INSERT"), onModeChange?.("INSERT");
  }, [textInput, onModeChange]), switchToNormalMode = import_react246.useCallback(() => {
    let current = vimStateRef.current;
    if (current.mode === "INSERT" && current.insertedText)
      persistentRef.current.lastChange = {
        type: "insert",
        text: current.insertedText
      };
    let offset = textInput.offset;
    if (offset > 0 && props.value[offset - 1] !== `
`)
      textInput.setOffset(offset - 1);
    vimStateRef.current = { mode: "NORMAL", command: { type: "idle" } }, setMode("NORMAL"), onModeChange?.("NORMAL");
  }, [onModeChange, textInput, props.value]);
  function createOperatorContext(cursor, isReplay = !1) {
    return {
      cursor,
      text: props.value,
      setText: (newText) => props.onChange(newText),
      setOffset: (offset) => textInput.setOffset(offset),
      enterInsert: (offset) => switchToInsertMode(offset),
      getRegister: () => persistentRef.current.register,
      setRegister: (content, linewise) => {
        persistentRef.current.register = content, persistentRef.current.registerIsLinewise = linewise;
      },
      getLastFind: () => persistentRef.current.lastFind,
      setLastFind: (type, char) => {
        persistentRef.current.lastFind = { type, char };
      },
      recordChange: isReplay ? () => {} : (change) => {
        persistentRef.current.lastChange = change;
      }
    };
  }
  function replayLastChange() {
    let change = persistentRef.current.lastChange;
    if (!change)
      return;
    let cursor = Cursor.fromText(props.value, props.columns, textInput.offset), ctx = createOperatorContext(cursor, !0);
    switch (change.type) {
      case "insert":
        if (change.text) {
          let newCursor = cursor.insert(change.text);
          props.onChange(newCursor.text), textInput.setOffset(newCursor.offset);
        }
        break;
      case "x":
        executeX(change.count, ctx);
        break;
      case "replace":
        executeReplace(change.char, change.count, ctx);
        break;
      case "toggleCase":
        executeToggleCase(change.count, ctx);
        break;
      case "indent":
        executeIndent(change.dir, change.count, ctx);
        break;
      case "join":
        executeJoin(change.count, ctx);
        break;
      case "openLine":
        executeOpenLine(change.direction, ctx);
        break;
      case "operator":
        executeOperatorMotion(change.op, change.motion, change.count, ctx);
        break;
      case "operatorFind":
        executeOperatorFind(change.op, change.find, change.char, change.count, ctx);
        break;
      case "operatorTextObj":
        executeOperatorTextObj(change.op, change.scope, change.objType, change.count, ctx);
        break;
    }
  }
  function handleVimInput(rawInput, key3) {
    let state4 = vimStateRef.current, filtered = inputFilter ? inputFilter(rawInput, key3) : rawInput, input = state4.mode === "INSERT" ? filtered : rawInput, cursor = Cursor.fromText(props.value, props.columns, textInput.offset);
    if (key3.ctrl) {
      textInput.onInput(input, key3);
      return;
    }
    if (key3.escape && state4.mode === "INSERT") {
      switchToNormalMode();
      return;
    }
    if (key3.escape && state4.mode === "NORMAL") {
      vimStateRef.current = { mode: "NORMAL", command: { type: "idle" } };
      return;
    }
    if (key3.return) {
      textInput.onInput(input, key3);
      return;
    }
    if (state4.mode === "INSERT") {
      if (key3.backspace || key3.delete) {
        if (state4.insertedText.length > 0)
          vimStateRef.current = {
            mode: "INSERT",
            insertedText: state4.insertedText.slice(0, -(lastGrapheme(state4.insertedText).length || 1))
          };
      } else
        vimStateRef.current = {
          mode: "INSERT",
          insertedText: state4.insertedText + input
        };
      textInput.onInput(input, key3);
      return;
    }
    if (state4.mode !== "NORMAL")
      return;
    if (state4.command.type === "idle" && (key3.upArrow || key3.downArrow || key3.leftArrow || key3.rightArrow)) {
      textInput.onInput(input, key3);
      return;
    }
    let ctx = {
      ...createOperatorContext(cursor, !1),
      onUndo: props.onUndo,
      onDotRepeat: replayLastChange
    }, expectsMotion = state4.command.type === "idle" || state4.command.type === "count" || state4.command.type === "operator" || state4.command.type === "operatorCount", vimInput = input;
    if (key3.leftArrow)
      vimInput = "h";
    else if (key3.rightArrow)
      vimInput = "l";
    else if (key3.upArrow)
      vimInput = "k";
    else if (key3.downArrow)
      vimInput = "j";
    else if (expectsMotion && key3.backspace)
      vimInput = "h";
    else if (expectsMotion && state4.command.type !== "count" && key3.delete)
      vimInput = "x";
    let result = transition(state4.command, vimInput, ctx);
    if (result.execute)
      result.execute();
    if (vimStateRef.current.mode === "NORMAL") {
      if (result.next)
        vimStateRef.current = { mode: "NORMAL", command: result.next };
      else if (result.execute)
        vimStateRef.current = { mode: "NORMAL", command: { type: "idle" } };
    }
    if (input === "?" && state4.mode === "NORMAL" && state4.command.type === "idle")
      props.onChange("?");
  }
  let setModeExternal = import_react246.useCallback((newMode) => {
    if (newMode === "INSERT")
      vimStateRef.current = { mode: "INSERT", insertedText: "" };
    else
      vimStateRef.current = { mode: "NORMAL", command: { type: "idle" } };
    setMode(newMode), onModeChange?.(newMode);
  }, [onModeChange]);
  return {
    ...textInput,
    onInput: handleVimInput,
    mode,
    setMode: setModeExternal
  };
}
var import_react246;
var init_useVimInput = __esm(() => {
  init_Cursor();
  init_intl();
  init_operators();
  init_transitions();
  init_types24();
  init_useTextInput();
  import_react246 = __toESM(require_react_development(), 1);
});
