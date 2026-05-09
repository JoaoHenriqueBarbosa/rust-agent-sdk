// var: require_schemas_0
var require_schemas_0 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.CreateToken$ = exports.CreateTokenResponse$ = exports.CreateTokenRequest$ = exports.errorTypeRegistries = exports.UnsupportedGrantTypeException$ = exports.UnauthorizedClientException$ = exports.SlowDownException$ = exports.InvalidScopeException$ = exports.InvalidRequestException$ = exports.InvalidGrantException$ = exports.InvalidClientException$ = exports.InternalServerException$ = exports.ExpiredTokenException$ = exports.AuthorizationPendingException$ = exports.AccessDeniedException$ = exports.SSOOIDCServiceException$ = void 0;
  var _ADE = "AccessDeniedException", _APE = "AuthorizationPendingException", _AT = "AccessToken", _CS = "ClientSecret", _CT = "CreateToken", _CTR = "CreateTokenRequest", _CTRr = "CreateTokenResponse", _CV = "CodeVerifier", _ETE = "ExpiredTokenException", _ICE = "InvalidClientException", _IGE = "InvalidGrantException", _IRE = "InvalidRequestException", _ISE = "InternalServerException", _ISEn = "InvalidScopeException", _IT = "IdToken", _RT = "RefreshToken", _SDE = "SlowDownException", _UCE = "UnauthorizedClientException", _UGTE = "UnsupportedGrantTypeException", _aT = "accessToken", _c = "client", _cI = "clientId", _cS = "clientSecret", _cV = "codeVerifier", _co = "code", _dC = "deviceCode", _e = "error", _eI = "expiresIn", _ed = "error_description", _gT = "grantType", _h = "http", _hE = "httpError", _iT = "idToken", _r = "reason", _rT = "refreshToken", _rU = "redirectUri", _s = "smithy.ts.sdk.synthetic.com.amazonaws.ssooidc", _sc = "scope", _se = "server", _tT = "tokenType", n0 = "com.amazonaws.ssooidc", schema_1 = require_schema(), errors_1 = require_errors(), SSOOIDCServiceException_1 = require_SSOOIDCServiceException(), _s_registry = schema_1.TypeRegistry.for(_s);
  exports.SSOOIDCServiceException$ = [-3, _s, "SSOOIDCServiceException", 0, [], []];
  _s_registry.registerError(exports.SSOOIDCServiceException$, SSOOIDCServiceException_1.SSOOIDCServiceException);
  var n0_registry = schema_1.TypeRegistry.for(n0);
  exports.AccessDeniedException$ = [
    -3,
    n0,
    _ADE,
    { [_e]: _c, [_hE]: 400 },
    [_e, _r, _ed],
    [0, 0, 0]
  ];
  n0_registry.registerError(exports.AccessDeniedException$, errors_1.AccessDeniedException);
  exports.AuthorizationPendingException$ = [
    -3,
    n0,
    _APE,
    { [_e]: _c, [_hE]: 400 },
    [_e, _ed],
    [0, 0]
  ];
  n0_registry.registerError(exports.AuthorizationPendingException$, errors_1.AuthorizationPendingException);
  exports.ExpiredTokenException$ = [-3, n0, _ETE, { [_e]: _c, [_hE]: 400 }, [_e, _ed], [0, 0]];
  n0_registry.registerError(exports.ExpiredTokenException$, errors_1.ExpiredTokenException);
  exports.InternalServerException$ = [-3, n0, _ISE, { [_e]: _se, [_hE]: 500 }, [_e, _ed], [0, 0]];
  n0_registry.registerError(exports.InternalServerException$, errors_1.InternalServerException);
  exports.InvalidClientException$ = [-3, n0, _ICE, { [_e]: _c, [_hE]: 401 }, [_e, _ed], [0, 0]];
  n0_registry.registerError(exports.InvalidClientException$, errors_1.InvalidClientException);
  exports.InvalidGrantException$ = [-3, n0, _IGE, { [_e]: _c, [_hE]: 400 }, [_e, _ed], [0, 0]];
  n0_registry.registerError(exports.InvalidGrantException$, errors_1.InvalidGrantException);
  exports.InvalidRequestException$ = [
    -3,
    n0,
    _IRE,
    { [_e]: _c, [_hE]: 400 },
    [_e, _r, _ed],
    [0, 0, 0]
  ];
  n0_registry.registerError(exports.InvalidRequestException$, errors_1.InvalidRequestException);
  exports.InvalidScopeException$ = [-3, n0, _ISEn, { [_e]: _c, [_hE]: 400 }, [_e, _ed], [0, 0]];
  n0_registry.registerError(exports.InvalidScopeException$, errors_1.InvalidScopeException);
  exports.SlowDownException$ = [-3, n0, _SDE, { [_e]: _c, [_hE]: 400 }, [_e, _ed], [0, 0]];
  n0_registry.registerError(exports.SlowDownException$, errors_1.SlowDownException);
  exports.UnauthorizedClientException$ = [
    -3,
    n0,
    _UCE,
    { [_e]: _c, [_hE]: 400 },
    [_e, _ed],
    [0, 0]
  ];
  n0_registry.registerError(exports.UnauthorizedClientException$, errors_1.UnauthorizedClientException);
  exports.UnsupportedGrantTypeException$ = [
    -3,
    n0,
    _UGTE,
    { [_e]: _c, [_hE]: 400 },
    [_e, _ed],
    [0, 0]
  ];
  n0_registry.registerError(exports.UnsupportedGrantTypeException$, errors_1.UnsupportedGrantTypeException);
  exports.errorTypeRegistries = [_s_registry, n0_registry];
  var AccessToken = [0, n0, _AT, 8, 0], ClientSecret = [0, n0, _CS, 8, 0], CodeVerifier = [0, n0, _CV, 8, 0], IdToken = [0, n0, _IT, 8, 0], RefreshToken = [0, n0, _RT, 8, 0];
  exports.CreateTokenRequest$ = [
    3,
    n0,
    _CTR,
    0,
    [_cI, _cS, _gT, _dC, _co, _rT, _sc, _rU, _cV],
    [0, [() => ClientSecret, 0], 0, 0, 0, [() => RefreshToken, 0], 64, 0, [() => CodeVerifier, 0]],
    3
  ];
  exports.CreateTokenResponse$ = [
    3,
    n0,
    _CTRr,
    0,
    [_aT, _tT, _eI, _rT, _iT],
    [[() => AccessToken, 0], 0, 1, [() => RefreshToken, 0], [() => IdToken, 0]]
  ];
  exports.CreateToken$ = [
    9,
    n0,
    _CT,
    { [_h]: ["POST", "/token", 200] },
    () => exports.CreateTokenRequest$,
    () => exports.CreateTokenResponse$
  ];
});
