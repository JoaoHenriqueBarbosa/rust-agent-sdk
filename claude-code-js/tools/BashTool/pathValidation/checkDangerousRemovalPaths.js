// function: checkDangerousRemovalPaths
function checkDangerousRemovalPaths(command12, args, cwd2) {
  let extractor = PATH_EXTRACTORS[command12], paths2 = extractor(args);
  for (let path16 of paths2) {
    let cleanPath = expandTilde(path16.replace(/^['"]|['"]$/g, "")), absolutePath = isAbsolute11(cleanPath) ? cleanPath : resolve23(cwd2, cleanPath);
    if (isDangerousRemovalPath(absolutePath))
      return {
        behavior: "ask",
        message: `Dangerous ${command12} operation detected: '${absolutePath}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
        decisionReason: {
          type: "other",
          reason: `Dangerous ${command12} operation on critical path: ${absolutePath}`
        },
        suggestions: []
      };
  }
  return {
    behavior: "passthrough",
    message: `No dangerous removals detected for ${command12} command`
  };
}
