// function: skipStdbufFlags
function skipStdbufFlags(a2) {
  let i5 = 1;
  while (i5 < a2.length) {
    let arg = a2[i5];
    if (/^-[ioe]$/.test(arg) && a2[i5 + 1])
      i5 += 2;
    else if (/^-[ioe]./.test(arg))
      i5++;
    else if (/^--(input|output|error)=/.test(arg))
      i5++;
    else if (arg.startsWith("-"))
      return -1;
    else
      break;
  }
  return i5 > 1 && i5 < a2.length ? i5 : -1;
}
