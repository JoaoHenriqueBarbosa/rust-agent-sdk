// function: filterCdCwdSubcommands
function filterCdCwdSubcommands(rawSubcommands, astCommands, cwd2, cwdMingw) {
  let subcommands = [], astCommandsByIdx = [];
  for (let i5 = 0;i5 < rawSubcommands.length; i5++) {
    let cmd = rawSubcommands[i5];
    if (cmd === `cd ${cwd2}` || cmd === `cd ${cwdMingw}`)
      continue;
    subcommands.push(cmd), astCommandsByIdx.push(astCommands?.[i5]);
  }
  return { subcommands, astCommandsByIdx };
}
