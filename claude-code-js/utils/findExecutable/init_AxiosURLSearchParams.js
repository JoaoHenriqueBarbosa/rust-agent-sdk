// var: init_AxiosURLSearchParams
var init_AxiosURLSearchParams = __esm(() => {
  init_toFormData();
  prototype = AxiosURLSearchParams.prototype;
  prototype.append = function(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function(encoder) {
    let _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  AxiosURLSearchParams_default = AxiosURLSearchParams;
});
