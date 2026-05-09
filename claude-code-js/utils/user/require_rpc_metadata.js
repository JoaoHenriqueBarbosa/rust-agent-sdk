// var: require_rpc_metadata
var require_rpc_metadata = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRPCMetadata = exports.deleteRPCMetadata = exports.setRPCMetadata = exports.RPCType = void 0;
  var api_1 = require_src7(), RPC_METADATA_KEY = (0, api_1.createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA"), RPCType;
  (function(RPCType2) {
    RPCType2.HTTP = "http";
  })(RPCType = exports.RPCType || (exports.RPCType = {}));
  function setRPCMetadata(context3, meta) {
    return context3.setValue(RPC_METADATA_KEY, meta);
  }
  exports.setRPCMetadata = setRPCMetadata;
  function deleteRPCMetadata(context3) {
    return context3.deleteValue(RPC_METADATA_KEY);
  }
  exports.deleteRPCMetadata = deleteRPCMetadata;
  function getRPCMetadata(context3) {
    return context3.getValue(RPC_METADATA_KEY);
  }
  exports.getRPCMetadata = getRPCMetadata;
});
