// var: progressEventReducer
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0, _speedometer = speedometer_default(50, 250);
  return throttle_default((e) => {
    let loaded = e.loaded, total = e.lengthComputable ? e.total : void 0, progressBytes = loaded - bytesNotified, rate = _speedometer(progressBytes), inRange = loaded <= total;
    bytesNotified = loaded;
    let data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: !0
    };
    listener(data);
  }, freq);
}, progressEventDecorator = (total, throttled) => {
  let lengthComputable = total != null;
  return [
    (loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }),
    throttled[1]
  ];
}, asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));
