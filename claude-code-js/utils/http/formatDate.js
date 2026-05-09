// var: formatDate
var formatDate = (now) => {
  let longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
}, getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");
