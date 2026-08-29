// var: require_schemas_04
var require_schemas_04 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.CreateOAuth2Token$ = exports.CreateOAuth2TokenResponseBody$ = exports.CreateOAuth2TokenResponse$ = exports.CreateOAuth2TokenRequestBody$ = exports.CreateOAuth2TokenRequest$ = exports.AccessToken$ = exports.errorTypeRegistries = exports.ValidationException$ = exports.TooManyRequestsError$ = exports.InternalServerException$ = exports.AccessDeniedException$ = exports.SigninServiceException$ = void 0;
  var _ADE = "AccessDeniedException", _AT = "AccessToken", _COAT = "CreateOAuth2Token", _COATR = "CreateOAuth2TokenRequest", _COATRB = "CreateOAuth2TokenRequestBody", _COATRBr = "CreateOAuth2TokenResponseBody", _COATRr = "CreateOAuth2TokenResponse", _ISE = "InternalServerException", _RT = "RefreshToken", _TMRE = "TooManyRequestsError", _VE = "ValidationException", _aKI = "accessKeyId", _aT = "accessToken", _c = "client", _cI = "clientId", _cV = "codeVerifier", _co = "code", _e = "error", _eI = "expiresIn", _gT = "grantType", _h = "http", _hE = "httpError", _iT = "idToken", _jN = "jsonName", _m = "message", _rT = "refreshToken", _rU = "redirectUri", _s = "smithy.ts.sdk.synthetic.com.amazonaws.signin", _sAK = "secretAccessKey", _sT = "sessionToken", _se = "server", _tI = "tokenInput", _tO = "tokenOutput", _tT = "tokenType", n0 = "com.amazonaws.signin", schema_1 = require_schema(), errors_1 = require_errors4(), SigninServiceException_1 = require_SigninServiceException(), _s_registry = schema_1.TypeRegistry.for(_s);
  exports.SigninServiceException$ = [-3, _s, "SigninServiceException", 0, [], []];
  _s_registry.registerError(exports.SigninServiceException$, SigninServiceException_1.SigninServiceException);
  var n0_registry = schema_1.TypeRegistry.for(n0);
  exports.AccessDeniedException$ = [-3, n0, _ADE, { [_e]: _c }, [_e, _m], [0, 0], 2];
  n0_registry.registerError(exports.AccessDeniedException$, errors_1.AccessDeniedException);
  exports.InternalServerException$ = [-3, n0, _ISE, { [_e]: _se, [_hE]: 500 }, [_e, _m], [0, 0], 2];
  n0_registry.registerError(exports.InternalServerException$, errors_1.InternalServerException);
  exports.TooManyRequestsError$ = [-3, n0, _TMRE, { [_e]: _c, [_hE]: 429 }, [_e, _m], [0, 0], 2];
  n0_registry.registerError(exports.TooManyRequestsError$, errors_1.TooManyRequestsError);
  exports.ValidationException$ = [-3, n0, _VE, { [_e]: _c, [_hE]: 400 }, [_e, _m], [0, 0], 2];
  n0_registry.registerError(exports.ValidationException$, errors_1.ValidationException);
  exports.errorTypeRegistries = [_s_registry, n0_registry];
  var RefreshToken = [0, n0, _RT, 8, 0];
  exports.AccessToken$ = [
    3,
    n0,
    _AT,
    8,
    [_aKI, _sAK, _sT],
    [
      [0, { [_jN]: _aKI }],
      [0, { [_jN]: _sAK }],
      [0, { [_jN]: _sT }]
    ],
    3
  ];
  exports.CreateOAuth2TokenRequest$ = [
    3,
    n0,
    _COATR,
    0,
    [_tI],
    [[() => exports.CreateOAuth2TokenRequestBody$, 16]],
    1
  ];
  exports.CreateOAuth2TokenRequestBody$ = [
    3,
    n0,
    _COATRB,
    0,
    [_cI, _gT, _co, _rU, _cV, _rT],
    [
      [0, { [_jN]: _cI }],
      [0, { [_jN]: _gT }],
      0,
      [0, { [_jN]: _rU }],
      [0, { [_jN]: _cV }],
      [() => RefreshToken, { [_jN]: _rT }]
    ],
    2
  ];
  exports.CreateOAuth2TokenResponse$ = [
    3,
    n0,
    _COATRr,
    0,
    [_tO],
    [[() => exports.CreateOAuth2TokenResponseBody$, 16]],
    1
  ];
  exports.CreateOAuth2TokenResponseBody$ = [
    3,
    n0,
    _COATRBr,
    0,
    [_aT, _tT, _eI, _rT, _iT],
    [
      [() => exports.AccessToken$, { [_jN]: _aT }],
      [0, { [_jN]: _tT }],
      [1, { [_jN]: _eI }],
      [() => RefreshToken, { [_jN]: _rT }],
      [0, { [_jN]: _iT }]
    ],
    4
  ];
  exports.CreateOAuth2Token$ = [
    9,
    n0,
    _COAT,
    { [_h]: ["POST", "/v1/token", 200] },
    () => exports.CreateOAuth2TokenRequest$,
    () => exports.CreateOAuth2TokenResponse$
  ];
});
