// function: matchHeaderValue
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2))
    return filter2.call(this, value, header);
  if (isHeaderNameFilter)
    value = header;
  if (!utils_default.isString(value))
    return;
  if (utils_default.isString(filter2))
    return value.indexOf(filter2) !== -1;
  if (utils_default.isRegExp(filter2))
    return filter2.test(value);
}
