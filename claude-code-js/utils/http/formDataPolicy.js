// function: formDataPolicy
function formDataPolicy() {
  return {
    name: formDataPolicyName,
    async sendRequest(request2, next) {
      if (isNodeLike && typeof FormData < "u" && request2.body instanceof FormData)
        request2.formData = formDataToFormDataMap(request2.body), request2.body = void 0;
      if (request2.formData) {
        let contentType = request2.headers.get("Content-Type");
        if (contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1)
          request2.body = wwwFormUrlEncode(request2.formData);
        else
          await prepareFormData(request2.formData, request2);
        request2.formData = void 0;
      }
      return next(request2);
    }
  };
}
