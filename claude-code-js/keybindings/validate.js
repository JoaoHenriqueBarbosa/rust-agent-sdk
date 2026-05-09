// Original: src/keybindings/validate.ts
function isKeybindingBlock(obj) {
  if (typeof obj !== "object" || obj === null)
    return !1;
  let b = obj;
  return typeof b.context === "string" && typeof b.bindings === "object" && b.bindings !== null;
}
function isKeybindingBlockArray(arr) {
  return Array.isArray(arr) && arr.every(isKeybindingBlock);
}
function isValidContext(value) {
  return VALID_CONTEXTS.includes(value);
}
function validateKeystroke(keystroke) {
  let parts = keystroke.toLowerCase().split("+");
  for (let part of parts)
    if (!part.trim())
      return {
        type: "parse_error",
        severity: "error",
        message: `Empty key part in "${keystroke}"`,
        key: keystroke,
        suggestion: 'Remove extra "+" characters'
      };
  let parsed = parseKeystroke(keystroke);
  if (!parsed.key && !parsed.ctrl && !parsed.alt && !parsed.shift && !parsed.meta)
    return {
      type: "parse_error",
      severity: "error",
      message: `Could not parse keystroke "${keystroke}"`,
      key: keystroke
    };
  return null;
}
function validateBlock(block2, blockIndex) {
  let warnings = [];
  if (typeof block2 !== "object" || block2 === null)
    return warnings.push({
      type: "parse_error",
      severity: "error",
      message: `Keybinding block ${blockIndex + 1} is not an object`
    }), warnings;
  let b = block2, rawContext = b.context, contextName;
  if (typeof rawContext !== "string")
    warnings.push({
      type: "parse_error",
      severity: "error",
      message: `Keybinding block ${blockIndex + 1} missing "context" field`
    });
  else if (!isValidContext(rawContext))
    warnings.push({
      type: "invalid_context",
      severity: "error",
      message: `Unknown context "${rawContext}"`,
      context: rawContext,
      suggestion: `Valid contexts: ${VALID_CONTEXTS.join(", ")}`
    });
  else
    contextName = rawContext;
  if (typeof b.bindings !== "object" || b.bindings === null)
    return warnings.push({
      type: "parse_error",
      severity: "error",
      message: `Keybinding block ${blockIndex + 1} missing "bindings" field`
    }), warnings;
  let bindings = b.bindings;
  for (let [key2, action] of Object.entries(bindings)) {
    let keyError = validateKeystroke(key2);
    if (keyError)
      keyError.context = contextName, warnings.push(keyError);
    if (action !== null && typeof action !== "string")
      warnings.push({
        type: "invalid_action",
        severity: "error",
        message: `Invalid action for "${key2}": must be a string or null`,
        key: key2,
        context: contextName
      });
    else if (typeof action === "string" && action.startsWith("command:")) {
      if (!/^command:[a-zA-Z0-9:\-_]+$/.test(action))
        warnings.push({
          type: "invalid_action",
          severity: "warning",
          message: `Invalid command binding "${action}" for "${key2}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
          key: key2,
          context: contextName,
          action
        });
      if (contextName && contextName !== "Chat")
        warnings.push({
          type: "invalid_action",
          severity: "warning",
          message: `Command binding "${action}" must be in "Chat" context, not "${contextName}"`,
          key: key2,
          context: contextName,
          action,
          suggestion: 'Move this binding to a block with "context": "Chat"'
        });
    } else if (action === "voice:pushToTalk") {
      let ks = parseChord(key2)[0];
      if (ks && !ks.ctrl && !ks.alt && !ks.shift && !ks.meta && !ks.super && /^[a-z]$/.test(ks.key))
        warnings.push({
          type: "invalid_action",
          severity: "warning",
          message: `Binding "${key2}" to voice:pushToTalk prints into the input during warmup; use space or a modifier combo like meta+k`,
          key: key2,
          context: contextName,
          action
        });
    }
  }
  return warnings;
}
function checkDuplicateKeysInJson(jsonString) {
  let warnings = [], bindingsBlockPattern = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, blockMatch;
  while ((blockMatch = bindingsBlockPattern.exec(jsonString)) !== null) {
    let blockContent = blockMatch[1];
    if (!blockContent)
      continue;
    let context3 = jsonString.slice(0, blockMatch.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown", keyPattern = /"([^"]+)"\s*:/g, keysByName = /* @__PURE__ */ new Map, keyMatch;
    while ((keyMatch = keyPattern.exec(blockContent)) !== null) {
      let key2 = keyMatch[1];
      if (!key2)
        continue;
      let count3 = (keysByName.get(key2) ?? 0) + 1;
      if (keysByName.set(key2, count3), count3 === 2)
        warnings.push({
          type: "duplicate",
          severity: "warning",
          message: `Duplicate key "${key2}" in ${context3} bindings`,
          key: key2,
          context: context3,
          suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
        });
    }
  }
  return warnings;
}
function validateUserConfig2(userBlocks) {
  let warnings = [];
  if (!Array.isArray(userBlocks))
    return warnings.push({
      type: "parse_error",
      severity: "error",
      message: "keybindings.json must contain an array",
      suggestion: "Wrap your bindings in [ ]"
    }), warnings;
  for (let i5 = 0;i5 < userBlocks.length; i5++)
    warnings.push(...validateBlock(userBlocks[i5], i5));
  return warnings;
}
function checkDuplicates(blocks) {
  let warnings = [], seenByContext = /* @__PURE__ */ new Map;
  for (let block2 of blocks) {
    let contextMap = seenByContext.get(block2.context) ?? /* @__PURE__ */ new Map;
    seenByContext.set(block2.context, contextMap);
    for (let [key2, action] of Object.entries(block2.bindings)) {
      let normalizedKey = normalizeKeyForComparison(key2), existingAction = contextMap.get(normalizedKey);
      if (existingAction && existingAction !== action)
        warnings.push({
          type: "duplicate",
          severity: "warning",
          message: `Duplicate binding "${key2}" in ${block2.context} context`,
          key: key2,
          context: block2.context,
          action: action ?? "null (unbind)",
          suggestion: `Previously bound to "${existingAction}". Only the last binding will be used.`
        });
      contextMap.set(normalizedKey, action ?? "null");
    }
  }
  return warnings;
}
function checkReservedShortcuts(bindings) {
  let warnings = [], reserved = getReservedShortcuts();
  for (let binding of bindings) {
    let keyDisplay = chordToString(binding.chord), normalizedKey = normalizeKeyForComparison(keyDisplay);
    for (let res of reserved)
      if (normalizeKeyForComparison(res.key) === normalizedKey)
        warnings.push({
          type: "reserved",
          severity: res.severity,
          message: `"${keyDisplay}" may not work: ${res.reason}`,
          key: keyDisplay,
          context: binding.context,
          action: binding.action ?? void 0
        });
  }
  return warnings;
}
function getUserBindingsForValidation(userBlocks) {
  let bindings = [];
  for (let block2 of userBlocks)
    for (let [key2, action] of Object.entries(block2.bindings)) {
      let chord = key2.split(" ").map((k3) => parseKeystroke(k3));
      bindings.push({
        chord,
        action,
        context: block2.context
      });
    }
  return bindings;
}
function validateBindings(userBlocks, _parsedBindings) {
  let warnings = [];
  if (warnings.push(...validateUserConfig2(userBlocks)), isKeybindingBlockArray(userBlocks)) {
    warnings.push(...checkDuplicates(userBlocks));
    let userBindings = getUserBindingsForValidation(userBlocks);
    warnings.push(...checkReservedShortcuts(userBindings));
  }
  let seen = /* @__PURE__ */ new Set;
  return warnings.filter((w2) => {
    let key2 = `${w2.type}:${w2.key}:${w2.context}`;
    if (seen.has(key2))
      return !1;
    return seen.add(key2), !0;
  });
}
var VALID_CONTEXTS;
var init_validate3 = __esm(() => {
  init_reservedShortcuts();
  VALID_CONTEXTS = [
    "Global",
    "Chat",
    "Autocomplete",
    "Confirmation",
    "Help",
    "Transcript",
    "HistorySearch",
    "Task",
    "ThemePicker",
    "Settings",
    "Tabs",
    "Attachments",
    "Footer",
    "MessageSelector",
    "DiffDialog",
    "ModelPicker",
    "Select",
    "Plugin"
  ];
});
