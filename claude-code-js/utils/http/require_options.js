// var: require_options
var require_options = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validate = validate3;
  function validate3(options) {
    let vpairs = [
      { invalid: "uri", expected: "url" },
      { invalid: "json", expected: "data" },
      { invalid: "qs", expected: "params" }
    ];
    for (let pair of vpairs)
      if (options[pair.invalid]) {
        let e = `'${pair.invalid}' is not a valid configuration option. Please use '${pair.expected}' instead. This library is using Axios for requests. Please see https://github.com/axios/axios to learn more about the valid request options.`;
        throw Error(e);
      }
  }
});
