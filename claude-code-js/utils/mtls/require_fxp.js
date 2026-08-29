// var: require_fxp
var require_fxp = __commonJS((exports, module) => {
  (() => {
    var t = { d: (e2, i3) => {
      for (var n3 in i3)
        t.o(i3, n3) && !t.o(e2, n3) && Object.defineProperty(e2, n3, { enumerable: !0, get: i3[n3] });
    }, o: (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), r: (t2) => {
      typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: !0 });
    } }, e = {};
    t.r(e), t.d(e, { XMLBuilder: () => $t, XMLParser: () => gt, XMLValidator: () => It });
    let i2 = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", n2 = new RegExp("^[" + i2 + "][" + i2 + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
    function s(t2, e2) {
      let i3 = [], n3 = e2.exec(t2);
      for (;n3; ) {
        let s2 = [];
        s2.startIndex = e2.lastIndex - n3[0].length;
        let r2 = n3.length;
        for (let t3 = 0;t3 < r2; t3++)
          s2.push(n3[t3]);
        i3.push(s2), n3 = e2.exec(t2);
      }
      return i3;
    }
    let r = function(t2) {
      return n2.exec(t2) != null;
    }, o2 = ["hasOwnProperty", "toString", "valueOf", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"], a2 = ["__proto__", "constructor", "prototype"], h2 = { allowBooleanAttributes: !1, unpairedTags: [] };
    function l(t2, e2) {
      e2 = Object.assign({}, h2, e2);
      let i3 = [], n3 = !1, s2 = !1;
      t2[0] === "\uFEFF" && (t2 = t2.substr(1));
      for (let r2 = 0;r2 < t2.length; r2++)
        if (t2[r2] === "<" && t2[r2 + 1] === "?") {
          if (r2 += 2, r2 = u4(t2, r2), r2.err)
            return r2;
        } else {
          if (t2[r2] !== "<") {
            if (p(t2[r2]))
              continue;
            return b("InvalidChar", "char '" + t2[r2] + "' is not expected.", w(t2, r2));
          }
          {
            let o3 = r2;
            if (r2++, t2[r2] === "!") {
              r2 = c3(t2, r2);
              continue;
            }
            {
              let a3 = !1;
              t2[r2] === "/" && (a3 = !0, r2++);
              let h3 = "";
              for (;r2 < t2.length && t2[r2] !== ">" && t2[r2] !== " " && t2[r2] !== "\t" && t2[r2] !== `
` && t2[r2] !== "\r"; r2++)
                h3 += t2[r2];
              if (h3 = h3.trim(), h3[h3.length - 1] === "/" && (h3 = h3.substring(0, h3.length - 1), r2--), !y(h3)) {
                let e3;
                return e3 = h3.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + h3 + "' is an invalid name.", b("InvalidTag", e3, w(t2, r2));
              }
              let l2 = g(t2, r2);
              if (l2 === !1)
                return b("InvalidAttr", "Attributes for '" + h3 + "' have open quote.", w(t2, r2));
              let d2 = l2.value;
              if (r2 = l2.index, d2[d2.length - 1] === "/") {
                let i4 = r2 - d2.length;
                d2 = d2.substring(0, d2.length - 1);
                let s3 = x2(d2, e2);
                if (s3 !== !0)
                  return b(s3.err.code, s3.err.msg, w(t2, i4 + s3.err.line));
                n3 = !0;
              } else if (a3) {
                if (!l2.tagClosed)
                  return b("InvalidTag", "Closing tag '" + h3 + "' doesn't have proper closing.", w(t2, r2));
                if (d2.trim().length > 0)
                  return b("InvalidTag", "Closing tag '" + h3 + "' can't have attributes or invalid starting.", w(t2, o3));
                if (i3.length === 0)
                  return b("InvalidTag", "Closing tag '" + h3 + "' has not been opened.", w(t2, o3));
                {
                  let e3 = i3.pop();
                  if (h3 !== e3.tagName) {
                    let i4 = w(t2, e3.tagStartPos);
                    return b("InvalidTag", "Expected closing tag '" + e3.tagName + "' (opened in line " + i4.line + ", col " + i4.col + ") instead of closing tag '" + h3 + "'.", w(t2, o3));
                  }
                  i3.length == 0 && (s2 = !0);
                }
              } else {
                let a4 = x2(d2, e2);
                if (a4 !== !0)
                  return b(a4.err.code, a4.err.msg, w(t2, r2 - d2.length + a4.err.line));
                if (s2 === !0)
                  return b("InvalidXml", "Multiple possible root nodes found.", w(t2, r2));
                e2.unpairedTags.indexOf(h3) !== -1 || i3.push({ tagName: h3, tagStartPos: o3 }), n3 = !0;
              }
              for (r2++;r2 < t2.length; r2++)
                if (t2[r2] === "<") {
                  if (t2[r2 + 1] === "!") {
                    r2++, r2 = c3(t2, r2);
                    continue;
                  }
                  if (t2[r2 + 1] !== "?")
                    break;
                  if (r2 = u4(t2, ++r2), r2.err)
                    return r2;
                } else if (t2[r2] === "&") {
                  let e3 = N(t2, r2);
                  if (e3 == -1)
                    return b("InvalidChar", "char '&' is not expected.", w(t2, r2));
                  r2 = e3;
                } else if (s2 === !0 && !p(t2[r2]))
                  return b("InvalidXml", "Extra text at the end", w(t2, r2));
              t2[r2] === "<" && r2--;
            }
          }
        }
      return n3 ? i3.length == 1 ? b("InvalidTag", "Unclosed tag '" + i3[0].tagName + "'.", w(t2, i3[0].tagStartPos)) : !(i3.length > 0) || b("InvalidXml", "Invalid '" + JSON.stringify(i3.map((t3) => t3.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 }) : b("InvalidXml", "Start tag expected.", 1);
    }
    function p(t2) {
      return t2 === " " || t2 === "\t" || t2 === `
` || t2 === "\r";
    }
    function u4(t2, e2) {
      let i3 = e2;
      for (;e2 < t2.length; e2++)
        if (t2[e2] == "?" || t2[e2] == " ") {
          let n3 = t2.substr(i3, e2 - i3);
          if (e2 > 5 && n3 === "xml")
            return b("InvalidXml", "XML declaration allowed only at the start of the document.", w(t2, e2));
          if (t2[e2] == "?" && t2[e2 + 1] == ">") {
            e2++;
            break;
          }
          continue;
        }
      return e2;
    }
    function c3(t2, e2) {
      if (t2.length > e2 + 5 && t2[e2 + 1] === "-" && t2[e2 + 2] === "-") {
        for (e2 += 3;e2 < t2.length; e2++)
          if (t2[e2] === "-" && t2[e2 + 1] === "-" && t2[e2 + 2] === ">") {
            e2 += 2;
            break;
          }
      } else if (t2.length > e2 + 8 && t2[e2 + 1] === "D" && t2[e2 + 2] === "O" && t2[e2 + 3] === "C" && t2[e2 + 4] === "T" && t2[e2 + 5] === "Y" && t2[e2 + 6] === "P" && t2[e2 + 7] === "E") {
        let i3 = 1;
        for (e2 += 8;e2 < t2.length; e2++)
          if (t2[e2] === "<")
            i3++;
          else if (t2[e2] === ">" && (i3--, i3 === 0))
            break;
      } else if (t2.length > e2 + 9 && t2[e2 + 1] === "[" && t2[e2 + 2] === "C" && t2[e2 + 3] === "D" && t2[e2 + 4] === "A" && t2[e2 + 5] === "T" && t2[e2 + 6] === "A" && t2[e2 + 7] === "[") {
        for (e2 += 8;e2 < t2.length; e2++)
          if (t2[e2] === "]" && t2[e2 + 1] === "]" && t2[e2 + 2] === ">") {
            e2 += 2;
            break;
          }
      }
      return e2;
    }
    let d = '"', f = "'";
    function g(t2, e2) {
      let i3 = "", n3 = "", s2 = !1;
      for (;e2 < t2.length; e2++) {
        if (t2[e2] === d || t2[e2] === f)
          n3 === "" ? n3 = t2[e2] : n3 !== t2[e2] || (n3 = "");
        else if (t2[e2] === ">" && n3 === "") {
          s2 = !0;
          break;
        }
        i3 += t2[e2];
      }
      return n3 === "" && { value: i3, index: e2, tagClosed: s2 };
    }
    let m = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function x2(t2, e2) {
      let i3 = s(t2, m), n3 = {};
      for (let t3 = 0;t3 < i3.length; t3++) {
        if (i3[t3][1].length === 0)
          return b("InvalidAttr", "Attribute '" + i3[t3][2] + "' has no space in starting.", v(i3[t3]));
        if (i3[t3][3] !== void 0 && i3[t3][4] === void 0)
          return b("InvalidAttr", "Attribute '" + i3[t3][2] + "' is without value.", v(i3[t3]));
        if (i3[t3][3] === void 0 && !e2.allowBooleanAttributes)
          return b("InvalidAttr", "boolean attribute '" + i3[t3][2] + "' is not allowed.", v(i3[t3]));
        let s2 = i3[t3][2];
        if (!E(s2))
          return b("InvalidAttr", "Attribute '" + s2 + "' is an invalid name.", v(i3[t3]));
        if (Object.prototype.hasOwnProperty.call(n3, s2))
          return b("InvalidAttr", "Attribute '" + s2 + "' is repeated.", v(i3[t3]));
        n3[s2] = 1;
      }
      return !0;
    }
    function N(t2, e2) {
      if (t2[++e2] === ";")
        return -1;
      if (t2[e2] === "#")
        return function(t3, e3) {
          let i4 = /\d/;
          for (t3[e3] === "x" && (e3++, i4 = /[\da-fA-F]/);e3 < t3.length; e3++) {
            if (t3[e3] === ";")
              return e3;
            if (!t3[e3].match(i4))
              break;
          }
          return -1;
        }(t2, ++e2);
      let i3 = 0;
      for (;e2 < t2.length; e2++, i3++)
        if (!(t2[e2].match(/\w/) && i3 < 20)) {
          if (t2[e2] === ";")
            break;
          return -1;
        }
      return e2;
    }
    function b(t2, e2, i3) {
      return { err: { code: t2, msg: e2, line: i3.line || i3, col: i3.col } };
    }
    function E(t2) {
      return r(t2);
    }
    function y(t2) {
      return r(t2);
    }
    function w(t2, e2) {
      let i3 = t2.substring(0, e2).split(/\r?\n/);
      return { line: i3.length, col: i3[i3.length - 1].length + 1 };
    }
    function v(t2) {
      return t2.startIndex + t2[1].length;
    }
    let T = (t2) => o2.includes(t2) ? "__" + t2 : t2, P2 = { preserveOrder: !1, attributeNamePrefix: "@_", attributesGroupName: !1, textNodeName: "#text", ignoreAttributes: !0, removeNSPrefix: !1, allowBooleanAttributes: !1, parseTagValue: !0, parseAttributeValue: !1, trimValues: !0, cdataPropName: !1, numberParseOptions: { hex: !0, leadingZeros: !0, eNotation: !0 }, tagValueProcessor: function(t2, e2) {
      return e2;
    }, attributeValueProcessor: function(t2, e2) {
      return e2;
    }, stopNodes: [], alwaysCreateTextNode: !1, isArray: () => !1, commentPropName: !1, unpairedTags: [], processEntities: !0, htmlEntities: !1, ignoreDeclaration: !1, ignorePiTags: !1, transformTagName: !1, transformAttributeName: !1, updateTag: function(t2, e2, i3) {
      return t2;
    }, captureMetaData: !1, maxNestedTags: 100, strictReservedNames: !0, jPath: !0, onDangerousProperty: T };
    function S2(t2, e2) {
      if (typeof t2 != "string")
        return;
      let i3 = t2.toLowerCase();
      if (o2.some((t3) => i3 === t3.toLowerCase()))
        throw Error(`[SECURITY] Invalid ${e2}: "${t2}" is a reserved JavaScript keyword that could cause prototype pollution`);
      if (a2.some((t3) => i3 === t3.toLowerCase()))
        throw Error(`[SECURITY] Invalid ${e2}: "${t2}" is a reserved JavaScript keyword that could cause prototype pollution`);
    }
    function A(t2) {
      return typeof t2 == "boolean" ? { enabled: t2, maxEntitySize: 1e4, maxExpansionDepth: 10, maxTotalExpansions: 1000, maxExpandedLength: 1e5, maxEntityCount: 100, allowedTags: null, tagFilter: null } : typeof t2 == "object" && t2 !== null ? { enabled: t2.enabled !== !1, maxEntitySize: Math.max(1, t2.maxEntitySize ?? 1e4), maxExpansionDepth: Math.max(1, t2.maxExpansionDepth ?? 10), maxTotalExpansions: Math.max(1, t2.maxTotalExpansions ?? 1000), maxExpandedLength: Math.max(1, t2.maxExpandedLength ?? 1e5), maxEntityCount: Math.max(1, t2.maxEntityCount ?? 100), allowedTags: t2.allowedTags ?? null, tagFilter: t2.tagFilter ?? null } : A(!0);
    }
    let O2 = function(t2) {
      let e2 = Object.assign({}, P2, t2), i3 = [{ value: e2.attributeNamePrefix, name: "attributeNamePrefix" }, { value: e2.attributesGroupName, name: "attributesGroupName" }, { value: e2.textNodeName, name: "textNodeName" }, { value: e2.cdataPropName, name: "cdataPropName" }, { value: e2.commentPropName, name: "commentPropName" }];
      for (let { value: t3, name: e3 } of i3)
        t3 && S2(t3, e3);
      return e2.onDangerousProperty === null && (e2.onDangerousProperty = T), e2.processEntities = A(e2.processEntities), e2.stopNodes && Array.isArray(e2.stopNodes) && (e2.stopNodes = e2.stopNodes.map((t3) => typeof t3 == "string" && t3.startsWith("*.") ? ".." + t3.substring(2) : t3)), e2;
    }, C2;
    C2 = typeof Symbol != "function" ? "@@xmlMetadata" : Symbol("XML Node Metadata");

    class $3 {
      constructor(t2) {
        this.tagname = t2, this.child = [], this[":@"] = Object.create(null);
      }
      add(t2, e2) {
        t2 === "__proto__" && (t2 = "#__proto__"), this.child.push({ [t2]: e2 });
      }
      addChild(t2, e2) {
        t2.tagname === "__proto__" && (t2.tagname = "#__proto__"), t2[":@"] && Object.keys(t2[":@"]).length > 0 ? this.child.push({ [t2.tagname]: t2.child, ":@": t2[":@"] }) : this.child.push({ [t2.tagname]: t2.child }), e2 !== void 0 && (this.child[this.child.length - 1][C2] = { startIndex: e2 });
      }
      static getMetaDataSymbol() {
        return C2;
      }
    }

    class I2 {
      constructor(t2) {
        this.suppressValidationErr = !t2, this.options = t2;
      }
      readDocType(t2, e2) {
        let i3 = Object.create(null), n3 = 0;
        if (t2[e2 + 3] !== "O" || t2[e2 + 4] !== "C" || t2[e2 + 5] !== "T" || t2[e2 + 6] !== "Y" || t2[e2 + 7] !== "P" || t2[e2 + 8] !== "E")
          throw Error("Invalid Tag instead of DOCTYPE");
        {
          e2 += 9;
          let s2 = 1, r2 = !1, o3 = !1, a3 = "";
          for (;e2 < t2.length; e2++)
            if (t2[e2] !== "<" || o3)
              if (t2[e2] === ">") {
                if (o3 ? t2[e2 - 1] === "-" && t2[e2 - 2] === "-" && (o3 = !1, s2--) : s2--, s2 === 0)
                  break;
              } else
                t2[e2] === "[" ? r2 = !0 : a3 += t2[e2];
            else {
              if (r2 && M2(t2, "!ENTITY", e2)) {
                let s3, r3;
                if (e2 += 7, [s3, r3, e2] = this.readEntityExp(t2, e2 + 1, this.suppressValidationErr), r3.indexOf("&") === -1) {
                  if (this.options.enabled !== !1 && this.options.maxEntityCount != null && n3 >= this.options.maxEntityCount)
                    throw Error(`Entity count (${n3 + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
                  let t3 = s3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  i3[s3] = { regx: RegExp(`&${t3};`, "g"), val: r3 }, n3++;
                }
              } else if (r2 && M2(t2, "!ELEMENT", e2)) {
                e2 += 8;
                let { index: i4 } = this.readElementExp(t2, e2 + 1);
                e2 = i4;
              } else if (r2 && M2(t2, "!ATTLIST", e2))
                e2 += 8;
              else if (r2 && M2(t2, "!NOTATION", e2)) {
                e2 += 9;
                let { index: i4 } = this.readNotationExp(t2, e2 + 1, this.suppressValidationErr);
                e2 = i4;
              } else {
                if (!M2(t2, "!--", e2))
                  throw Error("Invalid DOCTYPE");
                o3 = !0;
              }
              s2++, a3 = "";
            }
          if (s2 !== 0)
            throw Error("Unclosed DOCTYPE");
        }
        return { entities: i3, i: e2 };
      }
      readEntityExp(t2, e2) {
        let i3 = e2 = j2(t2, e2);
        for (;e2 < t2.length && !/\s/.test(t2[e2]) && t2[e2] !== '"' && t2[e2] !== "'"; )
          e2++;
        let n3 = t2.substring(i3, e2);
        if (_(n3), e2 = j2(t2, e2), !this.suppressValidationErr) {
          if (t2.substring(e2, e2 + 6).toUpperCase() === "SYSTEM")
            throw Error("External entities are not supported");
          if (t2[e2] === "%")
            throw Error("Parameter entities are not supported");
        }
        let s2 = "";
        if ([e2, s2] = this.readIdentifierVal(t2, e2, "entity"), this.options.enabled !== !1 && this.options.maxEntitySize != null && s2.length > this.options.maxEntitySize)
          throw Error(`Entity "${n3}" size (${s2.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
        return [n3, s2, --e2];
      }
      readNotationExp(t2, e2) {
        let i3 = e2 = j2(t2, e2);
        for (;e2 < t2.length && !/\s/.test(t2[e2]); )
          e2++;
        let n3 = t2.substring(i3, e2);
        !this.suppressValidationErr && _(n3), e2 = j2(t2, e2);
        let s2 = t2.substring(e2, e2 + 6).toUpperCase();
        if (!this.suppressValidationErr && s2 !== "SYSTEM" && s2 !== "PUBLIC")
          throw Error(`Expected SYSTEM or PUBLIC, found "${s2}"`);
        e2 += s2.length, e2 = j2(t2, e2);
        let r2 = null, o3 = null;
        if (s2 === "PUBLIC")
          [e2, r2] = this.readIdentifierVal(t2, e2, "publicIdentifier"), t2[e2 = j2(t2, e2)] !== '"' && t2[e2] !== "'" || ([e2, o3] = this.readIdentifierVal(t2, e2, "systemIdentifier"));
        else if (s2 === "SYSTEM" && ([e2, o3] = this.readIdentifierVal(t2, e2, "systemIdentifier"), !this.suppressValidationErr && !o3))
          throw Error("Missing mandatory system identifier for SYSTEM notation");
        return { notationName: n3, publicIdentifier: r2, systemIdentifier: o3, index: --e2 };
      }
      readIdentifierVal(t2, e2, i3) {
        let n3 = "", s2 = t2[e2];
        if (s2 !== '"' && s2 !== "'")
          throw Error(`Expected quoted string, found "${s2}"`);
        let r2 = ++e2;
        for (;e2 < t2.length && t2[e2] !== s2; )
          e2++;
        if (n3 = t2.substring(r2, e2), t2[e2] !== s2)
          throw Error(`Unterminated ${i3} value`);
        return [++e2, n3];
      }
      readElementExp(t2, e2) {
        let i3 = e2 = j2(t2, e2);
        for (;e2 < t2.length && !/\s/.test(t2[e2]); )
          e2++;
        let n3 = t2.substring(i3, e2);
        if (!this.suppressValidationErr && !r(n3))
          throw Error(`Invalid element name: "${n3}"`);
        let s2 = "";
        if (t2[e2 = j2(t2, e2)] === "E" && M2(t2, "MPTY", e2))
          e2 += 4;
        else if (t2[e2] === "A" && M2(t2, "NY", e2))
          e2 += 2;
        else if (t2[e2] === "(") {
          let i4 = ++e2;
          for (;e2 < t2.length && t2[e2] !== ")"; )
            e2++;
          if (s2 = t2.substring(i4, e2), t2[e2] !== ")")
            throw Error("Unterminated content model");
        } else if (!this.suppressValidationErr)
          throw Error(`Invalid Element Expression, found "${t2[e2]}"`);
        return { elementName: n3, contentModel: s2.trim(), index: e2 };
      }
      readAttlistExp(t2, e2) {
        let i3 = e2 = j2(t2, e2);
        for (;e2 < t2.length && !/\s/.test(t2[e2]); )
          e2++;
        let n3 = t2.substring(i3, e2);
        for (_(n3), i3 = e2 = j2(t2, e2);e2 < t2.length && !/\s/.test(t2[e2]); )
          e2++;
        let s2 = t2.substring(i3, e2);
        if (!_(s2))
          throw Error(`Invalid attribute name: "${s2}"`);
        e2 = j2(t2, e2);
        let r2 = "";
        if (t2.substring(e2, e2 + 8).toUpperCase() === "NOTATION") {
          if (r2 = "NOTATION", t2[e2 = j2(t2, e2 += 8)] !== "(")
            throw Error(`Expected '(', found "${t2[e2]}"`);
          e2++;
          let i4 = [];
          for (;e2 < t2.length && t2[e2] !== ")"; ) {
            let n4 = e2;
            for (;e2 < t2.length && t2[e2] !== "|" && t2[e2] !== ")"; )
              e2++;
            let s3 = t2.substring(n4, e2);
            if (s3 = s3.trim(), !_(s3))
              throw Error(`Invalid notation name: "${s3}"`);
            i4.push(s3), t2[e2] === "|" && (e2++, e2 = j2(t2, e2));
          }
          if (t2[e2] !== ")")
            throw Error("Unterminated list of notations");
          e2++, r2 += " (" + i4.join("|") + ")";
        } else {
          let i4 = e2;
          for (;e2 < t2.length && !/\s/.test(t2[e2]); )
            e2++;
          r2 += t2.substring(i4, e2);
          let n4 = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
          if (!this.suppressValidationErr && !n4.includes(r2.toUpperCase()))
            throw Error(`Invalid attribute type: "${r2}"`);
        }
        e2 = j2(t2, e2);
        let o3 = "";
        return t2.substring(e2, e2 + 8).toUpperCase() === "#REQUIRED" ? (o3 = "#REQUIRED", e2 += 8) : t2.substring(e2, e2 + 7).toUpperCase() === "#IMPLIED" ? (o3 = "#IMPLIED", e2 += 7) : [e2, o3] = this.readIdentifierVal(t2, e2, "ATTLIST"), { elementName: n3, attributeName: s2, attributeType: r2, defaultValue: o3, index: e2 };
      }
    }
    let j2 = (t2, e2) => {
      for (;e2 < t2.length && /\s/.test(t2[e2]); )
        e2++;
      return e2;
    };
    function M2(t2, e2, i3) {
      for (let n3 = 0;n3 < e2.length; n3++)
        if (e2[n3] !== t2[i3 + n3 + 1])
          return !1;
      return !0;
    }
    function _(t2) {
      if (r(t2))
        return t2;
      throw Error(`Invalid entity name ${t2}`);
    }
    let D = /^[-+]?0x[a-fA-F0-9]+$/, V = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, k = { hex: !0, leadingZeros: !0, decimalPoint: ".", eNotation: !0, infinity: "original" }, F2 = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/, L2 = /* @__PURE__ */ new Set(["push", "pop", "reset", "updateCurrent", "restore"]);

    class G3 {
      constructor(t2 = {}) {
        this.separator = t2.separator || ".", this.path = [], this.siblingStacks = [];
      }
      push(t2, e2 = null, i3 = null) {
        this.path.length > 0 && (this.path[this.path.length - 1].values = void 0);
        let n3 = this.path.length;
        this.siblingStacks[n3] || (this.siblingStacks[n3] = /* @__PURE__ */ new Map);
        let s2 = this.siblingStacks[n3], r2 = i3 ? `${i3}:${t2}` : t2, o3 = s2.get(r2) || 0, a3 = 0;
        for (let t3 of s2.values())
          a3 += t3;
        s2.set(r2, o3 + 1);
        let h3 = { tag: t2, position: a3, counter: o3 };
        i3 != null && (h3.namespace = i3), e2 != null && (h3.values = e2), this.path.push(h3);
      }
      pop() {
        if (this.path.length === 0)
          return;
        let t2 = this.path.pop();
        return this.siblingStacks.length > this.path.length + 1 && (this.siblingStacks.length = this.path.length + 1), t2;
      }
      updateCurrent(t2) {
        if (this.path.length > 0) {
          let e2 = this.path[this.path.length - 1];
          t2 != null && (e2.values = t2);
        }
      }
      getCurrentTag() {
        return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
      }
      getCurrentNamespace() {
        return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
      }
      getAttrValue(t2) {
        if (this.path.length === 0)
          return;
        return this.path[this.path.length - 1].values?.[t2];
      }
      hasAttr(t2) {
        if (this.path.length === 0)
          return !1;
        let e2 = this.path[this.path.length - 1];
        return e2.values !== void 0 && t2 in e2.values;
      }
      getPosition() {
        return this.path.length === 0 ? -1 : this.path[this.path.length - 1].position ?? 0;
      }
      getCounter() {
        return this.path.length === 0 ? -1 : this.path[this.path.length - 1].counter ?? 0;
      }
      getIndex() {
        return this.getPosition();
      }
      getDepth() {
        return this.path.length;
      }
      toString(t2, e2 = !0) {
        let i3 = t2 || this.separator;
        return this.path.map((t3) => e2 && t3.namespace ? `${t3.namespace}:${t3.tag}` : t3.tag).join(i3);
      }
      toArray() {
        return this.path.map((t2) => t2.tag);
      }
      reset() {
        this.path = [], this.siblingStacks = [];
      }
      matches(t2) {
        let e2 = t2.segments;
        return e2.length !== 0 && (t2.hasDeepWildcard() ? this._matchWithDeepWildcard(e2) : this._matchSimple(e2));
      }
      _matchSimple(t2) {
        if (this.path.length !== t2.length)
          return !1;
        for (let e2 = 0;e2 < t2.length; e2++) {
          let i3 = t2[e2], n3 = this.path[e2], s2 = e2 === this.path.length - 1;
          if (!this._matchSegment(i3, n3, s2))
            return !1;
        }
        return !0;
      }
      _matchWithDeepWildcard(t2) {
        let e2 = this.path.length - 1, i3 = t2.length - 1;
        for (;i3 >= 0 && e2 >= 0; ) {
          let n3 = t2[i3];
          if (n3.type === "deep-wildcard") {
            if (i3--, i3 < 0)
              return !0;
            let n4 = t2[i3], s2 = !1;
            for (let t3 = e2;t3 >= 0; t3--) {
              let r2 = t3 === this.path.length - 1;
              if (this._matchSegment(n4, this.path[t3], r2)) {
                e2 = t3 - 1, i3--, s2 = !0;
                break;
              }
            }
            if (!s2)
              return !1;
          } else {
            let t3 = e2 === this.path.length - 1;
            if (!this._matchSegment(n3, this.path[e2], t3))
              return !1;
            e2--, i3--;
          }
        }
        return i3 < 0;
      }
      _matchSegment(t2, e2, i3) {
        if (t2.tag !== "*" && t2.tag !== e2.tag)
          return !1;
        if (t2.namespace !== void 0 && t2.namespace !== "*" && t2.namespace !== e2.namespace)
          return !1;
        if (t2.attrName !== void 0) {
          if (!i3)
            return !1;
          if (!e2.values || !(t2.attrName in e2.values))
            return !1;
          if (t2.attrValue !== void 0) {
            let i4 = e2.values[t2.attrName];
            if (String(i4) !== String(t2.attrValue))
              return !1;
          }
        }
        if (t2.position !== void 0) {
          if (!i3)
            return !1;
          let n3 = e2.counter ?? 0;
          if (t2.position === "first" && n3 !== 0)
            return !1;
          if (t2.position === "odd" && n3 % 2 != 1)
            return !1;
          if (t2.position === "even" && n3 % 2 != 0)
            return !1;
          if (t2.position === "nth" && n3 !== t2.positionValue)
            return !1;
        }
        return !0;
      }
      snapshot() {
        return { path: this.path.map((t2) => ({ ...t2 })), siblingStacks: this.siblingStacks.map((t2) => new Map(t2)) };
      }
      restore(t2) {
        this.path = t2.path.map((t3) => ({ ...t3 })), this.siblingStacks = t2.siblingStacks.map((t3) => new Map(t3));
      }
      readOnly() {
        return new Proxy(this, { get(t2, e2, i3) {
          if (L2.has(e2))
            return () => {
              throw TypeError(`Cannot call '${e2}' on a read-only Matcher. Obtain a writable instance to mutate state.`);
            };
          let n3 = Reflect.get(t2, e2, i3);
          return e2 === "path" || e2 === "siblingStacks" ? Object.freeze(Array.isArray(n3) ? n3.map((t3) => t3 instanceof Map ? Object.freeze(new Map(t3)) : Object.freeze({ ...t3 })) : n3) : typeof n3 == "function" ? n3.bind(t2) : n3;
        }, set(t2, e2) {
          throw TypeError(`Cannot set property '${String(e2)}' on a read-only Matcher.`);
        }, deleteProperty(t2, e2) {
          throw TypeError(`Cannot delete property '${String(e2)}' from a read-only Matcher.`);
        } });
      }
    }

    class R2 {
      constructor(t2, e2 = {}) {
        this.pattern = t2, this.separator = e2.separator || ".", this.segments = this._parse(t2), this._hasDeepWildcard = this.segments.some((t3) => t3.type === "deep-wildcard"), this._hasAttributeCondition = this.segments.some((t3) => t3.attrName !== void 0), this._hasPositionSelector = this.segments.some((t3) => t3.position !== void 0);
      }
      _parse(t2) {
        let e2 = [], i3 = 0, n3 = "";
        for (;i3 < t2.length; )
          t2[i3] === this.separator ? i3 + 1 < t2.length && t2[i3 + 1] === this.separator ? (n3.trim() && (e2.push(this._parseSegment(n3.trim())), n3 = ""), e2.push({ type: "deep-wildcard" }), i3 += 2) : (n3.trim() && e2.push(this._parseSegment(n3.trim())), n3 = "", i3++) : (n3 += t2[i3], i3++);
        return n3.trim() && e2.push(this._parseSegment(n3.trim())), e2;
      }
      _parseSegment(t2) {
        let e2 = { type: "tag" }, i3 = null, n3 = t2, s2 = t2.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
        if (s2 && (n3 = s2[1] + s2[3], s2[2])) {
          let t3 = s2[2].slice(1, -1);
          t3 && (i3 = t3);
        }
        let r2, o3, a3 = n3;
        if (n3.includes("::")) {
          let e3 = n3.indexOf("::");
          if (r2 = n3.substring(0, e3).trim(), a3 = n3.substring(e3 + 2).trim(), !r2)
            throw Error(`Invalid namespace in pattern: ${t2}`);
        }
        let h3 = null;
        if (a3.includes(":")) {
          let t3 = a3.lastIndexOf(":"), e3 = a3.substring(0, t3).trim(), i4 = a3.substring(t3 + 1).trim();
          ["first", "last", "odd", "even"].includes(i4) || /^nth\(\d+\)$/.test(i4) ? (o3 = e3, h3 = i4) : o3 = a3;
        } else
          o3 = a3;
        if (!o3)
          throw Error(`Invalid segment pattern: ${t2}`);
        if (e2.tag = o3, r2 && (e2.namespace = r2), i3)
          if (i3.includes("=")) {
            let t3 = i3.indexOf("=");
            e2.attrName = i3.substring(0, t3).trim(), e2.attrValue = i3.substring(t3 + 1).trim();
          } else
            e2.attrName = i3.trim();
        if (h3) {
          let t3 = h3.match(/^nth\((\d+)\)$/);
          t3 ? (e2.position = "nth", e2.positionValue = parseInt(t3[1], 10)) : e2.position = h3;
        }
        return e2;
      }
      get length() {
        return this.segments.length;
      }
      hasDeepWildcard() {
        return this._hasDeepWildcard;
      }
      hasAttributeCondition() {
        return this._hasAttributeCondition;
      }
      hasPositionSelector() {
        return this._hasPositionSelector;
      }
      toString() {
        return this.pattern;
      }
    }
    function U2(t2, e2) {
      if (!t2)
        return {};
      let i3 = e2.attributesGroupName ? t2[e2.attributesGroupName] : t2;
      if (!i3)
        return {};
      let n3 = {};
      for (let t3 in i3)
        t3.startsWith(e2.attributeNamePrefix) ? n3[t3.substring(e2.attributeNamePrefix.length)] = i3[t3] : n3[t3] = i3[t3];
      return n3;
    }
    function B(t2) {
      if (!t2 || typeof t2 != "string")
        return;
      let e2 = t2.indexOf(":");
      if (e2 !== -1 && e2 > 0) {
        let i3 = t2.substring(0, e2);
        if (i3 !== "xmlns")
          return i3;
      }
    }

    class W2 {
      constructor(t2) {
        var e2;
        if (this.options = t2, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = { apos: { regex: /&(apos|#39|#x27);/g, val: "'" }, gt: { regex: /&(gt|#62|#x3E);/g, val: ">" }, lt: { regex: /&(lt|#60|#x3C);/g, val: "<" }, quot: { regex: /&(quot|#34|#x22);/g, val: '"' } }, this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" }, this.htmlEntities = { space: { regex: /&(nbsp|#160);/g, val: " " }, cent: { regex: /&(cent|#162);/g, val: "\xA2" }, pound: { regex: /&(pound|#163);/g, val: "\xA3" }, yen: { regex: /&(yen|#165);/g, val: "\xA5" }, euro: { regex: /&(euro|#8364);/g, val: "\u20AC" }, copyright: { regex: /&(copy|#169);/g, val: "\xA9" }, reg: { regex: /&(reg|#174);/g, val: "\xAE" }, inr: { regex: /&(inr|#8377);/g, val: "\u20B9" }, num_dec: { regex: /&#([0-9]{1,7});/g, val: (t3, e3) => rt(e3, 10, "&#") }, num_hex: { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (t3, e3) => rt(e3, 16, "&#x") } }, this.addExternalEntities = Y, this.parseXml = J, this.parseTextData = z, this.resolveNameSpace = X, this.buildAttributesMap = Z, this.isItStopNode = tt, this.replaceEntitiesValue = Q, this.readStopNodeData = nt, this.saveTextToParentTag = H2, this.addChild = K, this.ignoreAttributesFn = typeof (e2 = this.options.ignoreAttributes) == "function" ? e2 : Array.isArray(e2) ? (t3) => {
          for (let i3 of e2) {
            if (typeof i3 == "string" && t3 === i3)
              return !0;
            if (i3 instanceof RegExp && i3.test(t3))
              return !0;
          }
        } : () => !1, this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.matcher = new G3, this.readonlyMatcher = this.matcher.readOnly(), this.isCurrentNodeStopNode = !1, this.options.stopNodes && this.options.stopNodes.length > 0) {
          this.stopNodeExpressions = [];
          for (let t3 = 0;t3 < this.options.stopNodes.length; t3++) {
            let e3 = this.options.stopNodes[t3];
            typeof e3 == "string" ? this.stopNodeExpressions.push(new R2(e3)) : e3 instanceof R2 && this.stopNodeExpressions.push(e3);
          }
        }
      }
    }
    function Y(t2) {
      let e2 = Object.keys(t2);
      for (let i3 = 0;i3 < e2.length; i3++) {
        let n3 = e2[i3], s2 = n3.replace(/[.\-+*:]/g, "\\.");
        this.lastEntities[n3] = { regex: new RegExp("&" + s2 + ";", "g"), val: t2[n3] };
      }
    }
    function z(t2, e2, i3, n3, s2, r2, o3) {
      if (t2 !== void 0 && (this.options.trimValues && !n3 && (t2 = t2.trim()), t2.length > 0)) {
        o3 || (t2 = this.replaceEntitiesValue(t2, e2, i3));
        let n4 = this.options.jPath ? i3.toString() : i3, a3 = this.options.tagValueProcessor(e2, t2, n4, s2, r2);
        return a3 == null ? t2 : typeof a3 != typeof t2 || a3 !== t2 ? a3 : this.options.trimValues || t2.trim() === t2 ? st(t2, this.options.parseTagValue, this.options.numberParseOptions) : t2;
      }
    }
    function X(t2) {
      if (this.options.removeNSPrefix) {
        let e2 = t2.split(":"), i3 = t2.charAt(0) === "/" ? "/" : "";
        if (e2[0] === "xmlns")
          return "";
        e2.length === 2 && (t2 = i3 + e2[1]);
      }
      return t2;
    }
    let q = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function Z(t2, e2, i3) {
      if (this.options.ignoreAttributes !== !0 && typeof t2 == "string") {
        let n3 = s(t2, q), r2 = n3.length, o3 = {}, a3 = {};
        for (let t3 = 0;t3 < r2; t3++) {
          let e3 = this.resolveNameSpace(n3[t3][1]), s2 = n3[t3][4];
          if (e3.length && s2 !== void 0) {
            let t4 = s2;
            this.options.trimValues && (t4 = t4.trim()), t4 = this.replaceEntitiesValue(t4, i3, this.readonlyMatcher), a3[e3] = t4;
          }
        }
        Object.keys(a3).length > 0 && typeof e2 == "object" && e2.updateCurrent && e2.updateCurrent(a3);
        for (let t3 = 0;t3 < r2; t3++) {
          let s2 = this.resolveNameSpace(n3[t3][1]), r3 = this.options.jPath ? e2.toString() : this.readonlyMatcher;
          if (this.ignoreAttributesFn(s2, r3))
            continue;
          let a4 = n3[t3][4], h3 = this.options.attributeNamePrefix + s2;
          if (s2.length)
            if (this.options.transformAttributeName && (h3 = this.options.transformAttributeName(h3)), h3 = at(h3, this.options), a4 !== void 0) {
              this.options.trimValues && (a4 = a4.trim()), a4 = this.replaceEntitiesValue(a4, i3, this.readonlyMatcher);
              let t4 = this.options.jPath ? e2.toString() : this.readonlyMatcher, n4 = this.options.attributeValueProcessor(s2, a4, t4);
              o3[h3] = n4 == null ? a4 : typeof n4 != typeof a4 || n4 !== a4 ? n4 : st(a4, this.options.parseAttributeValue, this.options.numberParseOptions);
            } else
              this.options.allowBooleanAttributes && (o3[h3] = !0);
        }
        if (!Object.keys(o3).length)
          return;
        if (this.options.attributesGroupName) {
          let t3 = {};
          return t3[this.options.attributesGroupName] = o3, t3;
        }
        return o3;
      }
    }
    let J = function(t2) {
      t2 = t2.replace(/\r\n?/g, `
`);
      let e2 = new $3("!xml"), i3 = e2, n3 = "";
      this.matcher.reset(), this.entityExpansionCount = 0, this.currentExpandedLength = 0;
      let s2 = new I2(this.options.processEntities);
      for (let r2 = 0;r2 < t2.length; r2++)
        if (t2[r2] === "<")
          if (t2[r2 + 1] === "/") {
            let e3 = et(t2, ">", r2, "Closing Tag is not closed."), s3 = t2.substring(r2 + 2, e3).trim();
            if (this.options.removeNSPrefix) {
              let t3 = s3.indexOf(":");
              t3 !== -1 && (s3 = s3.substr(t3 + 1));
            }
            s3 = ot(this.options.transformTagName, s3, "", this.options).tagName, i3 && (n3 = this.saveTextToParentTag(n3, i3, this.readonlyMatcher));
            let o3 = this.matcher.getCurrentTag();
            if (s3 && this.options.unpairedTags.indexOf(s3) !== -1)
              throw Error(`Unpaired tag can not be used as closing tag: </${s3}>`);
            o3 && this.options.unpairedTags.indexOf(o3) !== -1 && (this.matcher.pop(), this.tagsNodeStack.pop()), this.matcher.pop(), this.isCurrentNodeStopNode = !1, i3 = this.tagsNodeStack.pop(), n3 = "", r2 = e3;
          } else if (t2[r2 + 1] === "?") {
            let e3 = it(t2, r2, !1, "?>");
            if (!e3)
              throw Error("Pi Tag is not closed.");
            if (n3 = this.saveTextToParentTag(n3, i3, this.readonlyMatcher), this.options.ignoreDeclaration && e3.tagName === "?xml" || this.options.ignorePiTags)
              ;
            else {
              let t3 = new $3(e3.tagName);
              t3.add(this.options.textNodeName, ""), e3.tagName !== e3.tagExp && e3.attrExpPresent && (t3[":@"] = this.buildAttributesMap(e3.tagExp, this.matcher, e3.tagName)), this.addChild(i3, t3, this.readonlyMatcher, r2);
            }
            r2 = e3.closeIndex + 1;
          } else if (t2.substr(r2 + 1, 3) === "!--") {
            let e3 = et(t2, "-->", r2 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              let s3 = t2.substring(r2 + 4, e3 - 2);
              n3 = this.saveTextToParentTag(n3, i3, this.readonlyMatcher), i3.add(this.options.commentPropName, [{ [this.options.textNodeName]: s3 }]);
            }
            r2 = e3;
          } else if (t2.substr(r2 + 1, 2) === "!D") {
            let e3 = s2.readDocType(t2, r2);
            this.docTypeEntities = e3.entities, r2 = e3.i;
          } else if (t2.substr(r2 + 1, 2) === "![") {
            let e3 = et(t2, "]]>", r2, "CDATA is not closed.") - 2, s3 = t2.substring(r2 + 9, e3);
            n3 = this.saveTextToParentTag(n3, i3, this.readonlyMatcher);
            let o3 = this.parseTextData(s3, i3.tagname, this.readonlyMatcher, !0, !1, !0, !0);
            o3 == null && (o3 = ""), this.options.cdataPropName ? i3.add(this.options.cdataPropName, [{ [this.options.textNodeName]: s3 }]) : i3.add(this.options.textNodeName, o3), r2 = e3 + 2;
          } else {
            let s3 = it(t2, r2, this.options.removeNSPrefix);
            if (!s3) {
              let e3 = t2.substring(Math.max(0, r2 - 50), Math.min(t2.length, r2 + 50));
              throw Error(`readTagExp returned undefined at position ${r2}. Context: "${e3}"`);
            }
            let { tagName: o3, rawTagName: a3, tagExp: h3, attrExpPresent: l2, closeIndex: p2 } = s3;
            if ({ tagName: o3, tagExp: h3 } = ot(this.options.transformTagName, o3, h3, this.options), this.options.strictReservedNames && (o3 === this.options.commentPropName || o3 === this.options.cdataPropName || o3 === this.options.textNodeName || o3 === this.options.attributesGroupName))
              throw Error(`Invalid tag name: ${o3}`);
            i3 && n3 && i3.tagname !== "!xml" && (n3 = this.saveTextToParentTag(n3, i3, this.readonlyMatcher, !1));
            let u5 = i3;
            u5 && this.options.unpairedTags.indexOf(u5.tagname) !== -1 && (i3 = this.tagsNodeStack.pop(), this.matcher.pop());
            let c4 = !1;
            h3.length > 0 && h3.lastIndexOf("/") === h3.length - 1 && (c4 = !0, o3[o3.length - 1] === "/" ? (o3 = o3.substr(0, o3.length - 1), h3 = o3) : h3 = h3.substr(0, h3.length - 1), l2 = o3 !== h3);
            let d2, f2 = null, g2 = {};
            d2 = B(a3), o3 !== e2.tagname && this.matcher.push(o3, {}, d2), o3 !== h3 && l2 && (f2 = this.buildAttributesMap(h3, this.matcher, o3), f2 && (g2 = U2(f2, this.options))), o3 !== e2.tagname && (this.isCurrentNodeStopNode = this.isItStopNode(this.stopNodeExpressions, this.matcher));
            let m2 = r2;
            if (this.isCurrentNodeStopNode) {
              let e3 = "";
              if (c4)
                r2 = s3.closeIndex;
              else if (this.options.unpairedTags.indexOf(o3) !== -1)
                r2 = s3.closeIndex;
              else {
                let i4 = this.readStopNodeData(t2, a3, p2 + 1);
                if (!i4)
                  throw Error(`Unexpected end of ${a3}`);
                r2 = i4.i, e3 = i4.tagContent;
              }
              let n4 = new $3(o3);
              f2 && (n4[":@"] = f2), n4.add(this.options.textNodeName, e3), this.matcher.pop(), this.isCurrentNodeStopNode = !1, this.addChild(i3, n4, this.readonlyMatcher, m2);
            } else {
              if (c4) {
                ({ tagName: o3, tagExp: h3 } = ot(this.options.transformTagName, o3, h3, this.options));
                let t3 = new $3(o3);
                f2 && (t3[":@"] = f2), this.addChild(i3, t3, this.readonlyMatcher, m2), this.matcher.pop(), this.isCurrentNodeStopNode = !1;
              } else {
                if (this.options.unpairedTags.indexOf(o3) !== -1) {
                  let t3 = new $3(o3);
                  f2 && (t3[":@"] = f2), this.addChild(i3, t3, this.readonlyMatcher, m2), this.matcher.pop(), this.isCurrentNodeStopNode = !1, r2 = s3.closeIndex;
                  continue;
                }
                {
                  let t3 = new $3(o3);
                  if (this.tagsNodeStack.length > this.options.maxNestedTags)
                    throw Error("Maximum nested tags exceeded");
                  this.tagsNodeStack.push(i3), f2 && (t3[":@"] = f2), this.addChild(i3, t3, this.readonlyMatcher, m2), i3 = t3;
                }
              }
              n3 = "", r2 = p2;
            }
          }
        else
          n3 += t2[r2];
      return e2.child;
    };
    function K(t2, e2, i3, n3) {
      this.options.captureMetaData || (n3 = void 0);
      let s2 = this.options.jPath ? i3.toString() : i3, r2 = this.options.updateTag(e2.tagname, s2, e2[":@"]);
      r2 === !1 || (typeof r2 == "string" ? (e2.tagname = r2, t2.addChild(e2, n3)) : t2.addChild(e2, n3));
    }
    function Q(t2, e2, i3) {
      let n3 = this.options.processEntities;
      if (!n3 || !n3.enabled)
        return t2;
      if (n3.allowedTags) {
        let s2 = this.options.jPath ? i3.toString() : i3;
        if (!(Array.isArray(n3.allowedTags) ? n3.allowedTags.includes(e2) : n3.allowedTags(e2, s2)))
          return t2;
      }
      if (n3.tagFilter) {
        let s2 = this.options.jPath ? i3.toString() : i3;
        if (!n3.tagFilter(e2, s2))
          return t2;
      }
      for (let e3 of Object.keys(this.docTypeEntities)) {
        let i4 = this.docTypeEntities[e3], s2 = t2.match(i4.regx);
        if (s2) {
          if (this.entityExpansionCount += s2.length, n3.maxTotalExpansions && this.entityExpansionCount > n3.maxTotalExpansions)
            throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${n3.maxTotalExpansions}`);
          let e4 = t2.length;
          if (t2 = t2.replace(i4.regx, i4.val), n3.maxExpandedLength && (this.currentExpandedLength += t2.length - e4, this.currentExpandedLength > n3.maxExpandedLength))
            throw Error(`Total expanded content size exceeded: ${this.currentExpandedLength} > ${n3.maxExpandedLength}`);
        }
      }
      for (let e3 of Object.keys(this.lastEntities)) {
        let i4 = this.lastEntities[e3], s2 = t2.match(i4.regex);
        if (s2 && (this.entityExpansionCount += s2.length, n3.maxTotalExpansions && this.entityExpansionCount > n3.maxTotalExpansions))
          throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${n3.maxTotalExpansions}`);
        t2 = t2.replace(i4.regex, i4.val);
      }
      if (t2.indexOf("&") === -1)
        return t2;
      if (this.options.htmlEntities)
        for (let e3 of Object.keys(this.htmlEntities)) {
          let i4 = this.htmlEntities[e3], s2 = t2.match(i4.regex);
          if (s2 && (this.entityExpansionCount += s2.length, n3.maxTotalExpansions && this.entityExpansionCount > n3.maxTotalExpansions))
            throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${n3.maxTotalExpansions}`);
          t2 = t2.replace(i4.regex, i4.val);
        }
      return t2.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    function H2(t2, e2, i3, n3) {
      return t2 && (n3 === void 0 && (n3 = e2.child.length === 0), (t2 = this.parseTextData(t2, e2.tagname, i3, !1, !!e2[":@"] && Object.keys(e2[":@"]).length !== 0, n3)) !== void 0 && t2 !== "" && e2.add(this.options.textNodeName, t2), t2 = ""), t2;
    }
    function tt(t2, e2) {
      if (!t2 || t2.length === 0)
        return !1;
      for (let i3 = 0;i3 < t2.length; i3++)
        if (e2.matches(t2[i3]))
          return !0;
      return !1;
    }
    function et(t2, e2, i3, n3) {
      let s2 = t2.indexOf(e2, i3);
      if (s2 === -1)
        throw Error(n3);
      return s2 + e2.length - 1;
    }
    function it(t2, e2, i3, n3 = ">") {
      let s2 = function(t3, e3, i4 = ">") {
        let n4, s3 = "";
        for (let r3 = e3;r3 < t3.length; r3++) {
          let e4 = t3[r3];
          if (n4)
            e4 === n4 && (n4 = "");
          else if (e4 === '"' || e4 === "'")
            n4 = e4;
          else if (e4 === i4[0]) {
            if (!i4[1])
              return { data: s3, index: r3 };
            if (t3[r3 + 1] === i4[1])
              return { data: s3, index: r3 };
          } else
            e4 === "\t" && (e4 = " ");
          s3 += e4;
        }
      }(t2, e2 + 1, n3);
      if (!s2)
        return;
      let { data: r2, index: o3 } = s2, a3 = r2.search(/\s/), h3 = r2, l2 = !0;
      a3 !== -1 && (h3 = r2.substring(0, a3), r2 = r2.substring(a3 + 1).trimStart());
      let p2 = h3;
      if (i3) {
        let t3 = h3.indexOf(":");
        t3 !== -1 && (h3 = h3.substr(t3 + 1), l2 = h3 !== s2.data.substr(t3 + 1));
      }
      return { tagName: h3, tagExp: r2, closeIndex: o3, attrExpPresent: l2, rawTagName: p2 };
    }
    function nt(t2, e2, i3) {
      let n3 = i3, s2 = 1;
      for (;i3 < t2.length; i3++)
        if (t2[i3] === "<")
          if (t2[i3 + 1] === "/") {
            let r2 = et(t2, ">", i3, `${e2} is not closed`);
            if (t2.substring(i3 + 2, r2).trim() === e2 && (s2--, s2 === 0))
              return { tagContent: t2.substring(n3, i3), i: r2 };
            i3 = r2;
          } else if (t2[i3 + 1] === "?")
            i3 = et(t2, "?>", i3 + 1, "StopNode is not closed.");
          else if (t2.substr(i3 + 1, 3) === "!--")
            i3 = et(t2, "-->", i3 + 3, "StopNode is not closed.");
          else if (t2.substr(i3 + 1, 2) === "![")
            i3 = et(t2, "]]>", i3, "StopNode is not closed.") - 2;
          else {
            let n4 = it(t2, i3, ">");
            n4 && ((n4 && n4.tagName) === e2 && n4.tagExp[n4.tagExp.length - 1] !== "/" && s2++, i3 = n4.closeIndex);
          }
    }
    function st(t2, e2, i3) {
      if (e2 && typeof t2 == "string") {
        let e3 = t2.trim();
        return e3 === "true" || e3 !== "false" && function(t3, e4 = {}) {
          if (e4 = Object.assign({}, k, e4), !t3 || typeof t3 != "string")
            return t3;
          let i4 = t3.trim();
          if (e4.skipLike !== void 0 && e4.skipLike.test(i4))
            return t3;
          if (t3 === "0")
            return 0;
          if (e4.hex && D.test(i4))
            return function(t4) {
              if (parseInt)
                return parseInt(t4, 16);
              if (Number.parseInt)
                return Number.parseInt(t4, 16);
              if (window && window.parseInt)
                return window.parseInt(t4, 16);
              throw Error("parseInt, Number.parseInt, window.parseInt are not supported");
            }(i4);
          if (isFinite(i4)) {
            if (i4.includes("e") || i4.includes("E"))
              return function(t4, e5, i5) {
                if (!i5.eNotation)
                  return t4;
                let n4 = e5.match(F2);
                if (n4) {
                  let s2 = n4[1] || "", r2 = n4[3].indexOf("e") === -1 ? "E" : "e", o3 = n4[2], a3 = s2 ? t4[o3.length + 1] === r2 : t4[o3.length] === r2;
                  return o3.length > 1 && a3 ? t4 : (o3.length !== 1 || !n4[3].startsWith(`.${r2}`) && n4[3][0] !== r2) && o3.length > 0 ? i5.leadingZeros && !a3 ? (e5 = (n4[1] || "") + n4[3], Number(e5)) : t4 : Number(e5);
                }
                return t4;
              }(t3, i4, e4);
            {
              let s2 = V.exec(i4);
              if (s2) {
                let r2 = s2[1] || "", o3 = s2[2], a3 = (n3 = s2[3]) && n3.indexOf(".") !== -1 ? ((n3 = n3.replace(/0+$/, "")) === "." ? n3 = "0" : n3[0] === "." ? n3 = "0" + n3 : n3[n3.length - 1] === "." && (n3 = n3.substring(0, n3.length - 1)), n3) : n3, h3 = r2 ? t3[o3.length + 1] === "." : t3[o3.length] === ".";
                if (!e4.leadingZeros && (o3.length > 1 || o3.length === 1 && !h3))
                  return t3;
                {
                  let n4 = Number(i4), s3 = String(n4);
                  if (n4 === 0)
                    return n4;
                  if (s3.search(/[eE]/) !== -1)
                    return e4.eNotation ? n4 : t3;
                  if (i4.indexOf(".") !== -1)
                    return s3 === "0" || s3 === a3 || s3 === `${r2}${a3}` ? n4 : t3;
                  let h4 = o3 ? a3 : i4;
                  return o3 ? h4 === s3 || r2 + h4 === s3 ? n4 : t3 : h4 === s3 || h4 === r2 + s3 ? n4 : t3;
                }
              }
              return t3;
            }
          }
          var n3;
          return function(t4, e5, i5) {
            let n4 = e5 === 1 / 0;
            switch (i5.infinity.toLowerCase()) {
              case "null":
                return null;
              case "infinity":
                return e5;
              case "string":
                return n4 ? "Infinity" : "-Infinity";
              default:
                return t4;
            }
          }(t3, Number(i4), e4);
        }(t2, i3);
      }
      return t2 !== void 0 ? t2 : "";
    }
    function rt(t2, e2, i3) {
      let n3 = Number.parseInt(t2, e2);
      return n3 >= 0 && n3 <= 1114111 ? String.fromCodePoint(n3) : i3 + t2 + ";";
    }
    function ot(t2, e2, i3, n3) {
      if (t2) {
        let n4 = t2(e2);
        i3 === e2 && (i3 = n4), e2 = n4;
      }
      return { tagName: e2 = at(e2, n3), tagExp: i3 };
    }
    function at(t2, e2) {
      if (a2.includes(t2))
        throw Error(`[SECURITY] Invalid name: "${t2}" is a reserved JavaScript keyword that could cause prototype pollution`);
      return o2.includes(t2) ? e2.onDangerousProperty(t2) : t2;
    }
    let ht = $3.getMetaDataSymbol();
    function lt(t2, e2) {
      if (!t2 || typeof t2 != "object")
        return {};
      if (!e2)
        return t2;
      let i3 = {};
      for (let n3 in t2)
        n3.startsWith(e2) ? i3[n3.substring(e2.length)] = t2[n3] : i3[n3] = t2[n3];
      return i3;
    }
    function pt(t2, e2, i3, n3) {
      return ut(t2, e2, i3, n3);
    }
    function ut(t2, e2, i3, n3) {
      let s2, r2 = {};
      for (let o3 = 0;o3 < t2.length; o3++) {
        let a3 = t2[o3], h3 = ct(a3);
        if (h3 !== void 0 && h3 !== e2.textNodeName) {
          let t3 = lt(a3[":@"] || {}, e2.attributeNamePrefix);
          i3.push(h3, t3);
        }
        if (h3 === e2.textNodeName)
          s2 === void 0 ? s2 = a3[h3] : s2 += "" + a3[h3];
        else {
          if (h3 === void 0)
            continue;
          if (a3[h3]) {
            let t3 = ut(a3[h3], e2, i3, n3), s3 = ft(t3, e2);
            if (a3[":@"] ? dt(t3, a3[":@"], n3, e2) : Object.keys(t3).length !== 1 || t3[e2.textNodeName] === void 0 || e2.alwaysCreateTextNode ? Object.keys(t3).length === 0 && (e2.alwaysCreateTextNode ? t3[e2.textNodeName] = "" : t3 = "") : t3 = t3[e2.textNodeName], a3[ht] !== void 0 && typeof t3 == "object" && t3 !== null && (t3[ht] = a3[ht]), r2[h3] !== void 0 && Object.prototype.hasOwnProperty.call(r2, h3))
              Array.isArray(r2[h3]) || (r2[h3] = [r2[h3]]), r2[h3].push(t3);
            else {
              let i4 = e2.jPath ? n3.toString() : n3;
              e2.isArray(h3, i4, s3) ? r2[h3] = [t3] : r2[h3] = t3;
            }
            h3 !== void 0 && h3 !== e2.textNodeName && i3.pop();
          }
        }
      }
      return typeof s2 == "string" ? s2.length > 0 && (r2[e2.textNodeName] = s2) : s2 !== void 0 && (r2[e2.textNodeName] = s2), r2;
    }
    function ct(t2) {
      let e2 = Object.keys(t2);
      for (let t3 = 0;t3 < e2.length; t3++) {
        let i3 = e2[t3];
        if (i3 !== ":@")
          return i3;
      }
    }
    function dt(t2, e2, i3, n3) {
      if (e2) {
        let s2 = Object.keys(e2), r2 = s2.length;
        for (let o3 = 0;o3 < r2; o3++) {
          let r3 = s2[o3], a3 = r3.startsWith(n3.attributeNamePrefix) ? r3.substring(n3.attributeNamePrefix.length) : r3, h3 = n3.jPath ? i3.toString() + "." + a3 : i3;
          n3.isArray(r3, h3, !0, !0) ? t2[r3] = [e2[r3]] : t2[r3] = e2[r3];
        }
      }
    }
    function ft(t2, e2) {
      let { textNodeName: i3 } = e2, n3 = Object.keys(t2).length;
      return n3 === 0 || !(n3 !== 1 || !t2[i3] && typeof t2[i3] != "boolean" && t2[i3] !== 0);
    }

    class gt {
      constructor(t2) {
        this.externalEntities = {}, this.options = O2(t2);
      }
      parse(t2, e2) {
        if (typeof t2 != "string" && t2.toString)
          t2 = t2.toString();
        else if (typeof t2 != "string")
          throw Error("XML data is accepted in String or Bytes[] form.");
        if (e2) {
          e2 === !0 && (e2 = {});
          let i4 = l(t2, e2);
          if (i4 !== !0)
            throw Error(`${i4.err.msg}:${i4.err.line}:${i4.err.col}`);
        }
        let i3 = new W2(this.options);
        i3.addExternalEntities(this.externalEntities);
        let n3 = i3.parseXml(t2);
        return this.options.preserveOrder || n3 === void 0 ? n3 : pt(n3, this.options, i3.matcher, i3.readonlyMatcher);
      }
      addEntity(t2, e2) {
        if (e2.indexOf("&") !== -1)
          throw Error("Entity value can't have '&'");
        if (t2.indexOf("&") !== -1 || t2.indexOf(";") !== -1)
          throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        if (e2 === "&")
          throw Error("An entity with value '&' is not permitted");
        this.externalEntities[t2] = e2;
      }
      static getMetaDataSymbol() {
        return $3.getMetaDataSymbol();
      }
    }
    function mt(t2, e2) {
      let i3 = "";
      e2.format && e2.indentBy.length > 0 && (i3 = `
`);
      let n3 = [];
      if (e2.stopNodes && Array.isArray(e2.stopNodes))
        for (let t3 = 0;t3 < e2.stopNodes.length; t3++) {
          let i4 = e2.stopNodes[t3];
          typeof i4 == "string" ? n3.push(new R2(i4)) : i4 instanceof R2 && n3.push(i4);
        }
      return xt(t2, e2, i3, new G3, n3);
    }
    function xt(t2, e2, i3, n3, s2) {
      let r2 = "", o3 = !1;
      if (e2.maxNestedTags && n3.getDepth() > e2.maxNestedTags)
        throw Error("Maximum nested tags exceeded");
      if (!Array.isArray(t2)) {
        if (t2 != null) {
          let i4 = t2.toString();
          return i4 = Tt(i4, e2), i4;
        }
        return "";
      }
      for (let a3 = 0;a3 < t2.length; a3++) {
        let h3 = t2[a3], l2 = yt(h3);
        if (l2 === void 0)
          continue;
        let p2 = Nt(h3[":@"], e2);
        n3.push(l2, p2);
        let u5 = vt(n3, s2);
        if (l2 === e2.textNodeName) {
          let t3 = h3[l2];
          u5 || (t3 = e2.tagValueProcessor(l2, t3), t3 = Tt(t3, e2)), o3 && (r2 += i3), r2 += t3, o3 = !1, n3.pop();
          continue;
        }
        if (l2 === e2.cdataPropName) {
          o3 && (r2 += i3), r2 += `<![CDATA[${h3[l2][0][e2.textNodeName]}]]>`, o3 = !1, n3.pop();
          continue;
        }
        if (l2 === e2.commentPropName) {
          r2 += i3 + `<!--${h3[l2][0][e2.textNodeName]}-->`, o3 = !0, n3.pop();
          continue;
        }
        if (l2[0] === "?") {
          let t3 = wt(h3[":@"], e2, u5), s3 = l2 === "?xml" ? "" : i3, a4 = h3[l2][0][e2.textNodeName];
          a4 = a4.length !== 0 ? " " + a4 : "", r2 += s3 + `<${l2}${a4}${t3}?>`, o3 = !0, n3.pop();
          continue;
        }
        let c4 = i3;
        c4 !== "" && (c4 += e2.indentBy);
        let d2 = i3 + `<${l2}${wt(h3[":@"], e2, u5)}`, f2;
        f2 = u5 ? bt(h3[l2], e2) : xt(h3[l2], e2, c4, n3, s2), e2.unpairedTags.indexOf(l2) !== -1 ? e2.suppressUnpairedNode ? r2 += d2 + ">" : r2 += d2 + "/>" : f2 && f2.length !== 0 || !e2.suppressEmptyNode ? f2 && f2.endsWith(">") ? r2 += d2 + `>${f2}${i3}</${l2}>` : (r2 += d2 + ">", f2 && i3 !== "" && (f2.includes("/>") || f2.includes("</")) ? r2 += i3 + e2.indentBy + f2 + i3 : r2 += f2, r2 += `</${l2}>`) : r2 += d2 + "/>", o3 = !0, n3.pop();
      }
      return r2;
    }
    function Nt(t2, e2) {
      if (!t2 || e2.ignoreAttributes)
        return null;
      let i3 = {}, n3 = !1;
      for (let s2 in t2)
        Object.prototype.hasOwnProperty.call(t2, s2) && (i3[s2.startsWith(e2.attributeNamePrefix) ? s2.substr(e2.attributeNamePrefix.length) : s2] = t2[s2], n3 = !0);
      return n3 ? i3 : null;
    }
    function bt(t2, e2) {
      if (!Array.isArray(t2))
        return t2 != null ? t2.toString() : "";
      let i3 = "";
      for (let n3 = 0;n3 < t2.length; n3++) {
        let s2 = t2[n3], r2 = yt(s2);
        if (r2 === e2.textNodeName)
          i3 += s2[r2];
        else if (r2 === e2.cdataPropName)
          i3 += s2[r2][0][e2.textNodeName];
        else if (r2 === e2.commentPropName)
          i3 += s2[r2][0][e2.textNodeName];
        else {
          if (r2 && r2[0] === "?")
            continue;
          if (r2) {
            let t3 = Et(s2[":@"], e2), n4 = bt(s2[r2], e2);
            n4 && n4.length !== 0 ? i3 += `<${r2}${t3}>${n4}</${r2}>` : i3 += `<${r2}${t3}/>`;
          }
        }
      }
      return i3;
    }
    function Et(t2, e2) {
      let i3 = "";
      if (t2 && !e2.ignoreAttributes)
        for (let n3 in t2) {
          if (!Object.prototype.hasOwnProperty.call(t2, n3))
            continue;
          let s2 = t2[n3];
          s2 === !0 && e2.suppressBooleanAttributes ? i3 += ` ${n3.substr(e2.attributeNamePrefix.length)}` : i3 += ` ${n3.substr(e2.attributeNamePrefix.length)}="${s2}"`;
        }
      return i3;
    }
    function yt(t2) {
      let e2 = Object.keys(t2);
      for (let i3 = 0;i3 < e2.length; i3++) {
        let n3 = e2[i3];
        if (Object.prototype.hasOwnProperty.call(t2, n3) && n3 !== ":@")
          return n3;
      }
    }
    function wt(t2, e2, i3) {
      let n3 = "";
      if (t2 && !e2.ignoreAttributes)
        for (let s2 in t2) {
          if (!Object.prototype.hasOwnProperty.call(t2, s2))
            continue;
          let r2;
          i3 ? r2 = t2[s2] : (r2 = e2.attributeValueProcessor(s2, t2[s2]), r2 = Tt(r2, e2)), r2 === !0 && e2.suppressBooleanAttributes ? n3 += ` ${s2.substr(e2.attributeNamePrefix.length)}` : n3 += ` ${s2.substr(e2.attributeNamePrefix.length)}="${r2}"`;
        }
      return n3;
    }
    function vt(t2, e2) {
      if (!e2 || e2.length === 0)
        return !1;
      for (let i3 = 0;i3 < e2.length; i3++)
        if (t2.matches(e2[i3]))
          return !0;
      return !1;
    }
    function Tt(t2, e2) {
      if (t2 && t2.length > 0 && e2.processEntities)
        for (let i3 = 0;i3 < e2.entities.length; i3++) {
          let n3 = e2.entities[i3];
          t2 = t2.replace(n3.regex, n3.val);
        }
      return t2;
    }
    let Pt = { attributeNamePrefix: "@_", attributesGroupName: !1, textNodeName: "#text", ignoreAttributes: !0, cdataPropName: !1, format: !1, indentBy: "  ", suppressEmptyNode: !1, suppressUnpairedNode: !0, suppressBooleanAttributes: !0, tagValueProcessor: function(t2, e2) {
      return e2;
    }, attributeValueProcessor: function(t2, e2) {
      return e2;
    }, preserveOrder: !1, commentPropName: !1, unpairedTags: [], entities: [{ regex: new RegExp("&", "g"), val: "&amp;" }, { regex: new RegExp(">", "g"), val: "&gt;" }, { regex: new RegExp("<", "g"), val: "&lt;" }, { regex: new RegExp("'", "g"), val: "&apos;" }, { regex: new RegExp('"', "g"), val: "&quot;" }], processEntities: !0, stopNodes: [], oneListGroup: !1, maxNestedTags: 100, jPath: !0 };
    function St(t2) {
      if (this.options = Object.assign({}, Pt, t2), this.options.stopNodes && Array.isArray(this.options.stopNodes) && (this.options.stopNodes = this.options.stopNodes.map((t3) => typeof t3 == "string" && t3.startsWith("*.") ? ".." + t3.substring(2) : t3)), this.stopNodeExpressions = [], this.options.stopNodes && Array.isArray(this.options.stopNodes))
        for (let t3 = 0;t3 < this.options.stopNodes.length; t3++) {
          let e3 = this.options.stopNodes[t3];
          typeof e3 == "string" ? this.stopNodeExpressions.push(new R2(e3)) : e3 instanceof R2 && this.stopNodeExpressions.push(e3);
        }
      var e2;
      this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
        return !1;
      } : (this.ignoreAttributesFn = typeof (e2 = this.options.ignoreAttributes) == "function" ? e2 : Array.isArray(e2) ? (t3) => {
        for (let i3 of e2) {
          if (typeof i3 == "string" && t3 === i3)
            return !0;
          if (i3 instanceof RegExp && i3.test(t3))
            return !0;
        }
      } : () => !1, this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = Ct), this.processTextOrObjNode = At, this.options.format ? (this.indentate = Ot, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
        return "";
      }, this.tagEndChar = ">", this.newLine = "");
    }
    function At(t2, e2, i3, n3) {
      let s2 = this.extractAttributes(t2);
      if (n3.push(e2, s2), this.checkStopNode(n3)) {
        let s3 = this.buildRawContent(t2), r3 = this.buildAttributesForStopNode(t2);
        return n3.pop(), this.buildObjectNode(s3, e2, r3, i3);
      }
      let r2 = this.j2x(t2, i3 + 1, n3);
      return n3.pop(), t2[this.options.textNodeName] !== void 0 && Object.keys(t2).length === 1 ? this.buildTextValNode(t2[this.options.textNodeName], e2, r2.attrStr, i3, n3) : this.buildObjectNode(r2.val, e2, r2.attrStr, i3);
    }
    function Ot(t2) {
      return this.options.indentBy.repeat(t2);
    }
    function Ct(t2) {
      return !(!t2.startsWith(this.options.attributeNamePrefix) || t2 === this.options.textNodeName) && t2.substr(this.attrPrefixLen);
    }
    St.prototype.build = function(t2) {
      if (this.options.preserveOrder)
        return mt(t2, this.options);
      {
        Array.isArray(t2) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (t2 = { [this.options.arrayNodeName]: t2 });
        let e2 = new G3;
        return this.j2x(t2, 0, e2).val;
      }
    }, St.prototype.j2x = function(t2, e2, i3) {
      let n3 = "", s2 = "";
      if (this.options.maxNestedTags && i3.getDepth() >= this.options.maxNestedTags)
        throw Error("Maximum nested tags exceeded");
      let r2 = this.options.jPath ? i3.toString() : i3, o3 = this.checkStopNode(i3);
      for (let a3 in t2)
        if (Object.prototype.hasOwnProperty.call(t2, a3))
          if (t2[a3] === void 0)
            this.isAttribute(a3) && (s2 += "");
          else if (t2[a3] === null)
            this.isAttribute(a3) || a3 === this.options.cdataPropName ? s2 += "" : a3[0] === "?" ? s2 += this.indentate(e2) + "<" + a3 + "?" + this.tagEndChar : s2 += this.indentate(e2) + "<" + a3 + "/" + this.tagEndChar;
          else if (t2[a3] instanceof Date)
            s2 += this.buildTextValNode(t2[a3], a3, "", e2, i3);
          else if (typeof t2[a3] != "object") {
            let h3 = this.isAttribute(a3);
            if (h3 && !this.ignoreAttributesFn(h3, r2))
              n3 += this.buildAttrPairStr(h3, "" + t2[a3], o3);
            else if (!h3)
              if (a3 === this.options.textNodeName) {
                let e3 = this.options.tagValueProcessor(a3, "" + t2[a3]);
                s2 += this.replaceEntitiesValue(e3);
              } else {
                i3.push(a3);
                let n4 = this.checkStopNode(i3);
                if (i3.pop(), n4) {
                  let i4 = "" + t2[a3];
                  s2 += i4 === "" ? this.indentate(e2) + "<" + a3 + this.closeTag(a3) + this.tagEndChar : this.indentate(e2) + "<" + a3 + ">" + i4 + "</" + a3 + this.tagEndChar;
                } else
                  s2 += this.buildTextValNode(t2[a3], a3, "", e2, i3);
              }
          } else if (Array.isArray(t2[a3])) {
            let n4 = t2[a3].length, r3 = "", o4 = "";
            for (let h3 = 0;h3 < n4; h3++) {
              let n5 = t2[a3][h3];
              if (n5 === void 0)
                ;
              else if (n5 === null)
                a3[0] === "?" ? s2 += this.indentate(e2) + "<" + a3 + "?" + this.tagEndChar : s2 += this.indentate(e2) + "<" + a3 + "/" + this.tagEndChar;
              else if (typeof n5 == "object")
                if (this.options.oneListGroup) {
                  i3.push(a3);
                  let t3 = this.j2x(n5, e2 + 1, i3);
                  i3.pop(), r3 += t3.val, this.options.attributesGroupName && n5.hasOwnProperty(this.options.attributesGroupName) && (o4 += t3.attrStr);
                } else
                  r3 += this.processTextOrObjNode(n5, a3, e2, i3);
              else if (this.options.oneListGroup) {
                let t3 = this.options.tagValueProcessor(a3, n5);
                t3 = this.replaceEntitiesValue(t3), r3 += t3;
              } else {
                i3.push(a3);
                let t3 = this.checkStopNode(i3);
                if (i3.pop(), t3) {
                  let t4 = "" + n5;
                  r3 += t4 === "" ? this.indentate(e2) + "<" + a3 + this.closeTag(a3) + this.tagEndChar : this.indentate(e2) + "<" + a3 + ">" + t4 + "</" + a3 + this.tagEndChar;
                } else
                  r3 += this.buildTextValNode(n5, a3, "", e2, i3);
              }
            }
            this.options.oneListGroup && (r3 = this.buildObjectNode(r3, a3, o4, e2)), s2 += r3;
          } else if (this.options.attributesGroupName && a3 === this.options.attributesGroupName) {
            let e3 = Object.keys(t2[a3]), i4 = e3.length;
            for (let s3 = 0;s3 < i4; s3++)
              n3 += this.buildAttrPairStr(e3[s3], "" + t2[a3][e3[s3]], o3);
          } else
            s2 += this.processTextOrObjNode(t2[a3], a3, e2, i3);
      return { attrStr: n3, val: s2 };
    }, St.prototype.buildAttrPairStr = function(t2, e2, i3) {
      return i3 || (e2 = this.options.attributeValueProcessor(t2, "" + e2), e2 = this.replaceEntitiesValue(e2)), this.options.suppressBooleanAttributes && e2 === "true" ? " " + t2 : " " + t2 + '="' + e2 + '"';
    }, St.prototype.extractAttributes = function(t2) {
      if (!t2 || typeof t2 != "object")
        return null;
      let e2 = {}, i3 = !1;
      if (this.options.attributesGroupName && t2[this.options.attributesGroupName]) {
        let n3 = t2[this.options.attributesGroupName];
        for (let t3 in n3)
          Object.prototype.hasOwnProperty.call(n3, t3) && (e2[t3.startsWith(this.options.attributeNamePrefix) ? t3.substring(this.options.attributeNamePrefix.length) : t3] = n3[t3], i3 = !0);
      } else
        for (let n3 in t2) {
          if (!Object.prototype.hasOwnProperty.call(t2, n3))
            continue;
          let s2 = this.isAttribute(n3);
          s2 && (e2[s2] = t2[n3], i3 = !0);
        }
      return i3 ? e2 : null;
    }, St.prototype.buildRawContent = function(t2) {
      if (typeof t2 == "string")
        return t2;
      if (typeof t2 != "object" || t2 === null)
        return String(t2);
      if (t2[this.options.textNodeName] !== void 0)
        return t2[this.options.textNodeName];
      let e2 = "";
      for (let i3 in t2) {
        if (!Object.prototype.hasOwnProperty.call(t2, i3))
          continue;
        if (this.isAttribute(i3))
          continue;
        if (this.options.attributesGroupName && i3 === this.options.attributesGroupName)
          continue;
        let n3 = t2[i3];
        if (i3 === this.options.textNodeName)
          e2 += n3;
        else if (Array.isArray(n3)) {
          for (let t3 of n3)
            if (typeof t3 == "string" || typeof t3 == "number")
              e2 += `<${i3}>${t3}</${i3}>`;
            else if (typeof t3 == "object" && t3 !== null) {
              let n4 = this.buildRawContent(t3), s2 = this.buildAttributesForStopNode(t3);
              e2 += n4 === "" ? `<${i3}${s2}/>` : `<${i3}${s2}>${n4}</${i3}>`;
            }
        } else if (typeof n3 == "object" && n3 !== null) {
          let t3 = this.buildRawContent(n3), s2 = this.buildAttributesForStopNode(n3);
          e2 += t3 === "" ? `<${i3}${s2}/>` : `<${i3}${s2}>${t3}</${i3}>`;
        } else
          e2 += `<${i3}>${n3}</${i3}>`;
      }
      return e2;
    }, St.prototype.buildAttributesForStopNode = function(t2) {
      if (!t2 || typeof t2 != "object")
        return "";
      let e2 = "";
      if (this.options.attributesGroupName && t2[this.options.attributesGroupName]) {
        let i3 = t2[this.options.attributesGroupName];
        for (let t3 in i3) {
          if (!Object.prototype.hasOwnProperty.call(i3, t3))
            continue;
          let n3 = t3.startsWith(this.options.attributeNamePrefix) ? t3.substring(this.options.attributeNamePrefix.length) : t3, s2 = i3[t3];
          s2 === !0 && this.options.suppressBooleanAttributes ? e2 += " " + n3 : e2 += " " + n3 + '="' + s2 + '"';
        }
      } else
        for (let i3 in t2) {
          if (!Object.prototype.hasOwnProperty.call(t2, i3))
            continue;
          let n3 = this.isAttribute(i3);
          if (n3) {
            let s2 = t2[i3];
            s2 === !0 && this.options.suppressBooleanAttributes ? e2 += " " + n3 : e2 += " " + n3 + '="' + s2 + '"';
          }
        }
      return e2;
    }, St.prototype.buildObjectNode = function(t2, e2, i3, n3) {
      if (t2 === "")
        return e2[0] === "?" ? this.indentate(n3) + "<" + e2 + i3 + "?" + this.tagEndChar : this.indentate(n3) + "<" + e2 + i3 + this.closeTag(e2) + this.tagEndChar;
      {
        let s2 = "</" + e2 + this.tagEndChar, r2 = "";
        return e2[0] === "?" && (r2 = "?", s2 = ""), !i3 && i3 !== "" || t2.indexOf("<") !== -1 ? this.options.commentPropName !== !1 && e2 === this.options.commentPropName && r2.length === 0 ? this.indentate(n3) + `<!--${t2}-->` + this.newLine : this.indentate(n3) + "<" + e2 + i3 + r2 + this.tagEndChar + t2 + this.indentate(n3) + s2 : this.indentate(n3) + "<" + e2 + i3 + r2 + ">" + t2 + s2;
      }
    }, St.prototype.closeTag = function(t2) {
      let e2 = "";
      return this.options.unpairedTags.indexOf(t2) !== -1 ? this.options.suppressUnpairedNode || (e2 = "/") : e2 = this.options.suppressEmptyNode ? "/" : `></${t2}`, e2;
    }, St.prototype.checkStopNode = function(t2) {
      if (!this.stopNodeExpressions || this.stopNodeExpressions.length === 0)
        return !1;
      for (let e2 = 0;e2 < this.stopNodeExpressions.length; e2++)
        if (t2.matches(this.stopNodeExpressions[e2]))
          return !0;
      return !1;
    }, St.prototype.buildTextValNode = function(t2, e2, i3, n3, s2) {
      if (this.options.cdataPropName !== !1 && e2 === this.options.cdataPropName)
        return this.indentate(n3) + `<![CDATA[${t2}]]>` + this.newLine;
      if (this.options.commentPropName !== !1 && e2 === this.options.commentPropName)
        return this.indentate(n3) + `<!--${t2}-->` + this.newLine;
      if (e2[0] === "?")
        return this.indentate(n3) + "<" + e2 + i3 + "?" + this.tagEndChar;
      {
        let s3 = this.options.tagValueProcessor(e2, t2);
        return s3 = this.replaceEntitiesValue(s3), s3 === "" ? this.indentate(n3) + "<" + e2 + i3 + this.closeTag(e2) + this.tagEndChar : this.indentate(n3) + "<" + e2 + i3 + ">" + s3 + "</" + e2 + this.tagEndChar;
      }
    }, St.prototype.replaceEntitiesValue = function(t2) {
      if (t2 && t2.length > 0 && this.options.processEntities)
        for (let e2 = 0;e2 < this.options.entities.length; e2++) {
          let i3 = this.options.entities[e2];
          t2 = t2.replace(i3.regex, i3.val);
        }
      return t2;
    };
    let $t = St, It = { validate: l };
    module.exports = e;
  })();
});
