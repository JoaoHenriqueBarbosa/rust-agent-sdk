// function: getDangerousDirectories
function getDangerousDirectories() {
  return [
    ...DANGEROUS_DIRECTORIES.filter((d) => d !== ".git"),
    ".claude/commands",
    ".claude/agents"
  ];
}
