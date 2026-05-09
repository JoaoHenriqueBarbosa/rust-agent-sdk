// var: init_esm14
var init_esm14 = __esm(() => {
  init_esm12();
  esm_default4 = createPrompt((config9, done) => {
    let { required: required2, validate: validate3 = () => !0 } = config9, theme = makeTheme(config9.theme), [status, setStatus] = useState9("idle"), [defaultValue = "", setDefaultValue] = useState9(config9.default), [errorMsg, setError] = useState9(), [value, setValue] = useState9(""), prefix = usePrefix({ status, theme });
    useKeypress(async (key2, rl) => {
      if (status !== "idle")
        return;
      if (isEnterKey(key2)) {
        let answer = value || defaultValue;
        setStatus("loading");
        let isValid2 = required2 && !answer ? "You must provide a value" : await validate3(answer);
        if (isValid2 === !0)
          setValue(answer), setStatus("done"), done(answer);
        else
          rl.write(value), setError(isValid2 || "You must provide a valid value"), setStatus("idle");
      } else if (isBackspaceKey(key2) && !value)
        setDefaultValue(void 0);
      else if (key2.name === "tab" && !value)
        setDefaultValue(void 0), rl.clearLine(0), rl.write(defaultValue), setValue(defaultValue);
      else
        setValue(rl.line), setError(void 0);
    });
    let message = theme.style.message(config9.message, status), formattedValue = value;
    if (typeof config9.transformer === "function")
      formattedValue = config9.transformer(value, { isFinal: status === "done" });
    else if (status === "done")
      formattedValue = theme.style.answer(value);
    let defaultStr;
    if (defaultValue && status !== "done" && !value)
      defaultStr = theme.style.defaultAnswer(defaultValue);
    let error44 = "";
    if (errorMsg)
      error44 = theme.style.error(errorMsg);
    return [
      [prefix, message, defaultStr, formattedValue].filter((v2) => v2 !== void 0).join(" "),
      error44
    ];
  });
});
