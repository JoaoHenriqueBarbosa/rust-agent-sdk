// var: require_schemas_02
var require_schemas_02 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GetRoleCredentials$ = exports.RoleCredentials$ = exports.GetRoleCredentialsResponse$ = exports.GetRoleCredentialsRequest$ = exports.errorTypeRegistries = exports.UnauthorizedException$ = exports.TooManyRequestsException$ = exports.ResourceNotFoundException$ = exports.InvalidRequestException$ = exports.SSOServiceException$ = void 0;
  var _ATT = "AccessTokenType", _GRC = "GetRoleCredentials", _GRCR = "GetRoleCredentialsRequest", _GRCRe = "GetRoleCredentialsResponse", _IRE = "InvalidRequestException", _RC = "RoleCredentials", _RNFE = "ResourceNotFoundException", _SAKT = "SecretAccessKeyType", _STT = "SessionTokenType", _TMRE = "TooManyRequestsException", _UE = "UnauthorizedException", _aI = "accountId", _aKI = "accessKeyId", _aT = "accessToken", _ai = "account_id", _c = "client", _e = "error", _ex = "expiration", _h = "http", _hE = "httpError", _hH = "httpHeader", _hQ = "httpQuery", _m = "message", _rC = "roleCredentials", _rN = "roleName", _rn = "role_name", _s = "smithy.ts.sdk.synthetic.com.amazonaws.sso", _sAK = "secretAccessKey", _sT = "sessionToken", _xasbt = "x-amz-sso_bearer_token", n0 = "com.amazonaws.sso", schema_1 = require_schema(), errors_1 = require_errors2(), SSOServiceException_1 = require_SSOServiceException(), _s_registry = schema_1.TypeRegistry.for(_s);
  exports.SSOServiceException$ = [-3, _s, "SSOServiceException", 0, [], []];
  _s_registry.registerError(exports.SSOServiceException$, SSOServiceException_1.SSOServiceException);
  var n0_registry = schema_1.TypeRegistry.for(n0);
  exports.InvalidRequestException$ = [-3, n0, _IRE, { [_e]: _c, [_hE]: 400 }, [_m], [0]];
  n0_registry.registerError(exports.InvalidRequestException$, errors_1.InvalidRequestException);
  exports.ResourceNotFoundException$ = [-3, n0, _RNFE, { [_e]: _c, [_hE]: 404 }, [_m], [0]];
  n0_registry.registerError(exports.ResourceNotFoundException$, errors_1.ResourceNotFoundException);
  exports.TooManyRequestsException$ = [-3, n0, _TMRE, { [_e]: _c, [_hE]: 429 }, [_m], [0]];
  n0_registry.registerError(exports.TooManyRequestsException$, errors_1.TooManyRequestsException);
  exports.UnauthorizedException$ = [-3, n0, _UE, { [_e]: _c, [_hE]: 401 }, [_m], [0]];
  n0_registry.registerError(exports.UnauthorizedException$, errors_1.UnauthorizedException);
  exports.errorTypeRegistries = [_s_registry, n0_registry];
  var AccessTokenType = [0, n0, _ATT, 8, 0], SecretAccessKeyType = [0, n0, _SAKT, 8, 0], SessionTokenType = [0, n0, _STT, 8, 0];
  exports.GetRoleCredentialsRequest$ = [
    3,
    n0,
    _GRCR,
    0,
    [_rN, _aI, _aT],
    [
      [0, { [_hQ]: _rn }],
      [0, { [_hQ]: _ai }],
      [() => AccessTokenType, { [_hH]: _xasbt }]
    ],
    3
  ];
  exports.GetRoleCredentialsResponse$ = [
    3,
    n0,
    _GRCRe,
    0,
    [_rC],
    [[() => exports.RoleCredentials$, 0]]
  ];
  exports.RoleCredentials$ = [
    3,
    n0,
    _RC,
    0,
    [_aKI, _sAK, _sT, _ex],
    [0, [() => SecretAccessKeyType, 0], [() => SessionTokenType, 0], 1]
  ];
  exports.GetRoleCredentials$ = [
    9,
    n0,
    _GRC,
    { [_h]: ["GET", "/federation/credentials", 200] },
    () => exports.GetRoleCredentialsRequest$,
    () => exports.GetRoleCredentialsResponse$
  ];
});
