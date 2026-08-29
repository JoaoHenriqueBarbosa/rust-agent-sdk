// function: httpRequest
function httpRequest(options) {
  return new Promise((resolve8, reject) => {
    let req = request({
      method: "GET",
      ...options,
      hostname: options.hostname?.replace(/^\[(.+)\]$/, "$1")
    });
    req.on("error", (err) => {
      reject(Object.assign(new import_property_provider2.ProviderError("Unable to connect to instance metadata service"), err)), req.destroy();
    }), req.on("timeout", () => {
      reject(new import_property_provider2.ProviderError("TimeoutError from instance metadata service")), req.destroy();
    }), req.on("response", (res) => {
      let { statusCode = 400 } = res;
      if (statusCode < 200 || 300 <= statusCode)
        reject(Object.assign(new import_property_provider2.ProviderError("Error response received from instance metadata service"), { statusCode })), req.destroy();
      let chunks = [];
      res.on("data", (chunk) => {
        chunks.push(chunk);
      }), res.on("end", () => {
        resolve8(Buffer7.concat(chunks)), req.destroy();
      });
    }), req.end();
  });
}
