// function: hasNodeOption
function hasNodeOption(flag) {
  let nodeOptions = process.env.NODE_OPTIONS;
  if (!nodeOptions)
    return !1;
  return nodeOptions.split(/\s+/).includes(flag);
}
