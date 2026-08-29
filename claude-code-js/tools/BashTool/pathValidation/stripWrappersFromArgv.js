// function: stripWrappersFromArgv
function stripWrappersFromArgv(argv) {
  let a2 = argv;
  for (;; )
    if (a2[0] === "time" || a2[0] === "nohup")
      a2 = a2.slice(a2[1] === "--" ? 2 : 1);
    else if (a2[0] === "timeout") {
      let i5 = skipTimeoutFlags(a2);
      if (i5 < 0 || !a2[i5] || !/^\d+(?:\.\d+)?[smhd]?$/.test(a2[i5]))
        return a2;
      a2 = a2.slice(i5 + 1);
    } else if (a2[0] === "nice")
      if (a2[1] === "-n" && a2[2] && /^-?\d+$/.test(a2[2]))
        a2 = a2.slice(a2[3] === "--" ? 4 : 3);
      else if (a2[1] && /^-\d+$/.test(a2[1]))
        a2 = a2.slice(a2[2] === "--" ? 3 : 2);
      else
        a2 = a2.slice(a2[1] === "--" ? 2 : 1);
    else if (a2[0] === "stdbuf") {
      let i5 = skipStdbufFlags(a2);
      if (i5 < 0)
        return a2;
      a2 = a2.slice(i5);
    } else if (a2[0] === "env") {
      let i5 = skipEnvFlags(a2);
      if (i5 < 0)
        return a2;
      a2 = a2.slice(i5);
    } else
      return a2;
}
