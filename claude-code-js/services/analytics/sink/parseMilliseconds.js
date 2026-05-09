// function: parseMilliseconds
function parseMilliseconds(milliseconds) {
  switch (typeof milliseconds) {
    case "number": {
      if (Number.isFinite(milliseconds))
        return parseNumber(milliseconds);
      break;
    }
    case "bigint":
      return parseBigint(milliseconds);
  }
  throw TypeError("Expected a finite number or bigint");
}
