// function: skipTimeoutFlags
function skipTimeoutFlags(a2) {
  let i5 = 1;
  while (i5 < a2.length) {
    let arg = a2[i5], next = a2[i5 + 1];
    if (arg === "--foreground" || arg === "--preserve-status" || arg === "--verbose")
      i5++;
    else if (/^--(?:kill-after|signal)=[A-Za-z0-9_.+-]+$/.test(arg))
      i5++;
    else if ((arg === "--kill-after" || arg === "--signal") && next && TIMEOUT_FLAG_VALUE_RE.test(next))
      i5 += 2;
    else if (arg === "--") {
      i5++;
      break;
    } else if (arg.startsWith("--"))
      return -1;
    else if (arg === "-v")
      i5++;
    else if ((arg === "-k" || arg === "-s") && next && TIMEOUT_FLAG_VALUE_RE.test(next))
      i5 += 2;
    else if (/^-[ks][A-Za-z0-9_.+-]+$/.test(arg))
      i5++;
    else if (arg.startsWith("-"))
      return -1;
    else
      break;
  }
  return i5;
}
