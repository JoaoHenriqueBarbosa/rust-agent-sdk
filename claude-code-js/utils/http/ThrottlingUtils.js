// class: ThrottlingUtils
class ThrottlingUtils {
  static generateThrottlingStorageKey(thumbprint) {
    return `${THROTTLING_PREFIX}.${JSON.stringify(thumbprint)}`;
  }
  static preProcess(cacheManager, thumbprint, correlationId) {
    let key = ThrottlingUtils.generateThrottlingStorageKey(thumbprint), value = cacheManager.getThrottlingCache(key, correlationId);
    if (value) {
      if (value.throttleTime < Date.now()) {
        cacheManager.removeItem(key, correlationId);
        return;
      }
      throw new ServerError(value.errorCodes?.join(" ") || "", value.errorMessage, value.subError);
    }
  }
  static postProcess(cacheManager, thumbprint, response7, correlationId) {
    if (ThrottlingUtils.checkResponseStatus(response7) || ThrottlingUtils.checkResponseForRetryAfter(response7)) {
      let thumbprintValue = {
        throttleTime: ThrottlingUtils.calculateThrottleTime(parseInt(response7.headers[HeaderNames.RETRY_AFTER])),
        error: response7.body.error,
        errorCodes: response7.body.error_codes,
        errorMessage: response7.body.error_description,
        subError: response7.body.suberror
      };
      cacheManager.setThrottlingCache(ThrottlingUtils.generateThrottlingStorageKey(thumbprint), thumbprintValue, correlationId);
    }
  }
  static checkResponseStatus(response7) {
    return response7.status === 429 || response7.status >= 500 && response7.status < 600;
  }
  static checkResponseForRetryAfter(response7) {
    if (response7.headers)
      return response7.headers.hasOwnProperty(HeaderNames.RETRY_AFTER) && (response7.status < 200 || response7.status >= 300);
    return !1;
  }
  static calculateThrottleTime(throttleTime) {
    let time3 = throttleTime <= 0 ? 0 : throttleTime, currentSeconds = Date.now() / 1000;
    return Math.floor(Math.min(currentSeconds + (time3 || DEFAULT_THROTTLE_TIME_SECONDS), currentSeconds + DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000);
  }
  static removeThrottle(cacheManager, clientId, request2, homeAccountIdentifier) {
    let thumbprint = getRequestThumbprint(clientId, request2, homeAccountIdentifier), key = this.generateThrottlingStorageKey(thumbprint);
    cacheManager.removeItem(key, request2.correlationId);
  }
}
