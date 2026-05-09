// var: init_esm13
var init_esm13 = __esm(() => {
  init_esm12();
  esm_default3 = createPrompt((config9, done) => {
    let { transformer = (answer) => answer ? "yes" : "no" } = config9, [status, setStatus] = useState9("idle"), [value, setValue] = useState9(""), theme = makeTheme(config9.theme), prefix = usePrefix({ status, theme });
    useKeypress((key2, rl) => {
      if (isEnterKey(key2)) {
        let answer = config9.default !== !1;
        if (/^(y|yes)/i.test(value))
          answer = !0;
        else if (/^(n|no)/i.test(value))
          answer = !1;
        setValue(transformer(answer)), setStatus("done"), done(answer);
      } else
        setValue(rl.line);
    });
    let formattedValue = value, defaultValue = "";
    if (status === "done")
      formattedValue = theme.style.answer(value);
    else
      defaultValue = ` ${theme.style.defaultAnswer(config9.default === !1 ? "y/N" : "Y/n")}`;
    let message = theme.style.message(config9.message, status);
    return `${prefix} ${message}${defaultValue} ${formattedValue}`;
  });
});
