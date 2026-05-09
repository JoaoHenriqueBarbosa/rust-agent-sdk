// Original: src/components/CustomSelect/use-select-input.ts
var import_react47, useSelectInput = ({
  isDisabled = !1,
  disableSelection = !1,
  state: state3,
  options: options2,
  isMultiSelect = !1,
  onUpFromFirstItem,
  onDownFromLastItem,
  onInputModeToggle,
  inputValues,
  imagesSelected = !1,
  onEnterImageSelection
}) => {
  useRegisterOverlay("select", !!state3.onCancel);
  let isInInput = import_react47.useMemo(() => {
    return options2.find((opt) => opt.value === state3.focusedValue)?.type === "input";
  }, [options2, state3.focusedValue]), keybindingHandlers = import_react47.useMemo(() => {
    let handlers = {};
    if (!isInInput)
      handlers["select:next"] = () => {
        if (onDownFromLastItem) {
          let lastOption = options2[options2.length - 1];
          if (lastOption && state3.focusedValue === lastOption.value) {
            onDownFromLastItem();
            return;
          }
        }
        state3.focusNextOption();
      }, handlers["select:previous"] = () => {
        if (onUpFromFirstItem && state3.visibleFromIndex === 0) {
          let firstOption = options2[0];
          if (firstOption && state3.focusedValue === firstOption.value) {
            onUpFromFirstItem();
            return;
          }
        }
        state3.focusPreviousOption();
      }, handlers["select:accept"] = () => {
        if (disableSelection === !0)
          return;
        if (state3.focusedValue === void 0)
          return;
        if (options2.find((opt) => opt.value === state3.focusedValue)?.disabled === !0)
          return;
        state3.selectFocusedOption?.(), state3.onChange?.(state3.focusedValue);
      };
    if (state3.onCancel)
      handlers["select:cancel"] = () => {
        state3.onCancel();
      };
    return handlers;
  }, [
    options2,
    state3,
    onDownFromLastItem,
    onUpFromFirstItem,
    isInInput,
    disableSelection
  ]);
  useKeybindings(keybindingHandlers, {
    context: "Select",
    isActive: !isDisabled
  }), use_input_default((input, key2, event) => {
    let normalizedInput = normalizeFullWidthDigits(input), focusedOption = options2.find((opt) => opt.value === state3.focusedValue), currentIsInInput = focusedOption?.type === "input";
    if (key2.tab && onInputModeToggle && state3.focusedValue !== void 0) {
      onInputModeToggle(state3.focusedValue);
      return;
    }
    if (currentIsInInput) {
      if (imagesSelected)
        return;
      if (key2.downArrow && onEnterImageSelection?.()) {
        event.stopImmediatePropagation();
        return;
      }
      if (key2.downArrow || key2.ctrl && input === "n") {
        if (onDownFromLastItem) {
          let lastOption = options2[options2.length - 1];
          if (lastOption && state3.focusedValue === lastOption.value) {
            onDownFromLastItem(), event.stopImmediatePropagation();
            return;
          }
        }
        state3.focusNextOption(), event.stopImmediatePropagation();
        return;
      }
      if (key2.upArrow || key2.ctrl && input === "p") {
        if (onUpFromFirstItem && state3.visibleFromIndex === 0) {
          let firstOption = options2[0];
          if (firstOption && state3.focusedValue === firstOption.value) {
            onUpFromFirstItem(), event.stopImmediatePropagation();
            return;
          }
        }
        state3.focusPreviousOption(), event.stopImmediatePropagation();
        return;
      }
      return;
    }
    if (key2.pageDown)
      state3.focusNextPage();
    if (key2.pageUp)
      state3.focusPreviousPage();
    if (disableSelection !== !0) {
      if (isMultiSelect && normalizeFullWidthSpace(input) === " " && state3.focusedValue !== void 0) {
        if (focusedOption?.disabled !== !0)
          state3.selectFocusedOption?.(), state3.onChange?.(state3.focusedValue);
      }
      if (disableSelection !== "numeric" && /^[0-9]+$/.test(normalizedInput)) {
        let index = parseInt(normalizedInput) - 1;
        if (index >= 0 && index < state3.options.length) {
          let selectedOption = state3.options[index];
          if (selectedOption.disabled === !0)
            return;
          if (selectedOption.type === "input") {
            if ((inputValues?.get(selectedOption.value) ?? "").trim()) {
              state3.onChange?.(selectedOption.value);
              return;
            }
            if (selectedOption.allowEmptySubmitToCancel) {
              state3.onChange?.(selectedOption.value);
              return;
            }
            state3.focusOption(selectedOption.value);
            return;
          }
          state3.onChange?.(selectedOption.value);
          return;
        }
      }
    }
  }, { isActive: !isDisabled });
};
var init_use_select_input = __esm(() => {
  init_overlayContext();
  init_ink2();
  init_useKeybinding();
  import_react47 = __toESM(require_react_development(), 1);
});
