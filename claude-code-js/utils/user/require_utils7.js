// var: require_utils7
var require_utils7 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.parseKeyPairsIntoRecord = exports.parsePairKeyValue = exports.getKeyPairs = exports.serializeKeyPairs = void 0;
  var api_1 = require_src7(), constants_1 = require_constants4();
  function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce((hValue, current) => {
      let value = `${hValue}${hValue !== "" ? constants_1.BAGGAGE_ITEMS_SEPARATOR : ""}${current}`;
      return value.length > constants_1.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
    }, "");
  }
  exports.serializeKeyPairs = serializeKeyPairs;
  function getKeyPairs(baggage) {
    return baggage.getAllEntries().map(([key2, value]) => {
      let entry = `${encodeURIComponent(key2)}=${encodeURIComponent(value.value)}`;
      if (value.metadata !== void 0)
        entry += constants_1.BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
      return entry;
    });
  }
  exports.getKeyPairs = getKeyPairs;
  function parsePairKeyValue(entry) {
    if (!entry)
      return;
    let metadataSeparatorIndex = entry.indexOf(constants_1.BAGGAGE_PROPERTIES_SEPARATOR), keyPairPart = metadataSeparatorIndex === -1 ? entry : entry.substring(0, metadataSeparatorIndex), separatorIndex = keyPairPart.indexOf(constants_1.BAGGAGE_KEY_PAIR_SEPARATOR);
    if (separatorIndex <= 0)
      return;
    let rawKey = keyPairPart.substring(0, separatorIndex).trim(), rawValue = keyPairPart.substring(separatorIndex + 1).trim();
    if (!rawKey || !rawValue)
      return;
    let key2, value;
    try {
      key2 = decodeURIComponent(rawKey), value = decodeURIComponent(rawValue);
    } catch {
      return;
    }
    let metadata;
    if (metadataSeparatorIndex !== -1 && metadataSeparatorIndex < entry.length - 1) {
      let metadataString = entry.substring(metadataSeparatorIndex + 1);
      metadata = (0, api_1.baggageEntryMetadataFromString)(metadataString);
    }
    return { key: key2, value, metadata };
  }
  exports.parsePairKeyValue = parsePairKeyValue;
  function parseKeyPairsIntoRecord(value) {
    let result = {};
    if (typeof value === "string" && value.length > 0)
      value.split(constants_1.BAGGAGE_ITEMS_SEPARATOR).forEach((entry) => {
        let keyPair = parsePairKeyValue(entry);
        if (keyPair !== void 0 && keyPair.value.length > 0)
          result[keyPair.key] = keyPair.value;
      });
    return result;
  }
  exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;
});
