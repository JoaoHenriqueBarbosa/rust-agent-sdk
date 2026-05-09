// var: init_errors6
var init_errors6 = __esm(() => {
  init_STSServiceException();
  ExpiredTokenException = class ExpiredTokenException extends STSServiceException {
    name = "ExpiredTokenException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ExpiredTokenException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ExpiredTokenException.prototype);
    }
  };
  MalformedPolicyDocumentException = class MalformedPolicyDocumentException extends STSServiceException {
    name = "MalformedPolicyDocumentException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "MalformedPolicyDocumentException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
    }
  };
  PackedPolicyTooLargeException = class PackedPolicyTooLargeException extends STSServiceException {
    name = "PackedPolicyTooLargeException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "PackedPolicyTooLargeException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
    }
  };
  RegionDisabledException = class RegionDisabledException extends STSServiceException {
    name = "RegionDisabledException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "RegionDisabledException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, RegionDisabledException.prototype);
    }
  };
  IDPRejectedClaimException = class IDPRejectedClaimException extends STSServiceException {
    name = "IDPRejectedClaimException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "IDPRejectedClaimException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
    }
  };
  InvalidIdentityTokenException = class InvalidIdentityTokenException extends STSServiceException {
    name = "InvalidIdentityTokenException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "InvalidIdentityTokenException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
    }
  };
  IDPCommunicationErrorException = class IDPCommunicationErrorException extends STSServiceException {
    name = "IDPCommunicationErrorException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "IDPCommunicationErrorException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
    }
  };
  InvalidAuthorizationMessageException = class InvalidAuthorizationMessageException extends STSServiceException {
    name = "InvalidAuthorizationMessageException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "InvalidAuthorizationMessageException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, InvalidAuthorizationMessageException.prototype);
    }
  };
  ExpiredTradeInTokenException = class ExpiredTradeInTokenException extends STSServiceException {
    name = "ExpiredTradeInTokenException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ExpiredTradeInTokenException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ExpiredTradeInTokenException.prototype);
    }
  };
  JWTPayloadSizeExceededException = class JWTPayloadSizeExceededException extends STSServiceException {
    name = "JWTPayloadSizeExceededException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "JWTPayloadSizeExceededException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, JWTPayloadSizeExceededException.prototype);
    }
  };
  OutboundWebIdentityFederationDisabledException = class OutboundWebIdentityFederationDisabledException extends STSServiceException {
    name = "OutboundWebIdentityFederationDisabledException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "OutboundWebIdentityFederationDisabledException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, OutboundWebIdentityFederationDisabledException.prototype);
    }
  };
  SessionDurationEscalationException = class SessionDurationEscalationException extends STSServiceException {
    name = "SessionDurationEscalationException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "SessionDurationEscalationException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, SessionDurationEscalationException.prototype);
    }
  };
});
