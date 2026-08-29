// function: resolveValue
function resolveValue(v2, ownerSize) {
  switch (v2.unit) {
    case Unit.Point:
      return v2.value;
    case Unit.Percent:
      return isNaN(ownerSize) ? NaN : v2.value * ownerSize / 100;
    default:
      return NaN;
  }
}
