// var: require_dist_cjs76
var require_dist_cjs76 = __commonJS((exports) => {
  var node_fs = __require("fs"), calculateBodyLength = (body) => {
    if (!body)
      return 0;
    if (typeof body === "string")
      return Buffer.byteLength(body);
    else if (typeof body.byteLength === "number")
      return body.byteLength;
    else if (typeof body.size === "number")
      return body.size;
    else if (typeof body.start === "number" && typeof body.end === "number")
      return body.end + 1 - body.start;
    else if (body instanceof node_fs.ReadStream) {
      if (body.path != null)
        return node_fs.lstatSync(body.path).size;
      else if (typeof body.fd === "number")
        return node_fs.fstatSync(body.fd).size;
    }
    throw Error(`Body Length computation failed for ${body}`);
  };
  exports.calculateBodyLength = calculateBodyLength;
});
