// var: require_STSServiceException
var require_STSServiceException = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.STSServiceException = exports.__ServiceException = void 0;
  var smithy_client_1 = require_dist_cjs71();
  Object.defineProperty(exports, "__ServiceException", { enumerable: !0, get: function() {
    return smithy_client_1.ServiceException;
  } });

  class STSServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
      super(options);
      Object.setPrototypeOf(this, STSServiceException.prototype);
    }
  }
  exports.STSServiceException = STSServiceException;
});
