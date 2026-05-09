// var: require_httpAuthExtensionConfiguration
var require_httpAuthExtensionConfiguration = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.resolveHttpAuthRuntimeConfig = exports.getHttpAuthExtensionConfiguration = void 0;
  var getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    let { httpAuthSchemes: _httpAuthSchemes, httpAuthSchemeProvider: _httpAuthSchemeProvider, credentials: _credentials } = runtimeConfig;
    return {
      setHttpAuthScheme(httpAuthScheme) {
        let index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
        if (index === -1)
          _httpAuthSchemes.push(httpAuthScheme);
        else
          _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      },
      httpAuthSchemes() {
        return _httpAuthSchemes;
      },
      setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
        _httpAuthSchemeProvider = httpAuthSchemeProvider;
      },
      httpAuthSchemeProvider() {
        return _httpAuthSchemeProvider;
      },
      setCredentials(credentials) {
        _credentials = credentials;
      },
      credentials() {
        return _credentials;
      }
    };
  };
  exports.getHttpAuthExtensionConfiguration = getHttpAuthExtensionConfiguration;
  var resolveHttpAuthRuntimeConfig = (config3) => {
    return {
      httpAuthSchemes: config3.httpAuthSchemes(),
      httpAuthSchemeProvider: config3.httpAuthSchemeProvider(),
      credentials: config3.credentials()
    };
  };
  exports.resolveHttpAuthRuntimeConfig = resolveHttpAuthRuntimeConfig;
});
