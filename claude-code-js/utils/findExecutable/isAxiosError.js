// function: isAxiosError
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === !0;
}
