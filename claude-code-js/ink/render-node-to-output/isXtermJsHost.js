// function: isXtermJsHost
function isXtermJsHost() {
  return process.env.TERM_PROGRAM === "vscode" || isXtermJs();
}
