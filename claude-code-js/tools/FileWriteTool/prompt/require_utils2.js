// var: require_utils2
var require_utils2 = __commonJS((exports, module) => {
  function stringify2(obj, { EOL: EOL3 = `
`, finalEOL = !0, replacer = null, spaces } = {}) {
    let EOF = finalEOL ? EOL3 : "";
    return JSON.stringify(obj, replacer, spaces).replace(/\n/g, EOL3) + EOF;
  }
  function stripBom(content) {
    if (Buffer.isBuffer(content))
      content = content.toString("utf8");
    return content.replace(/^\uFEFF/, "");
  }
  module.exports = { stringify: stringify2, stripBom };
});
