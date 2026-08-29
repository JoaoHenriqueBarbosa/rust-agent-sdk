// var: DEFAULT_RETRY_POLICY_COUNT
var DEFAULT_RETRY_POLICY_COUNT = 3;

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/decompressResponsePolicy.js
function decompressResponsePolicy() {
  return {
    name: "decompressResponsePolicy",
    async sendRequest(request2, next) {
      if (request2.method !== "HEAD")
        request2.headers.set("Accept-Encoding", "gzip,deflate");
      return next(request2);
    }
  };
}
