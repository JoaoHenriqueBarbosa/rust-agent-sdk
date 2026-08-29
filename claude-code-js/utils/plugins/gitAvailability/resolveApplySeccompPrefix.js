// function: resolveApplySeccompPrefix
function resolveApplySeccompPrefix(applyPath, argv0) {
  if (argv0) {
    if (!applyPath)
      throw Error("seccompConfig.argv0 requires seccompConfig.applyPath");
    return `ARGV0=${import_shell_quote.default.quote([argv0])} ${import_shell_quote.default.quote([applyPath])} `;
  }
  let binary = getApplySeccompBinaryPath(applyPath);
  return binary ? `${import_shell_quote.default.quote([binary])} ` : void 0;
}
