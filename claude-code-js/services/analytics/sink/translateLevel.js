// function: translateLevel
function translateLevel(level) {
  if (level === 0)
    return !1;
  return {
    level,
    hasBasic: !0,
    has256: level >= 2,
    has16m: level >= 3
  };
}
