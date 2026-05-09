// class: StringUtils
class StringUtils {
  static isEmptyObj(strObj) {
    if (strObj)
      try {
        let obj = JSON.parse(strObj);
        return Object.keys(obj).length === 0;
      } catch (e) {}
    return !0;
  }
  static startsWith(str, search) {
    return str.indexOf(search) === 0;
  }
  static endsWith(str, search) {
    return str.length >= search.length && str.lastIndexOf(search) === str.length - search.length;
  }
  static queryStringToObject(query) {
    let obj = {}, params = query.split("&"), decode = (s2) => decodeURIComponent(s2.replace(/\+/g, " "));
    return params.forEach((pair) => {
      if (pair.trim()) {
        let [key, value] = pair.split(/=(.+)/g, 2);
        if (key && value)
          obj[decode(key)] = decode(value);
      }
    }), obj;
  }
  static trimArrayEntries(arr) {
    return arr.map((entry) => entry.trim());
  }
  static removeEmptyStringsFromArray(arr) {
    return arr.filter((entry) => {
      return !!entry;
    });
  }
  static jsonParseHelper(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }
}
