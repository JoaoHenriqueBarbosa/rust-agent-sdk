// var: checkFileSupport
var checkFileSupport = () => {
  if (typeof File > "u") {
    let { process: process2 } = globalThis, isOldNode = typeof process2?.versions?.node === "string" && parseInt(process2.versions.node.split(".")) < 20;
    throw Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
}, isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function", multipartFormRequestOptions = async (opts, fetch2) => {
  return { ...opts, body: await createForm(opts.body, fetch2) };
}, supportsFormDataMap, createForm = async (body, fetch2) => {
  if (!await supportsFormData(fetch2))
    throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  let form = new FormData;
  return await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value))), form;
}, isNamedBlob = (value) => value instanceof Blob && ("name" in value), addFormValue = async (form, key, value) => {
  if (value === void 0)
    return;
  if (value == null)
    throw TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    form.append(key, String(value));
  else if (value instanceof Response) {
    let options = {}, contentType = value.headers.get("Content-Type");
    if (contentType)
      options = { type: contentType };
    form.append(key, makeFile([await value.blob()], getName(value), options));
  } else if (isAsyncIterable(value))
    form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value)));
  else if (isNamedBlob(value))
    form.append(key, makeFile([value], getName(value), { type: value.type }));
  else if (Array.isArray(value))
    await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
  else if (typeof value === "object")
    await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
  else
    throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
};
