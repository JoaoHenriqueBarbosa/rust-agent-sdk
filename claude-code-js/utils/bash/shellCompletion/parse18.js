// function: parse18
function parse18(query3, options2, {
  auto = !0
} = {}) {
  let next2 = (query4) => {
    if (isString2(query4)) {
      let obj = {
        keyId: null,
        pattern: query4
      };
      if (auto)
        obj.searcher = createSearcher(query4, options2);
      return obj;
    }
    let keys3 = Object.keys(query4), isQueryPath = isPath(query4);
    if (!isQueryPath && keys3.length > 1 && !isExpression(query4))
      return next2(convertToExplicit(query4));
    if (isLeaf(query4)) {
      let key3 = isQueryPath ? query4[KeyType.PATH] : keys3[0], pattern = isQueryPath ? query4[KeyType.PATTERN] : query4[key3];
      if (!isString2(pattern))
        throw Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key3));
      let obj = {
        keyId: createKeyId(key3),
        pattern
      };
      if (auto)
        obj.searcher = createSearcher(pattern, options2);
      return obj;
    }
    let node2 = {
      children: [],
      operator: keys3[0]
    };
    return keys3.forEach((key3) => {
      let value = query4[key3];
      if (isArray8(value))
        value.forEach((item) => {
          node2.children.push(next2(item));
        });
    }), node2;
  };
  if (!isExpression(query3))
    query3 = convertToExplicit(query3);
  return next2(query3);
}
