// var: isArray4
var isArray4 = (val) => (isArray4 = Array.isArray, isArray4(val)), isReadonlyArray, safeJSON2 = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return;
  }
};
