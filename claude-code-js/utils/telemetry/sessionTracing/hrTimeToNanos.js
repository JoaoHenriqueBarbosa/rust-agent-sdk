// function: hrTimeToNanos
function hrTimeToNanos(hrTime2) {
  let NANOSECONDS = BigInt(1e9);
  return BigInt(Math.trunc(hrTime2[0])) * NANOSECONDS + BigInt(Math.trunc(hrTime2[1]));
}
