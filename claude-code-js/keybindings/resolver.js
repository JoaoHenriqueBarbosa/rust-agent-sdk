// Original: src/keybindings/resolver.ts
function getBindingDisplayText(action, context3, bindings) {
  let binding = bindings.findLast((b) => b.action === action && b.context === context3);
  return binding ? chordToString(binding.chord) : void 0;
}
function buildKeystroke(input, key2) {
  let keyName2 = getKeyName(input, key2);
  if (!keyName2)
    return null;
  let effectiveMeta = key2.escape ? !1 : key2.meta;
  return {
    key: keyName2,
    ctrl: key2.ctrl,
    alt: effectiveMeta,
    shift: key2.shift,
    meta: effectiveMeta,
    super: key2.super
  };
}
function keystrokesEqual(a2, b) {
  return a2.key === b.key && a2.ctrl === b.ctrl && a2.shift === b.shift && (a2.alt || a2.meta) === (b.alt || b.meta) && a2.super === b.super;
}
function chordPrefixMatches(prefix, binding) {
  if (prefix.length >= binding.chord.length)
    return !1;
  for (let i5 = 0;i5 < prefix.length; i5++) {
    let prefixKey = prefix[i5], bindingKey = binding.chord[i5];
    if (!prefixKey || !bindingKey)
      return !1;
    if (!keystrokesEqual(prefixKey, bindingKey))
      return !1;
  }
  return !0;
}
function chordExactlyMatches(chord, binding) {
  if (chord.length !== binding.chord.length)
    return !1;
  for (let i5 = 0;i5 < chord.length; i5++) {
    let chordKey = chord[i5], bindingKey = binding.chord[i5];
    if (!chordKey || !bindingKey)
      return !1;
    if (!keystrokesEqual(chordKey, bindingKey))
      return !1;
  }
  return !0;
}
function resolveKeyWithChordState(input, key2, activeContexts, bindings, pending) {
  if (key2.escape && pending !== null)
    return { type: "chord_cancelled" };
  let currentKeystroke = buildKeystroke(input, key2);
  if (!currentKeystroke) {
    if (pending !== null)
      return { type: "chord_cancelled" };
    return { type: "none" };
  }
  let testChord = pending ? [...pending, currentKeystroke] : [currentKeystroke], ctxSet = new Set(activeContexts), contextBindings = bindings.filter((b) => ctxSet.has(b.context)), chordWinners = /* @__PURE__ */ new Map;
  for (let binding of contextBindings)
    if (binding.chord.length > testChord.length && chordPrefixMatches(testChord, binding))
      chordWinners.set(chordToString(binding.chord), binding.action);
  let hasLongerChords = !1;
  for (let action of chordWinners.values())
    if (action !== null) {
      hasLongerChords = !0;
      break;
    }
  if (hasLongerChords)
    return { type: "chord_started", pending: testChord };
  let exactMatch;
  for (let binding of contextBindings)
    if (chordExactlyMatches(testChord, binding))
      exactMatch = binding;
  if (exactMatch) {
    if (exactMatch.action === null)
      return { type: "unbound" };
    return { type: "match", action: exactMatch.action };
  }
  if (pending !== null)
    return { type: "chord_cancelled" };
  return { type: "none" };
}
var init_resolver = () => {};
