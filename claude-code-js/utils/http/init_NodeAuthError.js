// var: init_NodeAuthError
var init_NodeAuthError = __esm(() => {
  init_index_node();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  NodeAuthErrorMessage = {
    invalidLoopbackAddressType: {
      code: "invalid_loopback_server_address_type",
      desc: "Loopback server address is not type string. This is unexpected."
    },
    unableToLoadRedirectUri: {
      code: "unable_to_load_redirectUrl",
      desc: "Loopback server callback was invoked without a url. This is unexpected."
    },
    noAuthCodeInResponse: {
      code: "no_auth_code_in_response",
      desc: "No auth code found in the server response. Please check your network trace to determine what happened."
    },
    noLoopbackServerExists: {
      code: "no_loopback_server_exists",
      desc: "No loopback server exists yet."
    },
    loopbackServerAlreadyExists: {
      code: "loopback_server_already_exists",
      desc: "Loopback server already exists. Cannot create another."
    },
    loopbackServerTimeout: {
      code: "loopback_server_timeout",
      desc: "Timed out waiting for auth code listener to be registered."
    },
    stateNotFoundError: {
      code: "state_not_found",
      desc: "State not found. Please verify that the request originated from msal."
    },
    thumbprintMissing: {
      code: "thumbprint_missing_from_client_certificate",
      desc: "Client certificate does not contain a SHA-1 or SHA-256 thumbprint."
    },
    redirectUriNotSupported: {
      code: "redirect_uri_not_supported",
      desc: "RedirectUri is not supported in this scenario. Please remove redirectUri from the request."
    }
  };
  NodeAuthError = class NodeAuthError extends AuthError {
    constructor(errorCode, errorMessage2) {
      super(errorCode, errorMessage2);
      this.name = "NodeAuthError";
    }
    static createInvalidLoopbackAddressTypeError() {
      return new NodeAuthError(NodeAuthErrorMessage.invalidLoopbackAddressType.code, `${NodeAuthErrorMessage.invalidLoopbackAddressType.desc}`);
    }
    static createUnableToLoadRedirectUrlError() {
      return new NodeAuthError(NodeAuthErrorMessage.unableToLoadRedirectUri.code, `${NodeAuthErrorMessage.unableToLoadRedirectUri.desc}`);
    }
    static createNoAuthCodeInResponseError() {
      return new NodeAuthError(NodeAuthErrorMessage.noAuthCodeInResponse.code, `${NodeAuthErrorMessage.noAuthCodeInResponse.desc}`);
    }
    static createNoLoopbackServerExistsError() {
      return new NodeAuthError(NodeAuthErrorMessage.noLoopbackServerExists.code, `${NodeAuthErrorMessage.noLoopbackServerExists.desc}`);
    }
    static createLoopbackServerAlreadyExistsError() {
      return new NodeAuthError(NodeAuthErrorMessage.loopbackServerAlreadyExists.code, `${NodeAuthErrorMessage.loopbackServerAlreadyExists.desc}`);
    }
    static createLoopbackServerTimeoutError() {
      return new NodeAuthError(NodeAuthErrorMessage.loopbackServerTimeout.code, `${NodeAuthErrorMessage.loopbackServerTimeout.desc}`);
    }
    static createStateNotFoundError() {
      return new NodeAuthError(NodeAuthErrorMessage.stateNotFoundError.code, NodeAuthErrorMessage.stateNotFoundError.desc);
    }
    static createThumbprintMissingError() {
      return new NodeAuthError(NodeAuthErrorMessage.thumbprintMissing.code, NodeAuthErrorMessage.thumbprintMissing.desc);
    }
    static createRedirectUriNotSupportedError() {
      return new NodeAuthError(NodeAuthErrorMessage.redirectUriNotSupported.code, NodeAuthErrorMessage.redirectUriNotSupported.desc);
    }
  };
});
