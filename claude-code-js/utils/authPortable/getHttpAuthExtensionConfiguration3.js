// var: getHttpAuthExtensionConfiguration3
var getHttpAuthExtensionConfiguration3 = (runtimeConfig) => {
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
}, resolveHttpAuthRuntimeConfig3 = (config6) => {
  return {
    httpAuthSchemes: config6.httpAuthSchemes(),
    httpAuthSchemeProvider: config6.httpAuthSchemeProvider(),
    credentials: config6.credentials()
  };
};
