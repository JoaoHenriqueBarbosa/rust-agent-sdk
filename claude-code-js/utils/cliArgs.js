// Original: src/utils/cliArgs.ts
function eagerParseCliFlag(flagName, argv = process.argv) {
  for (let i5 = 0;i5 < argv.length; i5++) {
    let arg = argv[i5];
    if (arg?.startsWith(`${flagName}=`))
      return arg.slice(flagName.length + 1);
    if (arg === flagName && i5 + 1 < argv.length)
      return argv[i5 + 1];
  }
  return;
}
