// var: init_toFormData
var init_toFormData = __esm(() => {
  init_utils();
  init_AxiosError();
  init_FormData();
  predicates = utils_default.toFlatObject(utils_default, {}, null, function(prop) {
    return /^is[A-Z]/.test(prop);
  });
  toFormData_default = toFormData;
});
