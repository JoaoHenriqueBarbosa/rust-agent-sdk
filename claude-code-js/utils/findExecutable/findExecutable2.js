// function: findExecutable2
function findExecutable2(exe, args) {
  return { cmd: whichSync(exe) ?? exe, args };
}
