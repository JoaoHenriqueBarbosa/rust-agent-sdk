// Original: src/keybindings/template.ts
function filterReservedShortcuts(blocks) {
  let reservedKeys = new Set(NON_REBINDABLE.map((r4) => normalizeKeyForComparison(r4.key)));
  return blocks.map((block2) => {
    let filteredBindings = {};
    for (let [key3, action2] of Object.entries(block2.bindings))
      if (!reservedKeys.has(normalizeKeyForComparison(key3)))
        filteredBindings[key3] = action2;
    return { context: block2.context, bindings: filteredBindings };
  }).filter((block2) => Object.keys(block2.bindings).length > 0);
}
function generateKeybindingsTemplate() {
  let config11 = {
    $schema: "https://www.schemastore.org/claude-code-keybindings.json",
    $docs: "https://code.claude.com/docs/en/keybindings",
    bindings: filterReservedShortcuts(DEFAULT_BINDINGS)
  };
  return jsonStringify(config11, null, 2) + `
`;
}
var init_template2 = __esm(() => {
  init_slowOperations();
  init_defaultBindings();
  init_reservedShortcuts();
});
