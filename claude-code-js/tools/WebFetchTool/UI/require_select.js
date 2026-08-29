// var: require_select
var require_select = __commonJS((exports, module) => {
  var window3 = Object.create(null, {
    location: { get: function() {
      throw Error("window.location is not supported.");
    } }
  }), compareDocumentPosition2 = function(a2, b) {
    return a2.compareDocumentPosition(b);
  }, order = function(a2, b) {
    return compareDocumentPosition2(a2, b) & 2 ? 1 : -1;
  }, next = function(el) {
    while ((el = el.nextSibling) && el.nodeType !== 1)
      ;
    return el;
  }, prev = function(el) {
    while ((el = el.previousSibling) && el.nodeType !== 1)
      ;
    return el;
  }, child = function(el) {
    if (el = el.firstChild)
      while (el.nodeType !== 1 && (el = el.nextSibling))
        ;
    return el;
  }, lastChild = function(el) {
    if (el = el.lastChild)
      while (el.nodeType !== 1 && (el = el.previousSibling))
        ;
    return el;
  }, parentIsElement = function(n5) {
    if (!n5.parentNode)
      return !1;
    var nodeType = n5.parentNode.nodeType;
    return nodeType === 1 || nodeType === 9;
  }, unquote = function(str2) {
    if (!str2)
      return str2;
    var ch2 = str2[0];
    if (ch2 === '"' || ch2 === "'") {
      if (str2[str2.length - 1] === ch2)
        str2 = str2.slice(1, -1);
      else
        str2 = str2.slice(1);
      return str2.replace(rules.str_escape, function(s2) {
        var m4 = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(s2);
        if (!m4)
          return s2.slice(1);
        if (m4[2])
          return "";
        var cp = parseInt(m4[1], 16);
        return String.fromCodePoint ? String.fromCodePoint(cp) : String.fromCharCode(cp);
      });
    } else if (rules.ident.test(str2))
      return decodeid(str2);
    else
      return str2;
  }, decodeid = function(str2) {
    return str2.replace(rules.escape, function(s2) {
      var m4 = /^\\([0-9A-Fa-f]+)/.exec(s2);
      if (!m4)
        return s2[1];
      var cp = parseInt(m4[1], 16);
      return String.fromCodePoint ? String.fromCodePoint(cp) : String.fromCharCode(cp);
    });
  }, indexOf = function() {
    if (Array.prototype.indexOf)
      return Array.prototype.indexOf;
    return function(obj, item) {
      var i5 = this.length;
      while (i5--)
        if (this[i5] === item)
          return i5;
      return -1;
    };
  }(), makeInside = function(start, end) {
    var regex2 = rules.inside.source.replace(/</g, start).replace(/>/g, end);
    return new RegExp(regex2);
  }, replace2 = function(regex2, name3, val) {
    return regex2 = regex2.source, regex2 = regex2.replace(name3, val.source || val), new RegExp(regex2);
  }, truncateUrl = function(url3, num) {
    return url3.replace(/^(?:\w+:\/\/|\/+)/, "").replace(/(?:\/+|\/*#.*?)$/, "").split("/", num).join("/");
  }, parseNth = function(param_, test2) {
    var param = param_.replace(/\s+/g, ""), cap;
    if (param === "even")
      param = "2n+0";
    else if (param === "odd")
      param = "2n+1";
    else if (param.indexOf("n") === -1)
      param = "0n" + param;
    return cap = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(param), {
      group: cap[1] === "-" ? -(cap[2] || 1) : +(cap[2] || 1),
      offset: cap[4] ? cap[3] === "-" ? -cap[4] : +cap[4] : 0
    };
  }, nth = function(param_, test2, last2) {
    var param = parseNth(param_), group = param.group, offset = param.offset, find3 = !last2 ? child : lastChild, advance2 = !last2 ? next : prev;
    return function(el) {
      if (!parentIsElement(el))
        return;
      var rel = find3(el.parentNode), pos = 0;
      while (rel) {
        if (test2(rel, el))
          pos++;
        if (rel === el)
          return pos -= offset, group && pos ? pos % group === 0 && pos < 0 === group < 0 : !pos;
        rel = advance2(rel);
      }
    };
  }, selectors = {
    "*": function() {
      return function() {
        return !0;
      };
    }(),
    type: function(type) {
      return type = type.toLowerCase(), function(el) {
        return el.nodeName.toLowerCase() === type;
      };
    },
    attr: function(key3, op, val, i5) {
      return op = operators[op], function(el) {
        var attr;
        switch (key3) {
          case "for":
            attr = el.htmlFor;
            break;
          case "class":
            if (attr = el.className, attr === "" && el.getAttribute("class") == null)
              attr = null;
            break;
          case "href":
          case "src":
            attr = el.getAttribute(key3, 2);
            break;
          case "title":
            attr = el.getAttribute("title") || null;
            break;
          case "id":
          case "lang":
          case "dir":
          case "accessKey":
          case "hidden":
          case "tabIndex":
          case "style":
            if (el.getAttribute) {
              attr = el.getAttribute(key3);
              break;
            }
          default:
            if (el.hasAttribute && !el.hasAttribute(key3))
              break;
            attr = el[key3] != null ? el[key3] : el.getAttribute && el.getAttribute(key3);
            break;
        }
        if (attr == null)
          return;
        if (attr = attr + "", i5)
          attr = attr.toLowerCase(), val = val.toLowerCase();
        return op(attr, val);
      };
    },
    ":first-child": function(el) {
      return !prev(el) && parentIsElement(el);
    },
    ":last-child": function(el) {
      return !next(el) && parentIsElement(el);
    },
    ":only-child": function(el) {
      return !prev(el) && !next(el) && parentIsElement(el);
    },
    ":nth-child": function(param, last2) {
      return nth(param, function() {
        return !0;
      }, last2);
    },
    ":nth-last-child": function(param) {
      return selectors[":nth-child"](param, !0);
    },
    ":root": function(el) {
      return el.ownerDocument.documentElement === el;
    },
    ":empty": function(el) {
      return !el.firstChild;
    },
    ":not": function(sel) {
      var test2 = compileGroup(sel);
      return function(el) {
        return !test2(el);
      };
    },
    ":first-of-type": function(el) {
      if (!parentIsElement(el))
        return;
      var type = el.nodeName;
      while (el = prev(el))
        if (el.nodeName === type)
          return;
      return !0;
    },
    ":last-of-type": function(el) {
      if (!parentIsElement(el))
        return;
      var type = el.nodeName;
      while (el = next(el))
        if (el.nodeName === type)
          return;
      return !0;
    },
    ":only-of-type": function(el) {
      return selectors[":first-of-type"](el) && selectors[":last-of-type"](el);
    },
    ":nth-of-type": function(param, last2) {
      return nth(param, function(rel, el) {
        return rel.nodeName === el.nodeName;
      }, last2);
    },
    ":nth-last-of-type": function(param) {
      return selectors[":nth-of-type"](param, !0);
    },
    ":checked": function(el) {
      return !!(el.checked || el.selected);
    },
    ":indeterminate": function(el) {
      return !selectors[":checked"](el);
    },
    ":enabled": function(el) {
      return !el.disabled && el.type !== "hidden";
    },
    ":disabled": function(el) {
      return !!el.disabled;
    },
    ":target": function(el) {
      return el.id === window3.location.hash.substring(1);
    },
    ":focus": function(el) {
      return el === el.ownerDocument.activeElement;
    },
    ":is": function(sel) {
      return compileGroup(sel);
    },
    ":matches": function(sel) {
      return selectors[":is"](sel);
    },
    ":nth-match": function(param, last2) {
      var args = param.split(/\s*,\s*/), arg = args.shift(), test2 = compileGroup(args.join(","));
      return nth(arg, test2, last2);
    },
    ":nth-last-match": function(param) {
      return selectors[":nth-match"](param, !0);
    },
    ":links-here": function(el) {
      return el + "" === window3.location + "";
    },
    ":lang": function(param) {
      return function(el) {
        while (el) {
          if (el.lang)
            return el.lang.indexOf(param) === 0;
          el = el.parentNode;
        }
      };
    },
    ":dir": function(param) {
      return function(el) {
        while (el) {
          if (el.dir)
            return el.dir === param;
          el = el.parentNode;
        }
      };
    },
    ":scope": function(el, con) {
      var context6 = con || el.ownerDocument;
      if (context6.nodeType === 9)
        return el === context6.documentElement;
      return el === context6;
    },
    ":any-link": function(el) {
      return typeof el.href === "string";
    },
    ":local-link": function(el) {
      if (el.nodeName)
        return el.href && el.host === window3.location.host;
      var param = +el + 1;
      return function(el2) {
        if (!el2.href)
          return;
        var url3 = window3.location + "", href = el2 + "";
        return truncateUrl(url3, param) === truncateUrl(href, param);
      };
    },
    ":default": function(el) {
      return !!el.defaultSelected;
    },
    ":valid": function(el) {
      return el.willValidate || el.validity && el.validity.valid;
    },
    ":invalid": function(el) {
      return !selectors[":valid"](el);
    },
    ":in-range": function(el) {
      return el.value > el.min && el.value <= el.max;
    },
    ":out-of-range": function(el) {
      return !selectors[":in-range"](el);
    },
    ":required": function(el) {
      return !!el.required;
    },
    ":optional": function(el) {
      return !el.required;
    },
    ":read-only": function(el) {
      if (el.readOnly)
        return !0;
      var attr = el.getAttribute("contenteditable"), prop2 = el.contentEditable, name3 = el.nodeName.toLowerCase();
      return name3 = name3 !== "input" && name3 !== "textarea", (name3 || el.disabled) && attr == null && prop2 !== "true";
    },
    ":read-write": function(el) {
      return !selectors[":read-only"](el);
    },
    ":hover": function() {
      throw Error(":hover is not supported.");
    },
    ":active": function() {
      throw Error(":active is not supported.");
    },
    ":link": function() {
      throw Error(":link is not supported.");
    },
    ":visited": function() {
      throw Error(":visited is not supported.");
    },
    ":column": function() {
      throw Error(":column is not supported.");
    },
    ":nth-column": function() {
      throw Error(":nth-column is not supported.");
    },
    ":nth-last-column": function() {
      throw Error(":nth-last-column is not supported.");
    },
    ":current": function() {
      throw Error(":current is not supported.");
    },
    ":past": function() {
      throw Error(":past is not supported.");
    },
    ":future": function() {
      throw Error(":future is not supported.");
    },
    ":contains": function(param) {
      return function(el) {
        var text2 = el.innerText || el.textContent || el.value || "";
        return text2.indexOf(param) !== -1;
      };
    },
    ":has": function(param) {
      return function(el) {
        return find2(param, el).length > 0;
      };
    }
  }, operators = {
    "-": function() {
      return !0;
    },
    "=": function(attr, val) {
      return attr === val;
    },
    "*=": function(attr, val) {
      return attr.indexOf(val) !== -1;
    },
    "~=": function(attr, val) {
      var i5, s2, f, l3;
      for (s2 = 0;; s2 = i5 + 1) {
        if (i5 = attr.indexOf(val, s2), i5 === -1)
          return !1;
        if (f = attr[i5 - 1], l3 = attr[i5 + val.length], (!f || f === " ") && (!l3 || l3 === " "))
          return !0;
      }
    },
    "|=": function(attr, val) {
      var i5 = attr.indexOf(val), l3;
      if (i5 !== 0)
        return;
      return l3 = attr[i5 + val.length], l3 === "-" || !l3;
    },
    "^=": function(attr, val) {
      return attr.indexOf(val) === 0;
    },
    "$=": function(attr, val) {
      var i5 = attr.lastIndexOf(val);
      return i5 !== -1 && i5 + val.length === attr.length;
    },
    "!=": function(attr, val) {
      return attr !== val;
    }
  }, combinators = {
    " ": function(test2) {
      return function(el) {
        while (el = el.parentNode)
          if (test2(el))
            return el;
      };
    },
    ">": function(test2) {
      return function(el) {
        if (el = el.parentNode)
          return test2(el) && el;
      };
    },
    "+": function(test2) {
      return function(el) {
        if (el = prev(el))
          return test2(el) && el;
      };
    },
    "~": function(test2) {
      return function(el) {
        while (el = prev(el))
          if (test2(el))
            return el;
      };
    },
    noop: function(test2) {
      return function(el) {
        return test2(el) && el;
      };
    },
    ref: function(test2, name3) {
      var node2;
      function ref(el) {
        var doc2 = el.ownerDocument, nodes = doc2.getElementsByTagName("*"), i5 = nodes.length;
        while (i5--)
          if (node2 = nodes[i5], ref.test(el))
            return node2 = null, !0;
        node2 = null;
      }
      return ref.combinator = function(el) {
        if (!node2 || !node2.getAttribute)
          return;
        var attr = node2.getAttribute(name3) || "";
        if (attr[0] === "#")
          attr = attr.substring(1);
        if (attr === el.id && test2(node2))
          return node2;
      }, ref;
    }
  }, rules = {
    escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
    str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
    nonascii: /[\u00A0-\uFFFF]/,
    cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
    qname: /^ *(cssid|\*)/,
    simple: /^(?:([.#]cssid)|pseudo|attr)/,
    ref: /^ *\/(cssid)\/ */,
    combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
    attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
    pseudo: /^(:cssid)(?:\((inside)\))?/,
    inside: /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
    ident: /^(cssid)$/
  };
  rules.cssid = replace2(rules.cssid, "nonascii", rules.nonascii);
  rules.cssid = replace2(rules.cssid, "escape", rules.escape);
  rules.qname = replace2(rules.qname, "cssid", rules.cssid);
  rules.simple = replace2(rules.simple, "cssid", rules.cssid);
  rules.ref = replace2(rules.ref, "cssid", rules.cssid);
  rules.attr = replace2(rules.attr, "cssid", rules.cssid);
  rules.pseudo = replace2(rules.pseudo, "cssid", rules.cssid);
  rules.inside = replace2(rules.inside, `[^"'>]*`, rules.inside);
  rules.attr = replace2(rules.attr, "inside", makeInside("\\[", "\\]"));
  rules.pseudo = replace2(rules.pseudo, "inside", makeInside("\\(", "\\)"));
  rules.simple = replace2(rules.simple, "pseudo", rules.pseudo);
  rules.simple = replace2(rules.simple, "attr", rules.attr);
  rules.ident = replace2(rules.ident, "cssid", rules.cssid);
  rules.str_escape = replace2(rules.str_escape, "escape", rules.escape);
  var compile4 = function(sel_) {
    var sel = sel_.replace(/^\s+|\s+$/g, ""), test2, filter3 = [], buff = [], subject, qname, cap, op, ref;
    while (sel) {
      if (cap = rules.qname.exec(sel))
        sel = sel.substring(cap[0].length), qname = decodeid(cap[1]), buff.push(tok(qname, !0));
      else if (cap = rules.simple.exec(sel))
        sel = sel.substring(cap[0].length), qname = "*", buff.push(tok(qname, !0)), buff.push(tok(cap));
      else
        throw SyntaxError("Invalid selector.");
      while (cap = rules.simple.exec(sel))
        sel = sel.substring(cap[0].length), buff.push(tok(cap));
      if (sel[0] === "!")
        sel = sel.substring(1), subject = makeSubject(), subject.qname = qname, buff.push(subject.simple);
      if (cap = rules.ref.exec(sel)) {
        sel = sel.substring(cap[0].length), ref = combinators.ref(makeSimple(buff), decodeid(cap[1])), filter3.push(ref.combinator), buff = [];
        continue;
      }
      if (cap = rules.combinator.exec(sel)) {
        if (sel = sel.substring(cap[0].length), op = cap[1] || cap[2] || cap[3], op === ",") {
          filter3.push(combinators.noop(makeSimple(buff)));
          break;
        }
      } else
        op = "noop";
      if (!combinators[op])
        throw SyntaxError("Bad combinator.");
      filter3.push(combinators[op](makeSimple(buff))), buff = [];
    }
    if (test2 = makeTest(filter3), test2.qname = qname, test2.sel = sel, subject)
      subject.lname = test2.qname, subject.test = test2, subject.qname = subject.qname, subject.sel = test2.sel, test2 = subject;
    if (ref)
      ref.test = test2, ref.qname = test2.qname, ref.sel = test2.sel, test2 = ref;
    return test2;
  }, tok = function(cap, qname) {
    if (qname)
      return cap === "*" ? selectors["*"] : selectors.type(cap);
    if (cap[1])
      return cap[1][0] === "." ? selectors.attr("class", "~=", decodeid(cap[1].substring(1)), !1) : selectors.attr("id", "=", decodeid(cap[1].substring(1)), !1);
    if (cap[2])
      return cap[3] ? selectors[decodeid(cap[2])](unquote(cap[3])) : selectors[decodeid(cap[2])];
    if (cap[4]) {
      var value = cap[6], i5 = /["'\s]\s*I$/i.test(value);
      if (i5)
        value = value.replace(/\s*I$/i, "");
      return selectors.attr(decodeid(cap[4]), cap[5] || "-", unquote(value), i5);
    }
    throw SyntaxError("Unknown Selector.");
  }, makeSimple = function(func) {
    var l3 = func.length, i5;
    if (l3 < 2)
      return func[0];
    return function(el) {
      if (!el)
        return;
      for (i5 = 0;i5 < l3; i5++)
        if (!func[i5](el))
          return;
      return !0;
    };
  }, makeTest = function(func) {
    if (func.length < 2)
      return function(el) {
        return !!func[0](el);
      };
    return function(el) {
      var i5 = func.length;
      while (i5--)
        if (!(el = func[i5](el)))
          return;
      return !0;
    };
  }, makeSubject = function() {
    var target;
    function subject(el) {
      var node2 = el.ownerDocument, scope = node2.getElementsByTagName(subject.lname), i5 = scope.length;
      while (i5--)
        if (subject.test(scope[i5]) && target === el)
          return target = null, !0;
      target = null;
    }
    return subject.simple = function(el) {
      return target = el, !0;
    }, subject;
  }, compileGroup = function(sel) {
    var test2 = compile4(sel), tests = [test2];
    while (test2.sel)
      test2 = compile4(test2.sel), tests.push(test2);
    if (tests.length < 2)
      return test2;
    return function(el) {
      var l3 = tests.length, i5 = 0;
      for (;i5 < l3; i5++)
        if (tests[i5](el))
          return !0;
    };
  }, find2 = function(sel, node2) {
    var results = [], test2 = compile4(sel), scope = node2.getElementsByTagName(test2.qname), i5 = 0, el;
    while (el = scope[i5++])
      if (test2(el))
        results.push(el);
    if (test2.sel) {
      while (test2.sel) {
        test2 = compile4(test2.sel), scope = node2.getElementsByTagName(test2.qname), i5 = 0;
        while (el = scope[i5++])
          if (test2(el) && indexOf.call(results, el) === -1)
            results.push(el);
      }
      results.sort(order);
    }
    return results;
  };
  module.exports = exports = function(sel, context6) {
    var id, r4;
    if (context6.nodeType !== 11 && sel.indexOf(" ") === -1) {
      if (sel[0] === "#" && context6.rooted && /^#[A-Z_][-A-Z0-9_]*$/i.test(sel)) {
        if (context6.doc._hasMultipleElementsWithId) {
          if (id = sel.substring(1), !context6.doc._hasMultipleElementsWithId(id))
            return r4 = context6.doc.getElementById(id), r4 ? [r4] : [];
        }
      }
      if (sel[0] === "." && /^\.\w+$/.test(sel))
        return context6.getElementsByClassName(sel.substring(1));
      if (/^\w+$/.test(sel))
        return context6.getElementsByTagName(sel);
    }
    return find2(sel, context6);
  };
  exports.selectors = selectors;
  exports.operators = operators;
  exports.combinators = combinators;
  exports.matches = function(el, sel) {
    var test2 = { sel };
    do
      if (test2 = compile4(test2.sel), test2(el))
        return !0;
    while (test2.sel);
    return !1;
  };
});
