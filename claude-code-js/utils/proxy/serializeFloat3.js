// var: serializeFloat3
var serializeFloat3 = (value) => {
  if (value !== value)
    return "NaN";
  switch (value) {
    case 1 / 0:
      return "Infinity";
    case -1 / 0:
      return "-Infinity";
    default:
      return value;
  }
}, serializeDateTime3 = (date5) => date5.toISOString().replace(".000Z", "Z");
