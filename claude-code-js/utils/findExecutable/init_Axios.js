// var: init_Axios
var init_Axios = __esm(() => {
  init_utils();
  init_buildURL();
  init_InterceptorManager();
  init_dispatchRequest();
  init_mergeConfig();
  init_buildFullPath();
  init_validator();
  init_AxiosHeaders();
  init_transitional();
  validators2 = validator_default.validators;
  utils_default.forEach(["delete", "get", "head", "options"], function(method) {
    Axios.prototype[method] = function(url3, config2) {
      return this.request(mergeConfig(config2 || {}, {
        method,
        url: url3,
        data: (config2 || {}).data
      }));
    };
  });
  utils_default.forEach(["post", "put", "patch"], function(method) {
    function generateHTTPMethod(isForm) {
      return function(url3, data, config2) {
        return this.request(mergeConfig(config2 || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: url3,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod(), Axios.prototype[method + "Form"] = generateHTTPMethod(!0);
  });
  Axios_default = Axios;
});
