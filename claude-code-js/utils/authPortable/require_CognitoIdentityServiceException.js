// var: require_CognitoIdentityServiceException
var require_CognitoIdentityServiceException = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.CognitoIdentityServiceException = exports.__ServiceException = void 0;
  var smithy_client_1 = require_dist_cjs71();
  Object.defineProperty(exports, "__ServiceException", { enumerable: !0, get: function() {
    return smithy_client_1.ServiceException;
  } });

  class CognitoIdentityServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
      super(options);
      Object.setPrototypeOf(this, CognitoIdentityServiceException.prototype);
    }
  }
  exports.CognitoIdentityServiceException = CognitoIdentityServiceException;
});
