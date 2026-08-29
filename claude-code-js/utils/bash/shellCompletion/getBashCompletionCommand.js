// function: getBashCompletionCommand
function getBashCompletionCommand(prefix, completionType) {
  if (completionType === "variable") {
    let varName = prefix.slice(1);
    return `compgen -v ${quote([varName])} 2>/dev/null`;
  } else if (completionType === "file")
    return `compgen -f ${quote([prefix])} 2>/dev/null | head -${MAX_SHELL_COMPLETIONS} | while IFS= read -r f; do [ -d "$f" ] && echo "$f/" || echo "$f "; done`;
  else
    return `compgen -c ${quote([prefix])} 2>/dev/null`;
}
