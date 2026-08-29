// var: init_InteractionRequiredAuthError
var init_InteractionRequiredAuthError = __esm(() => {
  init_AuthError();
  init_InteractionRequiredAuthErrorCodes();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  InteractionRequiredServerErrorMessage = [
    interactionRequired,
    consentRequired,
    loginRequired,
    badToken,
    uxNotAllowed,
    interruptedUser
  ], InteractionRequiredAuthSubErrorMessage = [
    "message_only",
    "additional_action",
    "basic_action",
    "user_password_expired",
    "consent_required",
    "bad_token",
    "ux_not_allowed",
    "interrupted_user"
  ];
  InteractionRequiredAuthError = class InteractionRequiredAuthError extends AuthError {
    constructor(errorCode, errorMessage2, subError, timestamp, traceId, correlationId, claims, errorNo) {
      super(errorCode, errorMessage2, subError);
      Object.setPrototypeOf(this, InteractionRequiredAuthError.prototype), this.timestamp = timestamp || "", this.traceId = traceId || "", this.correlationId = correlationId || "", this.claims = claims || "", this.name = "InteractionRequiredAuthError", this.errorNo = errorNo;
    }
  };
});
