// Original: src/skills/bundled/keybindings.ts
function generateContextsTable() {
  return markdownTable(["Context", "Description"], KEYBINDING_CONTEXTS.map((ctx) => [
    `\`${ctx}\``,
    KEYBINDING_CONTEXT_DESCRIPTIONS[ctx]
  ]));
}
function generateActionsTable() {
  let actionInfo = {};
  for (let block2 of DEFAULT_BINDINGS)
    for (let [key3, action2] of Object.entries(block2.bindings))
      if (action2) {
        if (!actionInfo[action2])
          actionInfo[action2] = { keys: [], context: block2.context };
        actionInfo[action2].keys.push(key3);
      }
  return markdownTable(["Action", "Default Key(s)", "Context"], KEYBINDING_ACTIONS.map((action2) => {
    let info = actionInfo[action2], keys3 = info ? info.keys.map((k3) => `\`${k3}\``).join(", ") : "(none)", context7 = info ? info.context : inferContextFromAction(action2);
    return [`\`${action2}\``, keys3, context7];
  }));
}
function inferContextFromAction(action2) {
  let prefix = action2.split(":")[0];
  return {
    app: "Global",
    history: "Global or Chat",
    chat: "Chat",
    autocomplete: "Autocomplete",
    confirm: "Confirmation",
    tabs: "Tabs",
    transcript: "Transcript",
    historySearch: "HistorySearch",
    task: "Task",
    theme: "ThemePicker",
    help: "Help",
    attachments: "Attachments",
    footer: "Footer",
    messageSelector: "MessageSelector",
    diff: "DiffDialog",
    modelPicker: "ModelPicker",
    select: "Select",
    permission: "Confirmation"
  }[prefix ?? ""] ?? "Unknown";
}
function generateReservedShortcuts() {
  let lines2 = [];
  lines2.push("### Non-rebindable (errors)");
  for (let s2 of NON_REBINDABLE)
    lines2.push(`- \`${s2.key}\` \u2014 ${s2.reason}`);
  lines2.push(""), lines2.push("### Terminal reserved (errors/warnings)");
  for (let s2 of TERMINAL_RESERVED)
    lines2.push(`- \`${s2.key}\` \u2014 ${s2.reason} (${s2.severity === "error" ? "will not work" : "may conflict"})`);
  lines2.push(""), lines2.push("### macOS reserved (errors)");
  for (let s2 of MACOS_RESERVED)
    lines2.push(`- \`${s2.key}\` \u2014 ${s2.reason}`);
  return lines2.join(`
`);
}
function registerKeybindingsSkill() {
  registerBundledSkill({
    name: "keybindings-help",
    description: 'Use when the user wants to customize keyboard shortcuts, rebind keys, add chord bindings, or modify ~/.claude/keybindings.json. Examples: "rebind ctrl+s", "add a chord shortcut", "change the submit key", "customize keybindings".',
    allowedTools: ["Read"],
    userInvocable: !1,
    isEnabled: isKeybindingCustomizationEnabled,
    async getPromptForCommand(args) {
      let contextsTable = generateContextsTable(), actionsTable = generateActionsTable(), reservedShortcuts = generateReservedShortcuts(), sections = [
        SECTION_INTRO,
        SECTION_FILE_FORMAT,
        SECTION_KEYSTROKE_SYNTAX,
        SECTION_UNBINDING,
        SECTION_INTERACTION,
        SECTION_COMMON_PATTERNS,
        SECTION_BEHAVIORAL_RULES,
        SECTION_DOCTOR,
        `## Reserved Shortcuts

${reservedShortcuts}`,
        `## Available Contexts

${contextsTable}`,
        `## Available Actions

${actionsTable}`
      ];
      if (args)
        sections.push(`## User Request

${args}`);
      return [{ type: "text", text: sections.join(`

`) }];
    }
  });
}
function markdownTable(headers, rows) {
  let separator = headers.map(() => "---");
  return [
    `| ${headers.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join(`
`);
}
var FILE_FORMAT_EXAMPLE, UNBIND_EXAMPLE, REBIND_EXAMPLE, CHORD_EXAMPLE, SECTION_INTRO, SECTION_FILE_FORMAT, SECTION_KEYSTROKE_SYNTAX, SECTION_UNBINDING, SECTION_INTERACTION, SECTION_COMMON_PATTERNS, SECTION_BEHAVIORAL_RULES, SECTION_DOCTOR;
var init_keybindings3 = __esm(() => {
  init_defaultBindings();
  init_loadUserBindings();
  init_reservedShortcuts();
  init_schema5();
  init_slowOperations();
  init_bundledSkills();
  FILE_FORMAT_EXAMPLE = {
    $schema: "https://www.schemastore.org/claude-code-keybindings.json",
    $docs: "https://code.claude.com/docs/en/keybindings",
    bindings: [
      {
        context: "Chat",
        bindings: {
          "ctrl+e": "chat:externalEditor"
        }
      }
    ]
  }, UNBIND_EXAMPLE = {
    context: "Chat",
    bindings: {
      "ctrl+s": null
    }
  }, REBIND_EXAMPLE = {
    context: "Chat",
    bindings: {
      "ctrl+g": null,
      "ctrl+e": "chat:externalEditor"
    }
  }, CHORD_EXAMPLE = {
    context: "Global",
    bindings: {
      "ctrl+k ctrl+t": "app:toggleTodos"
    }
  }, SECTION_INTRO = [
    "# Keybindings Skill",
    "",
    "Create or modify `~/.claude/keybindings.json` to customize keyboard shortcuts.",
    "",
    "## CRITICAL: Read Before Write",
    "",
    "**Always read `~/.claude/keybindings.json` first** (it may not exist yet). Merge changes with existing bindings \u2014 never replace the entire file.",
    "",
    "- Use **Edit** tool for modifications to existing files",
    "- Use **Write** tool only if the file does not exist yet"
  ].join(`
`), SECTION_FILE_FORMAT = [
    "## File Format",
    "",
    "```json",
    jsonStringify(FILE_FORMAT_EXAMPLE, null, 2),
    "```",
    "",
    "Always include the `$schema` and `$docs` fields."
  ].join(`
`), SECTION_KEYSTROKE_SYNTAX = [
    "## Keystroke Syntax",
    "",
    "**Modifiers** (combine with `+`):",
    "- `ctrl` (alias: `control`)",
    "- `alt` (aliases: `opt`, `option`) \u2014 note: `alt` and `meta` are identical in terminals",
    "- `shift`",
    "- `meta` (aliases: `cmd`, `command`)",
    "",
    "**Special keys**: `escape`/`esc`, `enter`/`return`, `tab`, `space`, `backspace`, `delete`, `up`, `down`, `left`, `right`",
    "",
    "**Chords**: Space-separated keystrokes, e.g. `ctrl+k ctrl+s` (1-second timeout between keystrokes)",
    "",
    "**Examples**: `ctrl+shift+p`, `alt+enter`, `ctrl+k ctrl+n`"
  ].join(`
`), SECTION_UNBINDING = [
    "## Unbinding Default Shortcuts",
    "",
    "Set a key to `null` to remove its default binding:",
    "",
    "```json",
    jsonStringify(UNBIND_EXAMPLE, null, 2),
    "```"
  ].join(`
`), SECTION_INTERACTION = [
    "## How User Bindings Interact with Defaults",
    "",
    "- User bindings are **additive** \u2014 they are appended after the default bindings",
    "- To **move** a binding to a different key: unbind the old key (`null`) AND add the new binding",
    "- A context only needs to appear in the user's file if they want to change something in that context"
  ].join(`
`), SECTION_COMMON_PATTERNS = [
    "## Common Patterns",
    "",
    "### Rebind a key",
    "To change the external editor shortcut from `ctrl+g` to `ctrl+e`:",
    "```json",
    jsonStringify(REBIND_EXAMPLE, null, 2),
    "```",
    "",
    "### Add a chord binding",
    "```json",
    jsonStringify(CHORD_EXAMPLE, null, 2),
    "```"
  ].join(`
`), SECTION_BEHAVIORAL_RULES = [
    "## Behavioral Rules",
    "",
    "1. Only include contexts the user wants to change (minimal overrides)",
    "2. Validate that actions and contexts are from the known lists below",
    "3. Warn the user proactively if they choose a key that conflicts with reserved shortcuts or common tools like tmux (`ctrl+b`) and screen (`ctrl+a`)",
    "4. When adding a new binding for an existing action, the new binding is additive (existing default still works unless explicitly unbound)",
    "5. To fully replace a default binding, unbind the old key AND add the new one"
  ].join(`
`), SECTION_DOCTOR = [
    "## Validation with /doctor",
    "",
    'The `/doctor` command includes a "Keybinding Configuration Issues" section that validates `~/.claude/keybindings.json`.',
    "",
    "### Common Issues and Fixes",
    "",
    markdownTable(["Issue", "Cause", "Fix"], [
      [
        '`keybindings.json must have a "bindings" array`',
        "Missing wrapper object",
        'Wrap bindings in `{ "bindings": [...] }`'
      ],
      [
        '`"bindings" must be an array`',
        "`bindings` is not an array",
        'Set `"bindings"` to an array: `[{ context: ..., bindings: ... }]`'
      ],
      [
        '`Unknown context "X"`',
        "Typo or invalid context name",
        "Use exact context names from the Available Contexts table"
      ],
      [
        '`Duplicate key "X" in Y bindings`',
        "Same key defined twice in one context",
        "Remove the duplicate; JSON uses only the last value"
      ],
      [
        '`"X" may not work: ...`',
        "Key conflicts with terminal/OS reserved shortcut",
        "Choose a different key (see Reserved Shortcuts section)"
      ],
      [
        '`Could not parse keystroke "X"`',
        "Invalid key syntax",
        "Check syntax: use `+` between modifiers, valid key names"
      ],
      [
        '`Invalid action for "X"`',
        "Action value is not a string or null",
        'Actions must be strings like `"app:help"` or `null` to unbind'
      ]
    ]),
    "",
    "### Example /doctor Output",
    "",
    "```",
    "Keybinding Configuration Issues",
    "Location: ~/.claude/keybindings.json",
    '  \u2514 [Error] Unknown context "chat"',
    "    \u2192 Valid contexts: Global, Chat, Autocomplete, ...",
    '  \u2514 [Warning] "ctrl+c" may not work: Terminal interrupt (SIGINT)',
    "```",
    "",
    "**Errors** prevent bindings from working and must be fixed. **Warnings** indicate potential conflicts but the binding may still work."
  ].join(`
`);
});
