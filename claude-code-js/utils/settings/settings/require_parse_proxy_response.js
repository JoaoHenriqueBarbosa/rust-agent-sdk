// var: require_parse_proxy_response
var require_parse_proxy_response = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.parseProxyResponse = void 0;
  var debug_1 = __importDefault(require_src()), debug = (0, debug_1.default)("https-proxy-agent:parse-proxy-response");
  function parseProxyResponse(socket) {
    return new Promise((resolve8, reject) => {
      let buffersLength = 0, buffers = [];
      function read() {
        let b = socket.read();
        if (b)
          ondata(b);
        else
          socket.once("readable", read);
      }
      function cleanup() {
        socket.removeListener("end", onend), socket.removeListener("error", onerror), socket.removeListener("readable", read);
      }
      function onend() {
        cleanup(), debug("onend"), reject(Error("Proxy connection ended before receiving CONNECT response"));
      }
      function onerror(err) {
        cleanup(), debug("onerror %o", err), reject(err);
      }
      function ondata(b) {
        buffers.push(b), buffersLength += b.length;
        let buffered = Buffer.concat(buffers, buffersLength), endOfHeaders = buffered.indexOf(`\r
\r
`);
        if (endOfHeaders === -1) {
          debug("have not received end of HTTP headers yet..."), read();
          return;
        }
        let headerParts = buffered.slice(0, endOfHeaders).toString("ascii").split(`\r
`), firstLine = headerParts.shift();
        if (!firstLine)
          return socket.destroy(), reject(Error("No header received from proxy CONNECT response"));
        let firstLineParts = firstLine.split(" "), statusCode = +firstLineParts[1], statusText = firstLineParts.slice(2).join(" "), headers = {};
        for (let header of headerParts) {
          if (!header)
            continue;
          let firstColon = header.indexOf(":");
          if (firstColon === -1)
            return socket.destroy(), reject(Error(`Invalid header from proxy CONNECT response: "${header}"`));
          let key = header.slice(0, firstColon).toLowerCase(), value = header.slice(firstColon + 1).trimStart(), current = headers[key];
          if (typeof current === "string")
            headers[key] = [current, value];
          else if (Array.isArray(current))
            current.push(value);
          else
            headers[key] = value;
        }
        debug("got proxy server response: %o %o", firstLine, headers), cleanup(), resolve8({
          connect: {
            statusCode,
            statusText,
            headers
          },
          buffered
        });
      }
      socket.on("error", onerror), socket.on("end", onend), read();
    });
  }
  exports.parseProxyResponse = parseProxyResponse;
});
