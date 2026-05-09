// function: resetCursor
function resetCursor() {
  (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(SHOW_CURSOR);
}
