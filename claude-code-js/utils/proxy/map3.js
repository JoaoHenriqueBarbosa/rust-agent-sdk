// function: map3
function map3(arg0, arg1, arg2) {
  let target, filter2, instructions;
  if (typeof arg1 > "u" && typeof arg2 > "u")
    target = {}, instructions = arg0;
  else if (target = arg0, typeof arg1 === "function")
    return filter2 = arg1, instructions = arg2, mapWithFilter2(target, filter2, instructions);
  else
    instructions = arg1;
  for (let key of Object.keys(instructions)) {
    if (!Array.isArray(instructions[key])) {
      target[key] = instructions[key];
      continue;
    }
    applyInstruction2(target, null, instructions, key);
  }
  return target;
}
