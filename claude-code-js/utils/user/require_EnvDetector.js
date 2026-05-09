// var: require_EnvDetector
var require_EnvDetector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.envDetector = void 0;
  var api_1 = require_src7(), semantic_conventions_1 = require_src8(), core_1 = require_src9();

  class EnvDetector {
    _MAX_LENGTH = 255;
    _COMMA_SEPARATOR = ",";
    _LABEL_KEY_VALUE_SPLITTER = "=";
    detect(_config2) {
      let attributes = {}, rawAttributes = (0, core_1.getStringFromEnv)("OTEL_RESOURCE_ATTRIBUTES"), serviceName = (0, core_1.getStringFromEnv)("OTEL_SERVICE_NAME");
      if (rawAttributes)
        try {
          let parsedAttributes = this._parseResourceAttributes(rawAttributes);
          Object.assign(attributes, parsedAttributes);
        } catch (e) {
          api_1.diag.debug(`EnvDetector failed: ${e instanceof Error ? e.message : e}`);
        }
      if (serviceName)
        attributes[semantic_conventions_1.ATTR_SERVICE_NAME] = serviceName;
      return { attributes };
    }
    _parseResourceAttributes(rawEnvAttributes) {
      if (!rawEnvAttributes)
        return {};
      let attributes = {}, rawAttributes = rawEnvAttributes.split(this._COMMA_SEPARATOR);
      for (let rawAttribute of rawAttributes) {
        let keyValuePair = rawAttribute.split(this._LABEL_KEY_VALUE_SPLITTER);
        if (keyValuePair.length !== 2)
          throw Error(`Invalid format for OTEL_RESOURCE_ATTRIBUTES: "${rawAttribute}". Expected format: key=value. The ',' and '=' characters must be percent-encoded in keys and values.`);
        let [rawKey, rawValue] = keyValuePair, key2 = rawKey.trim(), value = rawValue.trim();
        if (key2.length === 0)
          throw Error(`Invalid OTEL_RESOURCE_ATTRIBUTES: empty attribute key in "${rawAttribute}".`);
        let decodedKey, decodedValue;
        try {
          decodedKey = decodeURIComponent(key2), decodedValue = decodeURIComponent(value);
        } catch (e) {
          throw Error(`Failed to percent-decode OTEL_RESOURCE_ATTRIBUTES entry "${rawAttribute}": ${e instanceof Error ? e.message : e}`);
        }
        if (decodedKey.length > this._MAX_LENGTH)
          throw Error(`Attribute key exceeds the maximum length of ${this._MAX_LENGTH} characters: "${decodedKey}".`);
        if (decodedValue.length > this._MAX_LENGTH)
          throw Error(`Attribute value exceeds the maximum length of ${this._MAX_LENGTH} characters for key "${decodedKey}".`);
        attributes[decodedKey] = decodedValue;
      }
      return attributes;
    }
  }
  exports.envDetector = new EnvDetector;
});
