// var: require_helpers
var require_helpers = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable))
      desc = { enumerable: !0, get: function() {
        return m[k];
      } };
    Object.defineProperty(o2, k2, desc);
  } : function(o2, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o2[k2] = m[k];
  }), __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o2, v) {
    Object.defineProperty(o2, "default", { enumerable: !0, value: v });
  } : function(o2, v) {
    o2.default = v;
  }), __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    return __setModuleDefault(result, mod), result;
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.req = exports.json = exports.toBuffer = void 0;
  var http3 = __importStar(__require("http")), https2 = __importStar(__require("https"));
  async function toBuffer(stream4) {
    let length = 0, chunks = [];
    for await (let chunk of stream4)
      length += chunk.length, chunks.push(chunk);
    return Buffer.concat(chunks, length);
  }
  exports.toBuffer = toBuffer;
  async function json2(stream4) {
    let str = (await toBuffer(stream4)).toString("utf8");
    try {
      return JSON.parse(str);
    } catch (_err) {
      let err = _err;
      throw err.message += ` (input: ${str})`, err;
    }
  }
  exports.json = json2;
  function req(url3, opts = {}) {
    let req2 = ((typeof url3 === "string" ? url3 : url3.href).startsWith("https:") ? https2 : http3).request(url3, opts), promise2 = new Promise((resolve8, reject) => {
      req2.once("response", resolve8).once("error", reject).end();
    });
    return req2.then = promise2.then.bind(promise2), req2;
  }
  exports.req = req;
});
