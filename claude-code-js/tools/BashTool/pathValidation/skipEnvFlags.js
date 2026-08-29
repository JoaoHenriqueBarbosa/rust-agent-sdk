// function: skipEnvFlags
function skipEnvFlags(a2) {
  let i5 = 1;
  while (i5 < a2.length) {
    let arg = a2[i5];
    if (arg.includes("=") && !arg.startsWith("-"))
      i5++;
    else if (arg === "-i" || arg === "-0" || arg === "-v")
      i5++;
    else if (arg === "-u" && a2[i5 + 1])
      i5 += 2;
    else if (arg.startsWith("-"))
      return -1;
    else
      break;
  }
  return i5 < a2.length ? i5 : -1;
}
