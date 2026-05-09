// Original: src/commands/plugin/PluginOptionsDialog.tsx
function buildFinalValues(fields, collected, configSchema, initialValues) {
  let finalValues = {};
  for (let fieldKey of fields) {
    let schema5 = configSchema[fieldKey], value = collected[fieldKey] ?? "";
    if (schema5?.sensitive === !0 && value === "" && initialValues?.[fieldKey] !== void 0)
      continue;
    if (schema5?.type === "number") {
      if (value.trim() === "")
        continue;
      let num = Number(value);
      finalValues[fieldKey] = Number.isNaN(num) ? value : num;
    } else if (schema5?.type === "boolean")
      finalValues[fieldKey] = isEnvTruthy(value);
    else
      finalValues[fieldKey] = value;
  }
  return finalValues;
}
function PluginOptionsDialog(t0) {
  let $3 = import_compiler_runtime186.c(70), {
    title,
    subtitle,
    configSchema,
    initialValues,
    onSave,
    onCancel
  } = t0, t1;
  if ($3[0] !== configSchema)
    t1 = Object.keys(configSchema), $3[0] = configSchema, $3[1] = t1;
  else
    t1 = $3[1];
  let fields = t1, t2;
  if ($3[2] !== configSchema || $3[3] !== initialValues)
    t2 = (key3) => {
      if (configSchema[key3]?.sensitive === !0)
        return "";
      let v2 = initialValues?.[key3];
      return v2 === void 0 ? "" : String(v2);
    }, $3[2] = configSchema, $3[3] = initialValues, $3[4] = t2;
  else
    t2 = $3[4];
  let initialFor = t2, [currentFieldIndex, setCurrentFieldIndex] = import_react132.useState(0), t3;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {}, $3[5] = t3;
  else
    t3 = $3[5];
  let [values3, setValues] = import_react132.useState(t3), t4;
  if ($3[6] !== fields[0] || $3[7] !== initialFor)
    t4 = () => fields[0] ? initialFor(fields[0]) : "", $3[6] = fields[0], $3[7] = initialFor, $3[8] = t4;
  else
    t4 = $3[8];
  let [currentInput, setCurrentInput] = import_react132.useState(t4), currentField = fields[currentFieldIndex], fieldSchema = currentField ? configSchema[currentField] : null, t5;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      context: "Settings"
    }, $3[9] = t5;
  else
    t5 = $3[9];
  useKeybinding("confirm:no", onCancel, t5);
  let t6;
  if ($3[10] !== currentField || $3[11] !== currentFieldIndex || $3[12] !== currentInput || $3[13] !== fields || $3[14] !== initialFor)
    t6 = () => {
      if (currentFieldIndex < fields.length - 1 && currentField) {
        setValues((prev) => ({
          ...prev,
          [currentField]: currentInput
        })), setCurrentFieldIndex(_temp108);
        let nextKey = fields[currentFieldIndex + 1];
        setCurrentInput(nextKey ? initialFor(nextKey) : "");
      }
    }, $3[10] = currentField, $3[11] = currentFieldIndex, $3[12] = currentInput, $3[13] = fields, $3[14] = initialFor, $3[15] = t6;
  else
    t6 = $3[15];
  let handleNextField = t6, t7;
  if ($3[16] !== configSchema || $3[17] !== currentField || $3[18] !== currentFieldIndex || $3[19] !== currentInput || $3[20] !== fields || $3[21] !== initialFor || $3[22] !== initialValues || $3[23] !== onSave || $3[24] !== values3)
    t7 = () => {
      if (!currentField)
        return;
      let newValues = {
        ...values3,
        [currentField]: currentInput
      };
      if (currentFieldIndex === fields.length - 1)
        onSave(buildFinalValues(fields, newValues, configSchema, initialValues));
      else {
        setValues(newValues), setCurrentFieldIndex(_temp238);
        let nextKey_0 = fields[currentFieldIndex + 1];
        setCurrentInput(nextKey_0 ? initialFor(nextKey_0) : "");
      }
    }, $3[16] = configSchema, $3[17] = currentField, $3[18] = currentFieldIndex, $3[19] = currentInput, $3[20] = fields, $3[21] = initialFor, $3[22] = initialValues, $3[23] = onSave, $3[24] = values3, $3[25] = t7;
  else
    t7 = $3[25];
  let handleConfirm = t7, t8;
  if ($3[26] !== handleConfirm || $3[27] !== handleNextField)
    t8 = {
      "confirm:nextField": handleNextField,
      "confirm:yes": handleConfirm
    }, $3[26] = handleConfirm, $3[27] = handleNextField, $3[28] = t8;
  else
    t8 = $3[28];
  let t9;
  if ($3[29] === Symbol.for("react.memo_cache_sentinel"))
    t9 = {
      context: "Confirmation"
    }, $3[29] = t9;
  else
    t9 = $3[29];
  useKeybindings(t8, t9);
  let t10;
  if ($3[30] === Symbol.for("react.memo_cache_sentinel"))
    t10 = (char, key_0) => {
      if (key_0.backspace || key_0.delete) {
        setCurrentInput(_temp326);
        return;
      }
      if (char && !key_0.ctrl && !key_0.meta && !key_0.tab && !key_0.return)
        setCurrentInput((prev_3) => prev_3 + char);
    }, $3[30] = t10;
  else
    t10 = $3[30];
  if (use_input_default(t10), !fieldSchema || !currentField)
    return null;
  let isSensitive = fieldSchema.sensitive === !0, isRequired = fieldSchema.required === !0, t11;
  if ($3[31] !== currentInput || $3[32] !== isSensitive)
    t11 = isSensitive ? "*".repeat(stringWidth(currentInput)) : currentInput, $3[31] = currentInput, $3[32] = isSensitive, $3[33] = t11;
  else
    t11 = $3[33];
  let displayValue = t11, t12 = fieldSchema.title || currentField, t13;
  if ($3[34] !== isRequired)
    t13 = isRequired && /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      color: "error",
      children: " *"
    }, void 0, !1, void 0, this), $3[34] = isRequired, $3[35] = t13;
  else
    t13 = $3[35];
  let t14;
  if ($3[36] !== t12 || $3[37] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      bold: !0,
      children: [
        t12,
        t13
      ]
    }, void 0, !0, void 0, this), $3[36] = t12, $3[37] = t13, $3[38] = t14;
  else
    t14 = $3[38];
  let t15;
  if ($3[39] !== fieldSchema.description)
    t15 = fieldSchema.description && /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      dimColor: !0,
      children: fieldSchema.description
    }, void 0, !1, void 0, this), $3[39] = fieldSchema.description, $3[40] = t15;
  else
    t15 = $3[40];
  let t16;
  if ($3[41] === Symbol.for("react.memo_cache_sentinel"))
    t16 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      children: [
        figures_default.pointerSmall,
        " "
      ]
    }, void 0, !0, void 0, this), $3[41] = t16;
  else
    t16 = $3[41];
  let t17;
  if ($3[42] !== displayValue)
    t17 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      children: displayValue
    }, void 0, !1, void 0, this), $3[42] = displayValue, $3[43] = t17;
  else
    t17 = $3[43];
  let t18;
  if ($3[44] === Symbol.for("react.memo_cache_sentinel"))
    t18 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      children: "\u2588"
    }, void 0, !1, void 0, this), $3[44] = t18;
  else
    t18 = $3[44];
  let t19;
  if ($3[45] !== t17)
    t19 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: [
        t16,
        t17,
        t18
      ]
    }, void 0, !0, void 0, this), $3[45] = t17, $3[46] = t19;
  else
    t19 = $3[46];
  let t20;
  if ($3[47] !== t14 || $3[48] !== t15 || $3[49] !== t19)
    t20 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t14,
        t15,
        t19
      ]
    }, void 0, !0, void 0, this), $3[47] = t14, $3[48] = t15, $3[49] = t19, $3[50] = t20;
  else
    t20 = $3[50];
  let t21 = currentFieldIndex + 1, t22;
  if ($3[51] !== fields.length || $3[52] !== t21)
    t22 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Field ",
        t21,
        " of ",
        fields.length
      ]
    }, void 0, !0, void 0, this), $3[51] = fields.length, $3[52] = t21, $3[53] = t22;
  else
    t22 = $3[53];
  let t23;
  if ($3[54] !== currentFieldIndex || $3[55] !== fields.length)
    t23 = currentFieldIndex < fields.length - 1 && /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Tab: Next field \xB7 Enter: Save and continue"
    }, void 0, !1, void 0, this), $3[54] = currentFieldIndex, $3[55] = fields.length, $3[56] = t23;
  else
    t23 = $3[56];
  let t24;
  if ($3[57] !== currentFieldIndex || $3[58] !== fields.length)
    t24 = currentFieldIndex === fields.length - 1 && /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Enter: Save configuration"
    }, void 0, !1, void 0, this), $3[57] = currentFieldIndex, $3[58] = fields.length, $3[59] = t24;
  else
    t24 = $3[59];
  let t25;
  if ($3[60] !== t22 || $3[61] !== t23 || $3[62] !== t24)
    t25 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t22,
        t23,
        t24
      ]
    }, void 0, !0, void 0, this), $3[60] = t22, $3[61] = t23, $3[62] = t24, $3[63] = t25;
  else
    t25 = $3[63];
  let t26;
  if ($3[64] !== onCancel || $3[65] !== subtitle || $3[66] !== t20 || $3[67] !== t25 || $3[68] !== title)
    t26 = /* @__PURE__ */ jsx_dev_runtime234.jsxDEV(Dialog, {
      title,
      subtitle,
      onCancel,
      isCancelActive: !1,
      children: [
        t20,
        t25
      ]
    }, void 0, !0, void 0, this), $3[64] = onCancel, $3[65] = subtitle, $3[66] = t20, $3[67] = t25, $3[68] = title, $3[69] = t26;
  else
    t26 = $3[69];
  return t26;
}
function _temp326(prev_2) {
  return prev_2.slice(0, -1);
}
function _temp238(prev_1) {
  return prev_1 + 1;
}
function _temp108(prev_0) {
  return prev_0 + 1;
}
var import_compiler_runtime186, import_react132, jsx_dev_runtime234;
var init_PluginOptionsDialog = __esm(() => {
  init_figures();
  init_Dialog();
  init_stringWidth();
  init_ink2();
  init_useKeybinding();
  init_envUtils();
  import_compiler_runtime186 = __toESM(require_react_compiler_runtime_development(), 1), import_react132 = __toESM(require_react_development(), 1), jsx_dev_runtime234 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
