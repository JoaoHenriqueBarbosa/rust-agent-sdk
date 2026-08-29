// Original: src/components/CustomSelect/select-input-option.tsx
function SelectInputOption(t0) {
  let $3 = import_compiler_runtime46.c(100), {
    option,
    isFocused,
    isSelected,
    shouldShowDownArrow,
    shouldShowUpArrow,
    maxIndexWidth,
    index,
    inputValue,
    onInputChange,
    onSubmit,
    onExit: onExit2,
    layout,
    children,
    showLabel: t1,
    onOpenEditor,
    resetCursorOnUpdate: t2,
    onImagePaste,
    pastedContents,
    onRemoveImage,
    imagesSelected,
    selectedImageIndex: t3,
    onImagesSelectedChange,
    onSelectedImageIndexChange
  } = t0, showLabelProp = t1 === void 0 ? !1 : t1, resetCursorOnUpdate = t2 === void 0 ? !1 : t2, selectedImageIndex = t3 === void 0 ? 0 : t3, t4;
  if ($3[0] !== pastedContents)
    t4 = pastedContents ? Object.values(pastedContents).filter(_temp6) : [], $3[0] = pastedContents, $3[1] = t4;
  else
    t4 = $3[1];
  let imageAttachments = t4, showLabel = showLabelProp || option.showLabelWithValue === !0, [cursorOffset, setCursorOffset] = import_react43.useState(inputValue.length), isUserEditing = import_react43.useRef(!1), t5;
  if ($3[2] !== inputValue.length || $3[3] !== isFocused || $3[4] !== resetCursorOnUpdate)
    t5 = () => {
      if (resetCursorOnUpdate && isFocused)
        if (isUserEditing.current)
          isUserEditing.current = !1;
        else
          setCursorOffset(inputValue.length);
    }, $3[2] = inputValue.length, $3[3] = isFocused, $3[4] = resetCursorOnUpdate, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== inputValue || $3[7] !== isFocused || $3[8] !== resetCursorOnUpdate)
    t6 = [resetCursorOnUpdate, isFocused, inputValue], $3[6] = inputValue, $3[7] = isFocused, $3[8] = resetCursorOnUpdate, $3[9] = t6;
  else
    t6 = $3[9];
  import_react43.useEffect(t5, t6);
  let t7;
  if ($3[10] !== inputValue || $3[11] !== onInputChange || $3[12] !== onOpenEditor)
    t7 = () => {
      onOpenEditor?.(inputValue, onInputChange);
    }, $3[10] = inputValue, $3[11] = onInputChange, $3[12] = onOpenEditor, $3[13] = t7;
  else
    t7 = $3[13];
  let t8 = isFocused && !!onOpenEditor, t9;
  if ($3[14] !== t8)
    t9 = {
      context: "Chat",
      isActive: t8
    }, $3[14] = t8, $3[15] = t9;
  else
    t9 = $3[15];
  useKeybinding("chat:externalEditor", t7, t9);
  let t10;
  if ($3[16] !== onImagePaste)
    t10 = () => {
      if (!onImagePaste)
        return;
      getImageFromClipboard().then((imageData) => {
        if (imageData)
          onImagePaste(imageData.base64, imageData.mediaType, void 0, imageData.dimensions);
      });
    }, $3[16] = onImagePaste, $3[17] = t10;
  else
    t10 = $3[17];
  let t11 = isFocused && !!onImagePaste, t12;
  if ($3[18] !== t11)
    t12 = {
      context: "Chat",
      isActive: t11
    }, $3[18] = t11, $3[19] = t12;
  else
    t12 = $3[19];
  useKeybinding("chat:imagePaste", t10, t12);
  let t13;
  if ($3[20] !== imageAttachments || $3[21] !== onRemoveImage)
    t13 = () => {
      if (imageAttachments.length > 0 && onRemoveImage)
        onRemoveImage(imageAttachments.at(-1).id);
    }, $3[20] = imageAttachments, $3[21] = onRemoveImage, $3[22] = t13;
  else
    t13 = $3[22];
  let t14 = isFocused && !imagesSelected && inputValue === "" && imageAttachments.length > 0 && !!onRemoveImage, t15;
  if ($3[23] !== t14)
    t15 = {
      context: "Attachments",
      isActive: t14
    }, $3[23] = t14, $3[24] = t15;
  else
    t15 = $3[24];
  useKeybinding("attachments:remove", t13, t15);
  let t16, t17;
  if ($3[25] !== imageAttachments.length || $3[26] !== onSelectedImageIndexChange || $3[27] !== selectedImageIndex)
    t16 = () => {
      if (imageAttachments.length > 1)
        onSelectedImageIndexChange?.((selectedImageIndex + 1) % imageAttachments.length);
    }, t17 = () => {
      if (imageAttachments.length > 1)
        onSelectedImageIndexChange?.((selectedImageIndex - 1 + imageAttachments.length) % imageAttachments.length);
    }, $3[25] = imageAttachments.length, $3[26] = onSelectedImageIndexChange, $3[27] = selectedImageIndex, $3[28] = t16, $3[29] = t17;
  else
    t16 = $3[28], t17 = $3[29];
  let t18;
  if ($3[30] !== imageAttachments || $3[31] !== onImagesSelectedChange || $3[32] !== onRemoveImage || $3[33] !== onSelectedImageIndexChange || $3[34] !== selectedImageIndex)
    t18 = () => {
      let img = imageAttachments[selectedImageIndex];
      if (img && onRemoveImage)
        if (onRemoveImage(img.id), imageAttachments.length <= 1)
          onImagesSelectedChange?.(!1);
        else
          onSelectedImageIndexChange?.(Math.min(selectedImageIndex, imageAttachments.length - 2));
    }, $3[30] = imageAttachments, $3[31] = onImagesSelectedChange, $3[32] = onRemoveImage, $3[33] = onSelectedImageIndexChange, $3[34] = selectedImageIndex, $3[35] = t18;
  else
    t18 = $3[35];
  let t19;
  if ($3[36] !== onImagesSelectedChange)
    t19 = () => {
      onImagesSelectedChange?.(!1);
    }, $3[36] = onImagesSelectedChange, $3[37] = t19;
  else
    t19 = $3[37];
  let t20;
  if ($3[38] !== t16 || $3[39] !== t17 || $3[40] !== t18 || $3[41] !== t19)
    t20 = {
      "attachments:next": t16,
      "attachments:previous": t17,
      "attachments:remove": t18,
      "attachments:exit": t19
    }, $3[38] = t16, $3[39] = t17, $3[40] = t18, $3[41] = t19, $3[42] = t20;
  else
    t20 = $3[42];
  let t21 = isFocused && !!imagesSelected, t22;
  if ($3[43] !== t21)
    t22 = {
      context: "Attachments",
      isActive: t21
    }, $3[43] = t21, $3[44] = t22;
  else
    t22 = $3[44];
  useKeybindings(t20, t22);
  let t23;
  if ($3[45] !== onImagesSelectedChange)
    t23 = (_input, key2) => {
      if (key2.upArrow)
        onImagesSelectedChange?.(!1);
    }, $3[45] = onImagesSelectedChange, $3[46] = t23;
  else
    t23 = $3[46];
  let t24 = isFocused && !!imagesSelected, t25;
  if ($3[47] !== t24)
    t25 = {
      isActive: t24
    }, $3[47] = t24, $3[48] = t25;
  else
    t25 = $3[48];
  use_input_default(t23, t25);
  let t26, t27;
  if ($3[49] !== imagesSelected || $3[50] !== isFocused || $3[51] !== onImagesSelectedChange)
    t26 = () => {
      if (!isFocused && imagesSelected)
        onImagesSelectedChange?.(!1);
    }, t27 = [isFocused, imagesSelected, onImagesSelectedChange], $3[49] = imagesSelected, $3[50] = isFocused, $3[51] = onImagesSelectedChange, $3[52] = t26, $3[53] = t27;
  else
    t26 = $3[52], t27 = $3[53];
  import_react43.useEffect(t26, t27);
  let descriptionPaddingLeft = layout === "expanded" ? maxIndexWidth + 3 : maxIndexWidth + 4, t28 = layout === "compact" ? 0 : void 0, t29 = `${index}.`, t30;
  if ($3[54] !== maxIndexWidth || $3[55] !== t29)
    t30 = t29.padEnd(maxIndexWidth + 2), $3[54] = maxIndexWidth, $3[55] = t29, $3[56] = t30;
  else
    t30 = $3[56];
  let t31;
  if ($3[57] !== t30)
    t31 = /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t30
    }, void 0, !1, void 0, this), $3[57] = t30, $3[58] = t31;
  else
    t31 = $3[58];
  let t32;
  if ($3[59] !== cursorOffset || $3[60] !== imagesSelected || $3[61] !== inputValue || $3[62] !== isFocused || $3[63] !== onExit2 || $3[64] !== onImagePaste || $3[65] !== onInputChange || $3[66] !== onSubmit || $3[67] !== option || $3[68] !== showLabel)
    t32 = showLabel ? /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(jsx_dev_runtime52.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
          color: isFocused ? "suggestion" : void 0,
          children: option.label
        }, void 0, !1, void 0, this),
        isFocused ? /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(jsx_dev_runtime52.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
              color: "suggestion",
              children: option.labelValueSeparator ?? ", "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(TextInput, {
              value: inputValue,
              onChange: (value) => {
                isUserEditing.current = !0, onInputChange(value), option.onChange(value);
              },
              onSubmit,
              onExit: onExit2,
              placeholder: option.placeholder,
              focus: !imagesSelected,
              showCursor: !0,
              multiline: !0,
              cursorOffset,
              onChangeCursorOffset: setCursorOffset,
              columns: 80,
              onImagePaste,
              onPaste: (pastedText) => {
                isUserEditing.current = !0;
                let before = inputValue.slice(0, cursorOffset), after = inputValue.slice(cursorOffset), newValue = before + pastedText + after;
                onInputChange(newValue), option.onChange(newValue), setCursorOffset(before.length + pastedText.length);
              }
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this) : inputValue && /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
          children: [
            option.labelValueSeparator ?? ", ",
            inputValue
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this) : isFocused ? /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(TextInput, {
      value: inputValue,
      onChange: (value_0) => {
        isUserEditing.current = !0, onInputChange(value_0), option.onChange(value_0);
      },
      onSubmit,
      onExit: onExit2,
      placeholder: option.placeholder || (typeof option.label === "string" ? option.label : void 0),
      focus: !imagesSelected,
      showCursor: !0,
      multiline: !0,
      cursorOffset,
      onChangeCursorOffset: setCursorOffset,
      columns: 80,
      onImagePaste,
      onPaste: (pastedText_0) => {
        isUserEditing.current = !0;
        let before_0 = inputValue.slice(0, cursorOffset), after_0 = inputValue.slice(cursorOffset), newValue_0 = before_0 + pastedText_0 + after_0;
        onInputChange(newValue_0), option.onChange(newValue_0), setCursorOffset(before_0.length + pastedText_0.length);
      }
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
      color: inputValue ? void 0 : "inactive",
      children: inputValue || option.placeholder || option.label
    }, void 0, !1, void 0, this), $3[59] = cursorOffset, $3[60] = imagesSelected, $3[61] = inputValue, $3[62] = isFocused, $3[63] = onExit2, $3[64] = onImagePaste, $3[65] = onInputChange, $3[66] = onSubmit, $3[67] = option, $3[68] = showLabel, $3[69] = t32;
  else
    t32 = $3[69];
  let t33;
  if ($3[70] !== children || $3[71] !== t28 || $3[72] !== t31 || $3[73] !== t32)
    t33 = /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      flexShrink: t28,
      children: [
        t31,
        children,
        t32
      ]
    }, void 0, !0, void 0, this), $3[70] = children, $3[71] = t28, $3[72] = t31, $3[73] = t32, $3[74] = t33;
  else
    t33 = $3[74];
  let t34;
  if ($3[75] !== isFocused || $3[76] !== isSelected || $3[77] !== shouldShowDownArrow || $3[78] !== shouldShowUpArrow || $3[79] !== t33)
    t34 = /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(SelectOption, {
      isFocused,
      isSelected,
      shouldShowDownArrow,
      shouldShowUpArrow,
      declareCursor: !1,
      children: t33
    }, void 0, !1, void 0, this), $3[75] = isFocused, $3[76] = isSelected, $3[77] = shouldShowDownArrow, $3[78] = shouldShowUpArrow, $3[79] = t33, $3[80] = t34;
  else
    t34 = $3[80];
  let t35;
  if ($3[81] !== descriptionPaddingLeft || $3[82] !== isFocused || $3[83] !== isSelected || $3[84] !== option.description || $3[85] !== option.dimDescription)
    t35 = option.description && /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedBox_default, {
      paddingLeft: descriptionPaddingLeft,
      children: /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
        dimColor: option.dimDescription !== !1,
        color: isSelected ? "success" : isFocused ? "suggestion" : void 0,
        children: option.description
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[81] = descriptionPaddingLeft, $3[82] = isFocused, $3[83] = isSelected, $3[84] = option.description, $3[85] = option.dimDescription, $3[86] = t35;
  else
    t35 = $3[86];
  let t36;
  if ($3[87] !== descriptionPaddingLeft || $3[88] !== imageAttachments || $3[89] !== imagesSelected || $3[90] !== isFocused || $3[91] !== selectedImageIndex)
    t36 = imageAttachments.length > 0 && /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      paddingLeft: descriptionPaddingLeft,
      children: [
        imageAttachments.map((img_0, idx) => /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ClickableImageRef, {
          imageId: img_0.id,
          isSelected: !!imagesSelected && idx === selectedImageIndex
        }, img_0.id, !1, void 0, this)),
        /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedBox_default, {
          flexGrow: 1,
          justifyContent: "flex-start",
          flexDirection: "row",
          children: /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
            dimColor: !0,
            children: imagesSelected ? /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(Byline, {
              children: [
                imageAttachments.length > 1 && /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(jsx_dev_runtime52.Fragment, {
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ConfigurableShortcutHint, {
                      action: "attachments:next",
                      context: "Attachments",
                      fallback: "\u2192",
                      description: "next"
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ConfigurableShortcutHint, {
                      action: "attachments:previous",
                      context: "Attachments",
                      fallback: "\u2190",
                      description: "prev"
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ConfigurableShortcutHint, {
                  action: "attachments:remove",
                  context: "Attachments",
                  fallback: "backspace",
                  description: "remove"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ConfigurableShortcutHint, {
                  action: "attachments:exit",
                  context: "Attachments",
                  fallback: "esc",
                  description: "cancel"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this) : isFocused ? "(\u2193 to select)" : null
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[87] = descriptionPaddingLeft, $3[88] = imageAttachments, $3[89] = imagesSelected, $3[90] = isFocused, $3[91] = selectedImageIndex, $3[92] = t36;
  else
    t36 = $3[92];
  let t37;
  if ($3[93] !== layout)
    t37 = layout === "expanded" && /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedText, {
      children: " "
    }, void 0, !1, void 0, this), $3[93] = layout, $3[94] = t37;
  else
    t37 = $3[94];
  let t38;
  if ($3[95] !== t34 || $3[96] !== t35 || $3[97] !== t36 || $3[98] !== t37)
    t38 = /* @__PURE__ */ jsx_dev_runtime52.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      flexShrink: 0,
      children: [
        t34,
        t35,
        t36,
        t37
      ]
    }, void 0, !0, void 0, this), $3[95] = t34, $3[96] = t35, $3[97] = t36, $3[98] = t37, $3[99] = t38;
  else
    t38 = $3[99];
  return t38;
}
function _temp6(c3) {
  return c3.type === "image";
}
var import_compiler_runtime46, import_react43, jsx_dev_runtime52;
var init_select_input_option = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_imagePaste();
  init_ClickableImageRef();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_TextInput();
  init_select_option();
  import_compiler_runtime46 = __toESM(require_react_compiler_runtime_development(), 1), import_react43 = __toESM(require_react_development(), 1), jsx_dev_runtime52 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
