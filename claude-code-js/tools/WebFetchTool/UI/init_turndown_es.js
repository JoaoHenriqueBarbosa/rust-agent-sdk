// var: init_turndown_es
var init_turndown_es = __esm(() => {
  blockElements = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];
  voidElements3 = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];
  meaningfulWhenBlankElements = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];
  markdownEscapes = [[/\\/g, "\\\\"], [/\*/g, "\\*"], [/^-/g, "\\-"], [/^\+ /g, "\\+ "], [/^(=+)/g, "\\$1"], [/^(#{1,6}) /g, "\\$1 "], [/`/g, "\\`"], [/^~~~/g, "\\~~~"], [/\[/g, "\\["], [/\]/g, "\\]"], [/^>/g, "\\>"], [/_/g, "\\_"], [/^(\d+)\. /g, "$1\\. "]];
  rules = {};
  rules.paragraph = {
    filter: "p",
    replacement: function(content) {
      return `

` + content + `

`;
    }
  };
  rules.lineBreak = {
    filter: "br",
    replacement: function(content, node2, options2) {
      return options2.br + `
`;
    }
  };
  rules.heading = {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function(content, node2, options2) {
      var hLevel = Number(node2.nodeName.charAt(1));
      if (options2.headingStyle === "setext" && hLevel < 3) {
        var underline2 = repeat2(hLevel === 1 ? "=" : "-", content.length);
        return `

` + content + `
` + underline2 + `

`;
      } else
        return `

` + repeat2("#", hLevel) + " " + content + `

`;
    }
  };
  rules.blockquote = {
    filter: "blockquote",
    replacement: function(content) {
      return content = trimNewlines(content).replace(/^/gm, "> "), `

` + content + `

`;
    }
  };
  rules.list = {
    filter: ["ul", "ol"],
    replacement: function(content, node2) {
      var parent2 = node2.parentNode;
      if (parent2.nodeName === "LI" && parent2.lastElementChild === node2)
        return `
` + content;
      else
        return `

` + content + `

`;
    }
  };
  rules.listItem = {
    filter: "li",
    replacement: function(content, node2, options2) {
      var prefix = options2.bulletListMarker + "   ", parent2 = node2.parentNode;
      if (parent2.nodeName === "OL") {
        var start = parent2.getAttribute("start"), index = Array.prototype.indexOf.call(parent2.children, node2);
        prefix = (start ? Number(start) + index : index + 1) + ".  ";
      }
      var isParagraph = /\n$/.test(content);
      return content = trimNewlines(content) + (isParagraph ? `
` : ""), content = content.replace(/\n/gm, `
` + " ".repeat(prefix.length)), prefix + content + (node2.nextSibling ? `
` : "");
    }
  };
  rules.indentedCodeBlock = {
    filter: function(node2, options2) {
      return options2.codeBlockStyle === "indented" && node2.nodeName === "PRE" && node2.firstChild && node2.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node2, options2) {
      return `

    ` + node2.firstChild.textContent.replace(/\n/g, `
    `) + `

`;
    }
  };
  rules.fencedCodeBlock = {
    filter: function(node2, options2) {
      return options2.codeBlockStyle === "fenced" && node2.nodeName === "PRE" && node2.firstChild && node2.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node2, options2) {
      var className = node2.firstChild.getAttribute("class") || "", language = (className.match(/language-(\S+)/) || [null, ""])[1], code = node2.firstChild.textContent, fenceChar = options2.fence.charAt(0), fenceSize = 3, fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm"), match;
      while (match = fenceInCodeRegex.exec(code))
        if (match[0].length >= fenceSize)
          fenceSize = match[0].length + 1;
      var fence = repeat2(fenceChar, fenceSize);
      return `

` + fence + language + `
` + code.replace(/\n$/, "") + `
` + fence + `

`;
    }
  };
  rules.horizontalRule = {
    filter: "hr",
    replacement: function(content, node2, options2) {
      return `

` + options2.hr + `

`;
    }
  };
  rules.inlineLink = {
    filter: function(node2, options2) {
      return options2.linkStyle === "inlined" && node2.nodeName === "A" && node2.getAttribute("href");
    },
    replacement: function(content, node2) {
      var href = escapeLinkDestination(node2.getAttribute("href")), title = escapeLinkTitle(cleanAttribute(node2.getAttribute("title"))), titlePart = title ? ' "' + title + '"' : "";
      return "[" + content + "](" + href + titlePart + ")";
    }
  };
  rules.referenceLink = {
    filter: function(node2, options2) {
      return options2.linkStyle === "referenced" && node2.nodeName === "A" && node2.getAttribute("href");
    },
    replacement: function(content, node2, options2) {
      var href = escapeLinkDestination(node2.getAttribute("href")), title = cleanAttribute(node2.getAttribute("title"));
      if (title)
        title = ' "' + escapeLinkTitle(title) + '"';
      var replacement, reference;
      switch (options2.linkReferenceStyle) {
        case "collapsed":
          replacement = "[" + content + "][]", reference = "[" + content + "]: " + href + title;
          break;
        case "shortcut":
          replacement = "[" + content + "]", reference = "[" + content + "]: " + href + title;
          break;
        default:
          var id = this.references.length + 1;
          replacement = "[" + content + "][" + id + "]", reference = "[" + id + "]: " + href + title;
      }
      return this.references.push(reference), replacement;
    },
    references: [],
    append: function(options2) {
      var references = "";
      if (this.references.length)
        references = `

` + this.references.join(`
`) + `

`, this.references = [];
      return references;
    }
  };
  rules.emphasis = {
    filter: ["em", "i"],
    replacement: function(content, node2, options2) {
      if (!content.trim())
        return "";
      return options2.emDelimiter + content + options2.emDelimiter;
    }
  };
  rules.strong = {
    filter: ["strong", "b"],
    replacement: function(content, node2, options2) {
      if (!content.trim())
        return "";
      return options2.strongDelimiter + content + options2.strongDelimiter;
    }
  };
  rules.code = {
    filter: function(node2) {
      var hasSiblings = node2.previousSibling || node2.nextSibling, isCodeBlock = node2.parentNode.nodeName === "PRE" && !hasSiblings;
      return node2.nodeName === "CODE" && !isCodeBlock;
    },
    replacement: function(content) {
      if (!content)
        return "";
      content = content.replace(/\r?\n|\r/g, " ");
      var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "", delimiter4 = "`", matches2 = content.match(/`+/gm) || [];
      while (matches2.indexOf(delimiter4) !== -1)
        delimiter4 = delimiter4 + "`";
      return delimiter4 + extraSpace + content + extraSpace + delimiter4;
    }
  };
  rules.image = {
    filter: "img",
    replacement: function(content, node2) {
      var alt = escapeMarkdown(cleanAttribute(node2.getAttribute("alt"))), src = escapeLinkDestination(node2.getAttribute("src") || ""), title = cleanAttribute(node2.getAttribute("title")), titlePart = title ? ' "' + escapeLinkTitle(title) + '"' : "";
      return src ? "![" + alt + "](" + src + titlePart + ")" : "";
    }
  };
  Rules.prototype = {
    add: function(key3, rule) {
      this.array.unshift(rule);
    },
    keep: function(filter3) {
      this._keep.unshift({
        filter: filter3,
        replacement: this.keepReplacement
      });
    },
    remove: function(filter3) {
      this._remove.unshift({
        filter: filter3,
        replacement: function() {
          return "";
        }
      });
    },
    forNode: function(node2) {
      if (node2.isBlank)
        return this.blankRule;
      var rule;
      if (rule = findRule(this.array, node2, this.options))
        return rule;
      if (rule = findRule(this._keep, node2, this.options))
        return rule;
      if (rule = findRule(this._remove, node2, this.options))
        return rule;
      return this.defaultRule;
    },
    forEach: function(fn) {
      for (var i5 = 0;i5 < this.array.length; i5++)
        fn(this.array[i5], i5);
    }
  };
  root2 = typeof window < "u" ? window : {};
  HTMLParser = canParseHTMLNatively() ? root2.DOMParser : createHTMLParser();
  reduce = Array.prototype.reduce;
  TurndownService.prototype = {
    turndown: function(input) {
      if (!canConvert(input))
        throw TypeError(input + " is not a string, or an element/document/fragment node.");
      if (input === "")
        return "";
      var output = process23.call(this, new RootNode(input, this.options));
      return postProcess2.call(this, output);
    },
    use: function(plugin) {
      if (Array.isArray(plugin))
        for (var i5 = 0;i5 < plugin.length; i5++)
          this.use(plugin[i5]);
      else if (typeof plugin === "function")
        plugin(this);
      else
        throw TypeError("plugin must be a Function or an Array of Functions");
      return this;
    },
    addRule: function(key3, rule) {
      return this.rules.add(key3, rule), this;
    },
    keep: function(filter3) {
      return this.rules.keep(filter3), this;
    },
    remove: function(filter3) {
      return this.rules.remove(filter3), this;
    },
    escape: function(string5) {
      return escapeMarkdown(string5);
    }
  };
});
