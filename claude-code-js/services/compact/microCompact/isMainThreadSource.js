// function: isMainThreadSource
function isMainThreadSource(querySource) {
  return !querySource || querySource.startsWith("repl_main_thread");
}
