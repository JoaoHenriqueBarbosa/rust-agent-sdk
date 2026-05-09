// function: supportsFormData
function supportsFormData(fetchObject) {
  let fetch2 = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch, cached = supportsFormDataMap.get(fetch2);
  if (cached)
    return cached;
  let promise = (async () => {
    try {
      let FetchResponse = "Response" in fetch2 ? fetch2.Response : (await fetch2("data:,")).constructor, data = new FormData;
      if (data.toString() === await new FetchResponse(data).text())
        return !1;
      return !0;
    } catch {
      return !0;
    }
  })();
  return supportsFormDataMap.set(fetch2, promise), promise;
}
