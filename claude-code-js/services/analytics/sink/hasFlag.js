// function: hasFlag
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process3.argv) {
  let prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--", position = argv.indexOf(prefix + flag), terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
