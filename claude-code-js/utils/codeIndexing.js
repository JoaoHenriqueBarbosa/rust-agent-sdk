// Original: src/utils/codeIndexing.ts
function detectCodeIndexingFromCommand(command12) {
  let trimmed = command12.trim(), firstWord = trimmed.split(/\s+/)[0]?.toLowerCase();
  if (!firstWord)
    return;
  if (firstWord === "npx" || firstWord === "bunx") {
    let secondWord = trimmed.split(/\s+/)[1]?.toLowerCase();
    if (secondWord && secondWord in CLI_COMMAND_MAPPING)
      return CLI_COMMAND_MAPPING[secondWord];
  }
  return CLI_COMMAND_MAPPING[firstWord];
}
function detectCodeIndexingFromMcpServerName(serverName) {
  for (let { pattern, tool } of MCP_SERVER_PATTERNS)
    if (pattern.test(serverName))
      return tool;
  return;
}
var CLI_COMMAND_MAPPING, MCP_SERVER_PATTERNS;
var init_codeIndexing = __esm(() => {
  CLI_COMMAND_MAPPING = {
    src: "sourcegraph",
    cody: "cody",
    aider: "aider",
    tabby: "tabby",
    tabnine: "tabnine",
    augment: "augment",
    pieces: "pieces",
    qodo: "qodo",
    aide: "aide",
    hound: "hound",
    seagoat: "seagoat",
    bloop: "bloop",
    gitloop: "gitloop",
    q: "amazon-q",
    gemini: "gemini"
  }, MCP_SERVER_PATTERNS = [
    { pattern: /^sourcegraph$/i, tool: "sourcegraph" },
    { pattern: /^cody$/i, tool: "cody" },
    { pattern: /^openctx$/i, tool: "openctx" },
    { pattern: /^aider$/i, tool: "aider" },
    { pattern: /^continue$/i, tool: "continue" },
    { pattern: /^github[-_]?copilot$/i, tool: "github-copilot" },
    { pattern: /^copilot$/i, tool: "github-copilot" },
    { pattern: /^cursor$/i, tool: "cursor" },
    { pattern: /^tabby$/i, tool: "tabby" },
    { pattern: /^codeium$/i, tool: "codeium" },
    { pattern: /^tabnine$/i, tool: "tabnine" },
    { pattern: /^augment[-_]?code$/i, tool: "augment" },
    { pattern: /^augment$/i, tool: "augment" },
    { pattern: /^windsurf$/i, tool: "windsurf" },
    { pattern: /^aide$/i, tool: "aide" },
    { pattern: /^codestory$/i, tool: "aide" },
    { pattern: /^pieces$/i, tool: "pieces" },
    { pattern: /^qodo$/i, tool: "qodo" },
    { pattern: /^amazon[-_]?q$/i, tool: "amazon-q" },
    { pattern: /^gemini[-_]?code[-_]?assist$/i, tool: "gemini" },
    { pattern: /^gemini$/i, tool: "gemini" },
    { pattern: /^hound$/i, tool: "hound" },
    { pattern: /^seagoat$/i, tool: "seagoat" },
    { pattern: /^bloop$/i, tool: "bloop" },
    { pattern: /^gitloop$/i, tool: "gitloop" },
    { pattern: /^claude[-_]?context$/i, tool: "claude-context" },
    { pattern: /^code[-_]?index[-_]?mcp$/i, tool: "code-index-mcp" },
    { pattern: /^code[-_]?index$/i, tool: "code-index-mcp" },
    { pattern: /^local[-_]?code[-_]?search$/i, tool: "local-code-search" },
    { pattern: /^codebase$/i, tool: "autodev-codebase" },
    { pattern: /^autodev[-_]?codebase$/i, tool: "autodev-codebase" },
    { pattern: /^code[-_]?context$/i, tool: "claude-context" }
  ];
});
