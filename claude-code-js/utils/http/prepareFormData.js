// function: prepareFormData
async function prepareFormData(formData, request2) {
  let contentType = request2.headers.get("Content-Type");
  if (contentType && !contentType.startsWith("multipart/form-data"))
    return;
  request2.headers.set("Content-Type", contentType ?? "multipart/form-data");
  let parts = [];
  for (let [fieldName, values2] of Object.entries(formData))
    for (let value of Array.isArray(values2) ? values2 : [values2])
      if (typeof value === "string")
        parts.push({
          headers: createHttpHeaders({
            "Content-Disposition": `form-data; name="${fieldName}"`
          }),
          body: stringToUint8Array2(value, "utf-8")
        });
      else if (value === void 0 || value === null || typeof value !== "object")
        throw Error(`Unexpected value for key ${fieldName}: ${value}. Value should be serialized to string first.`);
      else {
        let fileName = value.name || "blob", headers = createHttpHeaders();
        headers.set("Content-Disposition", `form-data; name="${fieldName}"; filename="${fileName}"`), headers.set("Content-Type", value.type || "application/octet-stream"), parts.push({
          headers,
          body: value
        });
      }
  request2.multipartBody = { parts };
}
