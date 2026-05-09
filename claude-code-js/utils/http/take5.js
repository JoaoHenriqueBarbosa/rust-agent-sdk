// var: take5
var take5 = (source, instructions) => {
  let out = {};
  for (let key in instructions)
    applyInstruction5(out, source, instructions, key);
  return out;
}, mapWithFilter5 = (target, filter2, instructions) => {
  return map6(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
    if (Array.isArray(value))
      _instructions[key] = value;
    else if (typeof value === "function")
      _instructions[key] = [filter2, value()];
    else
      _instructions[key] = [filter2, value];
    return _instructions;
  }, {}));
}, applyInstruction5 = (target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function")
      instruction = [, instruction];
    let [filter3 = nonNullish5, valueFn = pass5, sourceKey = targetKey] = instruction;
    if (typeof filter3 === "function" && filter3(source[sourceKey]) || typeof filter3 !== "function" && !!filter3)
      target[targetKey] = valueFn(source[sourceKey]);
    return;
  }
  let [filter2, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value, defaultFilterPassed = filter2 === void 0 && (_value = value()) != null, customFilterPassed = typeof filter2 === "function" && !!filter2(void 0) || typeof filter2 !== "function" && !!filter2;
    if (defaultFilterPassed)
      target[targetKey] = _value;
    else if (customFilterPassed)
      target[targetKey] = value();
  } else {
    let defaultFilterPassed = filter2 === void 0 && value != null, customFilterPassed = typeof filter2 === "function" && !!filter2(value) || typeof filter2 !== "function" && !!filter2;
    if (defaultFilterPassed || customFilterPassed)
      target[targetKey] = value;
  }
}, nonNullish5 = (_) => _ != null, pass5 = (_) => _;
