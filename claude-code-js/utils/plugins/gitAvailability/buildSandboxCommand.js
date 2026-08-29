// function: buildSandboxCommand
function buildSandboxCommand(httpSocketPath, socksSocketPath, userCommand, applySeccompPrefix, shell) {
  let shellPath = shell || "bash", socatCommands = [
    `socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${httpSocketPath} >/dev/null 2>&1 &`,
    `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${socksSocketPath} >/dev/null 2>&1 &`,
    'trap "kill %1 %2 2>/dev/null; exit" EXIT'
  ];
  if (applySeccompPrefix) {
    let applySeccompCmd = applySeccompPrefix + import_shell_quote.default.quote([shellPath, "-c", userCommand]), innerScript = [...socatCommands, applySeccompCmd].join(`
`);
    return `${shellPath} -c ${import_shell_quote.default.quote([innerScript])}`;
  } else {
    let innerScript = [
      ...socatCommands,
      `eval ${import_shell_quote.default.quote([userCommand])}`
    ].join(`
`);
    return `${shellPath} -c ${import_shell_quote.default.quote([innerScript])}`;
  }
}
