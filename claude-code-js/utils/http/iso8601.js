// var: iso8601
var iso8601 = (time3) => toDate(time3).toISOString().replace(/\.\d{3}Z$/, "Z"), toDate = (time3) => {
  if (typeof time3 === "number")
    return new Date(time3 * 1000);
  if (typeof time3 === "string") {
    if (Number(time3))
      return new Date(Number(time3) * 1000);
    return new Date(time3);
  }
  return time3;
};
