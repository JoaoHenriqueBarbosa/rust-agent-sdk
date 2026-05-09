// function: getAdapter
function getAdapter(adapters, config2) {
  adapters = utils_default.isArray(adapters) ? adapters : [adapters];
  let { length } = adapters, nameOrAdapter, adapter2, rejectedReasons = {};
  for (let i2 = 0;i2 < length; i2++) {
    nameOrAdapter = adapters[i2];
    let id;
    if (adapter2 = nameOrAdapter, !isResolvedHandle(nameOrAdapter)) {
      if (adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()], adapter2 === void 0)
        throw new AxiosError_default(`Unknown adapter '${id}'`);
    }
    if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config2))))
      break;
    rejectedReasons[id || "#" + i2] = adapter2;
  }
  if (!adapter2) {
    let reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === !1 ? "is not supported by the environment" : "is not available in the build")), s = length ? reasons.length > 1 ? `since :
` + reasons.map(renderReason).join(`
`) : " " + renderReason(reasons[0]) : "as no adapter specified";
    throw new AxiosError_default("There is no suitable adapter to dispatch the request " + s, "ERR_NOT_SUPPORT");
  }
  return adapter2;
}
