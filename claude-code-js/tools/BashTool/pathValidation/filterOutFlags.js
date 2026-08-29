// function: filterOutFlags
function filterOutFlags(args) {
  let result = [], afterDoubleDash = !1;
  for (let arg of args)
    if (afterDoubleDash)
      result.push(arg);
    else if (arg === "--")
      afterDoubleDash = !0;
    else if (!arg?.startsWith("-"))
      result.push(arg);
  return result;
}
