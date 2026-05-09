// var: init_axios
var init_axios = __esm(() => {
  init_utils();
  init_Axios();
  init_mergeConfig();
  init_defaults();
  init_formDataToJSON();
  init_CanceledError();
  init_CancelToken();
  init_toFormData();
  init_AxiosError();
  init_isAxiosError();
  init_AxiosHeaders();
  init_adapters();
  init_HttpStatusCode();
  axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION2;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  axios_default = axios;
});
