// function: prepareXMLRootList
function prepareXMLRootList(obj, elementName, xmlNamespaceKey, xmlNamespace) {
  if (!Array.isArray(obj))
    obj = [obj];
  if (!xmlNamespaceKey || !xmlNamespace)
    return { [elementName]: obj };
  let result = { [elementName]: obj };
  return result[XML_ATTRKEY] = { [xmlNamespaceKey]: xmlNamespace }, result;
}
