// var: require_dist_cjs4
var require_dist_cjs4 = __commonJS((exports) => {
  var utilUriEscape = require_dist_cjs3();
  function buildQueryString(query) {
    let parts = [];
    for (let key of Object.keys(query).sort()) {
      let value = query[key];
      if (key = utilUriEscape.escapeUri(key), Array.isArray(value))
        for (let i2 = 0, iLen = value.length;i2 < iLen; i2++)
          parts.push(`${key}=${utilUriEscape.escapeUri(value[i2])}`);
      else {
        let qsEntry = key;
        if (value || typeof value === "string")
          qsEntry += `=${utilUriEscape.escapeUri(value)}`;
        parts.push(qsEntry);
      }
    }
    return parts.join("&");
  }
  exports.buildQueryString = buildQueryString;
});
