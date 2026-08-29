// var: init_esm15
var init_esm15 = __esm(() => {
  init_esm12();
  init_esm11();
  import_yoctocolors_cjs3 = __toESM(require_yoctocolors_cjs(), 1), import_ansi_escapes2 = __toESM(require_ansi_escapes2(), 1), selectTheme = {
    icon: { cursor: esm_default2.pointer },
    style: {
      disabled: (text2) => import_yoctocolors_cjs3.default.dim(`- ${text2}`),
      description: (text2) => import_yoctocolors_cjs3.default.cyan(text2)
    },
    helpMode: "auto"
  };
  esm_default5 = createPrompt((config9, done) => {
    let { loop = !0, pageSize = 7 } = config9, firstRender = useRef7(!0), theme = makeTheme(selectTheme, config9.theme), [status, setStatus] = useState9("idle"), prefix = usePrefix({ status, theme }), searchTimeoutRef = useRef7(), items = useMemo7(() => normalizeChoices(config9.choices), [config9.choices]), bounds = useMemo7(() => {
      let first = items.findIndex(isSelectable), last2 = items.findLastIndex(isSelectable);
      if (first < 0)
        throw new ValidationError("[select prompt] No selectable choices. All choices are disabled.");
      return { first, last: last2 };
    }, [items]), defaultItemIndex = useMemo7(() => {
      if (!("default" in config9))
        return -1;
      return items.findIndex((item) => isSelectable(item) && item.value === config9.default);
    }, [config9.default, items]), [active, setActive] = useState9(defaultItemIndex === -1 ? bounds.first : defaultItemIndex), selectedChoice = items[active];
    useKeypress((key2, rl) => {
      if (clearTimeout(searchTimeoutRef.current), isEnterKey(key2))
        setStatus("done"), done(selectedChoice.value);
      else if (isUpKey(key2) || isDownKey(key2)) {
        if (rl.clearLine(0), loop || isUpKey(key2) && active !== bounds.first || isDownKey(key2) && active !== bounds.last) {
          let offset = isUpKey(key2) ? -1 : 1, next = active;
          do
            next = (next + offset + items.length) % items.length;
          while (!isSelectable(items[next]));
          setActive(next);
        }
      } else if (isNumberKey(key2)) {
        rl.clearLine(0);
        let position = Number(key2.name) - 1, item = items[position];
        if (item != null && isSelectable(item))
          setActive(position);
      } else if (isBackspaceKey(key2))
        rl.clearLine(0);
      else {
        let searchTerm = rl.line.toLowerCase(), matchIndex = items.findIndex((item) => {
          if (Separator.isSeparator(item) || !isSelectable(item))
            return !1;
          return item.name.toLowerCase().startsWith(searchTerm);
        });
        if (matchIndex >= 0)
          setActive(matchIndex);
        searchTimeoutRef.current = setTimeout(() => {
          rl.clearLine(0);
        }, 700);
      }
    }), useEffect11(() => () => {
      clearTimeout(searchTimeoutRef.current);
    }, []);
    let message = theme.style.message(config9.message, status), helpTipTop = "", helpTipBottom = "";
    if (theme.helpMode === "always" || theme.helpMode === "auto" && firstRender.current)
      if (firstRender.current = !1, items.length > pageSize)
        helpTipBottom = `
${theme.style.help("(Use arrow keys to reveal more choices)")}`;
      else
        helpTipTop = theme.style.help("(Use arrow keys)");
    let page = usePagination({
      items,
      active,
      renderItem({ item, isActive }) {
        if (Separator.isSeparator(item))
          return ` ${item.separator}`;
        if (item.disabled) {
          let disabledLabel = typeof item.disabled === "string" ? item.disabled : "(disabled)";
          return theme.style.disabled(`${item.name} ${disabledLabel}`);
        }
        let color2 = isActive ? theme.style.highlight : (x3) => x3, cursor = isActive ? theme.icon.cursor : " ";
        return color2(`${cursor} ${item.name}`);
      },
      pageSize,
      loop
    });
    if (status === "done")
      return `${prefix} ${message} ${theme.style.answer(selectedChoice.short)}`;
    let choiceDescription = selectedChoice.description ? `
${theme.style.description(selectedChoice.description)}` : "";
    return `${[prefix, message, helpTipTop].filter(Boolean).join(" ")}
${page}${helpTipBottom}${choiceDescription}${import_ansi_escapes2.default.cursorHide}`;
  });
});
