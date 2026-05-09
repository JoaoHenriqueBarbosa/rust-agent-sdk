// var: require_utils4
var require_utils4 = __commonJS((exports, module) => {
  var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function stringArrayToHexStripped(input) {
    let acc = "", code = 0, i5 = 0;
    for (i5 = 0;i5 < input.length; i5++) {
      if (code = input[i5].charCodeAt(0), code === 48)
        continue;
      if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102))
        return "";
      acc += input[i5];
      break;
    }
    for (i5 += 1;i5 < input.length; i5++) {
      if (code = input[i5].charCodeAt(0), !(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102))
        return "";
      acc += input[i5];
    }
    return acc;
  }
  var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function consumeIsZone(buffer) {
    return buffer.length = 0, !0;
  }
  function consumeHextets(buffer, address, output) {
    if (buffer.length) {
      let hex = stringArrayToHexStripped(buffer);
      if (hex !== "")
        address.push(hex);
      else
        return output.error = !0, !1;
      buffer.length = 0;
    }
    return !0;
  }
  function getIPV6(input) {
    let tokenCount = 0, output = { error: !1, address: "", zone: "" }, address = [], buffer = [], endipv6Encountered = !1, endIpv6 = !1, consume = consumeHextets;
    for (let i5 = 0;i5 < input.length; i5++) {
      let cursor = input[i5];
      if (cursor === "[" || cursor === "]")
        continue;
      if (cursor === ":") {
        if (endipv6Encountered === !0)
          endIpv6 = !0;
        if (!consume(buffer, address, output))
          break;
        if (++tokenCount > 7) {
          output.error = !0;
          break;
        }
        if (i5 > 0 && input[i5 - 1] === ":")
          endipv6Encountered = !0;
        address.push(":");
        continue;
      } else if (cursor === "%") {
        if (!consume(buffer, address, output))
          break;
        consume = consumeIsZone;
      } else {
        buffer.push(cursor);
        continue;
      }
    }
    if (buffer.length)
      if (consume === consumeIsZone)
        output.zone = buffer.join("");
      else if (endIpv6)
        address.push(buffer.join(""));
      else
        address.push(stringArrayToHexStripped(buffer));
    return output.address = address.join(""), output;
  }
  function normalizeIPv6(host) {
    if (findToken(host, ":") < 2)
      return { host, isIPV6: !1 };
    let ipv63 = getIPV6(host);
    if (!ipv63.error) {
      let { address: newHost, address: escapedHost } = ipv63;
      if (ipv63.zone)
        newHost += "%" + ipv63.zone, escapedHost += "%25" + ipv63.zone;
      return { host: newHost, isIPV6: !0, escapedHost };
    } else
      return { host, isIPV6: !1 };
  }
  function findToken(str, token) {
    let ind = 0;
    for (let i5 = 0;i5 < str.length; i5++)
      if (str[i5] === token)
        ind++;
    return ind;
  }
  function removeDotSegments(path16) {
    let input = path16, output = [], nextSlash = -1, len = 0;
    while (len = input.length) {
      if (len === 1)
        if (input === ".")
          break;
        else if (input === "/") {
          output.push("/");
          break;
        } else {
          output.push(input);
          break;
        }
      else if (len === 2) {
        if (input[0] === ".") {
          if (input[1] === ".")
            break;
          else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === "." || input[1] === "/") {
            output.push("/");
            break;
          }
        }
      } else if (len === 3) {
        if (input === "/..") {
          if (output.length !== 0)
            output.pop();
          output.push("/");
          break;
        }
      }
      if (input[0] === ".") {
        if (input[1] === ".") {
          if (input[2] === "/") {
            input = input.slice(3);
            continue;
          }
        } else if (input[1] === "/") {
          input = input.slice(2);
          continue;
        }
      } else if (input[0] === "/") {
        if (input[1] === ".") {
          if (input[2] === "/") {
            input = input.slice(2);
            continue;
          } else if (input[2] === ".") {
            if (input[3] === "/") {
              if (input = input.slice(3), output.length !== 0)
                output.pop();
              continue;
            }
          }
        }
      }
      if ((nextSlash = input.indexOf("/", 1)) === -1) {
        output.push(input);
        break;
      } else
        output.push(input.slice(0, nextSlash)), input = input.slice(nextSlash);
    }
    return output.join("");
  }
  function normalizeComponentEncoding(component, esc2) {
    let func = esc2 !== !0 ? escape : unescape;
    if (component.scheme !== void 0)
      component.scheme = func(component.scheme);
    if (component.userinfo !== void 0)
      component.userinfo = func(component.userinfo);
    if (component.host !== void 0)
      component.host = func(component.host);
    if (component.path !== void 0)
      component.path = func(component.path);
    if (component.query !== void 0)
      component.query = func(component.query);
    if (component.fragment !== void 0)
      component.fragment = func(component.fragment);
    return component;
  }
  function recomposeAuthority(component) {
    let uriTokens = [];
    if (component.userinfo !== void 0)
      uriTokens.push(component.userinfo), uriTokens.push("@");
    if (component.host !== void 0) {
      let host = unescape(component.host);
      if (!isIPv4(host)) {
        let ipV6res = normalizeIPv6(host);
        if (ipV6res.isIPV6 === !0)
          host = `[${ipV6res.escapedHost}]`;
        else
          host = component.host;
      }
      uriTokens.push(host);
    }
    if (typeof component.port === "number" || typeof component.port === "string")
      uriTokens.push(":"), uriTokens.push(String(component.port));
    return uriTokens.length ? uriTokens.join("") : void 0;
  }
  module.exports = {
    nonSimpleDomain,
    recomposeAuthority,
    normalizeComponentEncoding,
    removeDotSegments,
    isIPv4,
    isUUID,
    normalizeIPv6,
    stringArrayToHexStripped
  };
});
