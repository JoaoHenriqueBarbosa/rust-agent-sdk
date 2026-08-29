// var: require_schemas_05
var require_schemas_05 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GetId$ = exports.GetCredentialsForIdentity$ = exports.GetIdResponse$ = exports.GetIdInput$ = exports.GetCredentialsForIdentityResponse$ = exports.GetCredentialsForIdentityInput$ = exports.Credentials$ = exports.errorTypeRegistries = exports.TooManyRequestsException$ = exports.ResourceNotFoundException$ = exports.ResourceConflictException$ = exports.NotAuthorizedException$ = exports.LimitExceededException$ = exports.InvalidParameterException$ = exports.InvalidIdentityPoolConfigurationException$ = exports.InternalErrorException$ = exports.ExternalServiceException$ = exports.CognitoIdentityServiceException$ = void 0;
  var _AI = "AccountId", _AKI = "AccessKeyId", _C = "Credentials", _CRA = "CustomRoleArn", _E = "Expiration", _ESE = "ExternalServiceException", _GCFI = "GetCredentialsForIdentity", _GCFII = "GetCredentialsForIdentityInput", _GCFIR = "GetCredentialsForIdentityResponse", _GI = "GetId", _GII = "GetIdInput", _GIR = "GetIdResponse", _IEE = "InternalErrorException", _II = "IdentityId", _IIPCE = "InvalidIdentityPoolConfigurationException", _IPE = "InvalidParameterException", _IPI = "IdentityPoolId", _IPT = "IdentityProviderToken", _L = "Logins", _LEE = "LimitExceededException", _LM = "LoginsMap", _NAE = "NotAuthorizedException", _RCE = "ResourceConflictException", _RNFE = "ResourceNotFoundException", _SK = "SecretKey", _SKS = "SecretKeyString", _ST = "SessionToken", _TMRE = "TooManyRequestsException", _c = "client", _e = "error", _hE = "httpError", _m = "message", _s = "smithy.ts.sdk.synthetic.com.amazonaws.cognitoidentity", _se = "server", n0 = "com.amazonaws.cognitoidentity", schema_1 = require_schema(), CognitoIdentityServiceException_1 = require_CognitoIdentityServiceException(), errors_1 = require_errors5(), _s_registry4 = schema_1.TypeRegistry.for(_s);
  exports.CognitoIdentityServiceException$ = [-3, _s, "CognitoIdentityServiceException", 0, [], []];
  _s_registry4.registerError(exports.CognitoIdentityServiceException$, CognitoIdentityServiceException_1.CognitoIdentityServiceException);
  var n0_registry4 = schema_1.TypeRegistry.for(n0);
  exports.ExternalServiceException$ = [-3, n0, _ESE, { [_e]: _c, [_hE]: 400 }, [_m], [0]];
  n0_registry4.registerError(exports.ExternalServiceException$, errors_1.ExternalServiceException);
  exports.InternalErrorException$ = [-3, n0, _IEE, { [_e]: _se }, [_m], [0]];
  n0_registry4.registerError(exports.InternalErrorException$, errors_1.InternalErrorException);
  exports.InvalidIdentityPoolConfigurationException$ = [
    -3,
    n0,
    _IIPCE,
    { [_e]: _c, [_hE]: 400 },
    [_m],
    [0]
  ];
  n0_registry4.registerError(exports.InvalidIdentityPoolConfigurationException$, errors_1.InvalidIdentityPoolConfigurationException);
  exports.InvalidParameterException$ = [-3, n0, _IPE, { [_e]: _c, [_hE]: 400 }, [_m], [0]];
  n0_registry4.registerError(exports.InvalidParameterException$, errors_1.InvalidParameterException);
  exports.LimitExceededException$ = [-3, n0, _LEE, { [_e]: _c, [_hE]: 400 }, [_m], [0]];
  n0_registry4.registerError(exports.LimitExceededException$, errors_1.LimitExceededException);
  exports.NotAuthorizedException$ = [-3, n0, _NAE, { [_e]: _c, [_hE]: 403 }, [_m], [0]];
  n0_registry4.registerError(exports.NotAuthorizedException$, errors_1.NotAuthorizedException);
  exports.ResourceConflictException$ = [-3, n0, _RCE, { [_e]: _c, [_hE]: 409 }, [_m], [0]];
  n0_registry4.registerError(exports.ResourceConflictException$, errors_1.ResourceConflictException);
  exports.ResourceNotFoundException$ = [-3, n0, _RNFE, { [_e]: _c, [_hE]: 404 }, [_m], [0]];
  n0_registry4.registerError(exports.ResourceNotFoundException$, errors_1.ResourceNotFoundException);
  exports.TooManyRequestsException$ = [-3, n0, _TMRE, { [_e]: _c, [_hE]: 429 }, [_m], [0]];
  n0_registry4.registerError(exports.TooManyRequestsException$, errors_1.TooManyRequestsException);
  exports.errorTypeRegistries = [_s_registry4, n0_registry4];
  var IdentityProviderToken = [0, n0, _IPT, 8, 0], SecretKeyString = [0, n0, _SKS, 8, 0];
  exports.Credentials$ = [
    3,
    n0,
    _C,
    0,
    [_AKI, _SK, _ST, _E],
    [0, [() => SecretKeyString, 0], 0, 4]
  ];
  exports.GetCredentialsForIdentityInput$ = [
    3,
    n0,
    _GCFII,
    0,
    [_II, _L, _CRA],
    [0, [() => LoginsMap, 0], 0],
    1
  ];
  exports.GetCredentialsForIdentityResponse$ = [
    3,
    n0,
    _GCFIR,
    0,
    [_II, _C],
    [0, [() => exports.Credentials$, 0]]
  ];
  exports.GetIdInput$ = [3, n0, _GII, 0, [_IPI, _AI, _L], [0, 0, [() => LoginsMap, 0]], 1];
  exports.GetIdResponse$ = [3, n0, _GIR, 0, [_II], [0]];
  var LoginsMap = [2, n0, _LM, 0, [0, 0], [() => IdentityProviderToken, 0]];
  exports.GetCredentialsForIdentity$ = [
    9,
    n0,
    _GCFI,
    0,
    () => exports.GetCredentialsForIdentityInput$,
    () => exports.GetCredentialsForIdentityResponse$
  ];
  exports.GetId$ = [9, n0, _GI, 0, () => exports.GetIdInput$, () => exports.GetIdResponse$];
});
