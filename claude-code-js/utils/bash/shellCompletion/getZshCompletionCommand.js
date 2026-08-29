// function: getZshCompletionCommand
function getZshCompletionCommand(prefix, completionType) {
  if (completionType === "variable") {
    let varName = prefix.slice(1);
    return `print -rl -- \${(k)parameters[(I)${quote([varName])}*]} 2>/dev/null`;
  } else if (completionType === "file")
    return `for f in ${quote([prefix])}*(N[1,${MAX_SHELL_COMPLETIONS}]); do [[ -d "$f" ]] && echo "$f/" || echo "$f "; done`;
  else
    return `print -rl -- \${(k)commands[(I)${quote([prefix])}*]} 2>/dev/null`;
}
