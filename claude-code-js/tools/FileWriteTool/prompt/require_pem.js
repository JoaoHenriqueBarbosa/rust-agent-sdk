// var: require_pem
var require_pem = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  var pem = module.exports = forge.pem = forge.pem || {};
  pem.encode = function(msg, options) {
    options = options || {};
    var rval = "-----BEGIN " + msg.type + `-----\r
`, header;
    if (msg.procType)
      header = {
        name: "Proc-Type",
        values: [String(msg.procType.version), msg.procType.type]
      }, rval += foldHeader(header);
    if (msg.contentDomain)
      header = { name: "Content-Domain", values: [msg.contentDomain] }, rval += foldHeader(header);
    if (msg.dekInfo) {
      if (header = { name: "DEK-Info", values: [msg.dekInfo.algorithm] }, msg.dekInfo.parameters)
        header.values.push(msg.dekInfo.parameters);
      rval += foldHeader(header);
    }
    if (msg.headers)
      for (var i5 = 0;i5 < msg.headers.length; ++i5)
        rval += foldHeader(msg.headers[i5]);
    if (msg.procType)
      rval += `\r
`;
    return rval += forge.util.encode64(msg.body, options.maxline || 64) + `\r
`, rval += "-----END " + msg.type + `-----\r
`, rval;
  };
  pem.decode = function(str) {
    var rval = [], rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g, rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/, rCRLF = /\r?\n/, match;
    while (!0) {
      if (match = rMessage.exec(str), !match)
        break;
      var type = match[1];
      if (type === "NEW CERTIFICATE REQUEST")
        type = "CERTIFICATE REQUEST";
      var msg = {
        type,
        procType: null,
        contentDomain: null,
        dekInfo: null,
        headers: [],
        body: forge.util.decode64(match[3])
      };
      if (rval.push(msg), !match[2])
        continue;
      var lines2 = match[2].split(rCRLF), li = 0;
      while (match && li < lines2.length) {
        var line = lines2[li].replace(/\s+$/, "");
        for (var nl = li + 1;nl < lines2.length; ++nl) {
          var next = lines2[nl];
          if (!/\s/.test(next[0]))
            break;
          line += next, li = nl;
        }
        if (match = line.match(rHeader), match) {
          var header = { name: match[1], values: [] }, values3 = match[2].split(",");
          for (var vi = 0;vi < values3.length; ++vi)
            header.values.push(ltrim(values3[vi]));
          if (!msg.procType) {
            if (header.name !== "Proc-Type")
              throw Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
            else if (header.values.length !== 2)
              throw Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
            msg.procType = { version: values3[0], type: values3[1] };
          } else if (!msg.contentDomain && header.name === "Content-Domain")
            msg.contentDomain = values3[0] || "";
          else if (!msg.dekInfo && header.name === "DEK-Info") {
            if (header.values.length === 0)
              throw Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
            msg.dekInfo = { algorithm: values3[0], parameters: values3[1] || null };
          } else
            msg.headers.push(header);
        }
        ++li;
      }
      if (msg.procType === "ENCRYPTED" && !msg.dekInfo)
        throw Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".');
    }
    if (rval.length === 0)
      throw Error("Invalid PEM formatted message.");
    return rval;
  };
  function foldHeader(header) {
    var rval = header.name + ": ", values3 = [], insertSpace = function(match, $1) {
      return " " + $1;
    };
    for (var i5 = 0;i5 < header.values.length; ++i5)
      values3.push(header.values[i5].replace(/^(\S+\r\n)/, insertSpace));
    rval += values3.join(",") + `\r
`;
    var length = 0, candidate = -1;
    for (var i5 = 0;i5 < rval.length; ++i5, ++length)
      if (length > 65 && candidate !== -1) {
        var insert = rval[candidate];
        if (insert === ",")
          ++candidate, rval = rval.substr(0, candidate) + `\r
 ` + rval.substr(candidate);
        else
          rval = rval.substr(0, candidate) + `\r
` + insert + rval.substr(candidate + 1);
        length = i5 - candidate - 1, candidate = -1, ++i5;
      } else if (rval[i5] === " " || rval[i5] === "\t" || rval[i5] === ",")
        candidate = i5;
    return rval;
  }
  function ltrim(str) {
    return str.replace(/^\s+/, "");
  }
});
