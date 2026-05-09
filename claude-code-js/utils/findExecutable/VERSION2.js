// var: VERSION2
var VERSION2 = "1.14.0";

// node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url3) {
  let match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url3);
  return match && match[1] || "";
}
