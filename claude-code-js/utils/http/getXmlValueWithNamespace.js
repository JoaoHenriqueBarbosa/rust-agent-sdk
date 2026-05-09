// function: getXmlValueWithNamespace
function getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, serializedValue, options) {
  if (xmlNamespace && !["Composite", "Sequence", "Dictionary"].includes(typeName)) {
    let result = {};
    return result[options.xml.xmlCharKey] = serializedValue, result[XML_ATTRKEY] = { [xmlnsKey]: xmlNamespace }, result;
  }
  return serializedValue;
}
