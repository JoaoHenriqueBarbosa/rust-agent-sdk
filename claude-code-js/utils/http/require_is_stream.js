// var: require_is_stream
var require_is_stream = __commonJS((exports, module) => {
  var isStream3 = (stream10) => stream10 !== null && typeof stream10 === "object" && typeof stream10.pipe === "function";
  isStream3.writable = (stream10) => isStream3(stream10) && stream10.writable !== !1 && typeof stream10._write === "function" && typeof stream10._writableState === "object";
  isStream3.readable = (stream10) => isStream3(stream10) && stream10.readable !== !1 && typeof stream10._read === "function" && typeof stream10._readableState === "object";
  isStream3.duplex = (stream10) => isStream3.writable(stream10) && isStream3.readable(stream10);
  isStream3.transform = (stream10) => isStream3.duplex(stream10) && typeof stream10._transform === "function";
  module.exports = isStream3;
});
