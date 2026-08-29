// Shared module state and imports
// Original: src/services/compact/microCompact.ts

// node_modules/marked/lib/marked.esm.js
var _defaults, noopTest, other, newline, blockCode, fences, hr, heading, bullet, lheadingCore, lheading, lheadingGfm, _paragraph, blockText, _blockLabel, def, list, _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", _comment, html, paragraph, blockquote, blockNormal, gfmTable, blockGfm, blockPedantic, escape2, inlineCode, br, inlineText, _punctuation, _punctuationOrSpace, _notPunctuationOrSpace, punctuation, _punctuationGfmStrongEm, _punctuationOrSpaceGfmStrongEm, _notPunctuationOrSpaceGfmStrongEm, blockSkip, emStrongLDelimCore, emStrongLDelim, emStrongLDelimGfm, emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", emStrongRDelimAst, emStrongRDelimAstGfm, emStrongRDelimUnd, anyPunctuation, autolink, _inlineComment, tag, _inlineLabel, link2, reflink, nolink, reflinkSearch, inlineNormal, inlinePedantic, inlineGfm, inlineBreaks, block, inline, escapeReplacements, getEscapeReplacement = (ch2) => escapeReplacements[ch2], _Tokenizer = class {
  options;
  rules;
  lexer;
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(src) {
    let cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0)
      return {
        type: "space",
        raw: cap[0]
      };
  }
  code(src) {
    let cap = this.rules.block.code.exec(src);
    if (cap) {
      let text2 = cap[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text2, `
`) : text2
      };
    }
  }
  fences(src) {
    let cap = this.rules.block.fences.exec(src);
    if (cap) {
      let raw = cap[0], text2 = indentCodeCompensation(raw, cap[3] || "", this.rules);
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
        text: text2
      };
    }
  }
  heading(src) {
    let cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text2 = cap[2].trim();
      if (this.rules.other.endingHash.test(text2)) {
        let trimmed = rtrim(text2, "#");
        if (this.options.pedantic)
          text2 = trimmed.trim();
        else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed))
          text2 = trimmed.trim();
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text: text2,
        tokens: this.lexer.inline(text2)
      };
    }
  }
  hr(src) {
    let cap = this.rules.block.hr.exec(src);
    if (cap)
      return {
        type: "hr",
        raw: rtrim(cap[0], `
`)
      };
  }
  blockquote(src) {
    let cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let lines2 = rtrim(cap[0], `
`).split(`
`), raw = "", text2 = "", tokens = [];
      while (lines2.length > 0) {
        let inBlockquote = !1, currentLines = [], i5;
        for (i5 = 0;i5 < lines2.length; i5++)
          if (this.rules.other.blockquoteStart.test(lines2[i5]))
            currentLines.push(lines2[i5]), inBlockquote = !0;
          else if (!inBlockquote)
            currentLines.push(lines2[i5]);
          else
            break;
        lines2 = lines2.slice(i5);
        let currentRaw = currentLines.join(`
`), currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        raw = raw ? `${raw}
${currentRaw}` : currentRaw, text2 = text2 ? `${text2}
${currentText}` : currentText;
        let top = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(currentText, tokens, !0), this.lexer.state.top = top, lines2.length === 0)
          break;
        let lastToken = tokens.at(-1);
        if (lastToken?.type === "code")
          break;
        else if (lastToken?.type === "blockquote") {
          let oldToken = lastToken, newText = oldToken.raw + `
` + lines2.join(`
`), newToken = this.blockquote(newText);
          tokens[tokens.length - 1] = newToken, raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw, text2 = text2.substring(0, text2.length - oldToken.text.length) + newToken.text;
          break;
        } else if (lastToken?.type === "list") {
          let oldToken = lastToken, newText = oldToken.raw + `
` + lines2.join(`
`), newToken = this.list(newText);
          tokens[tokens.length - 1] = newToken, raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw, text2 = text2.substring(0, text2.length - oldToken.raw.length) + newToken.raw, lines2 = newText.substring(tokens.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw,
        tokens,
        text: text2
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim(), isordered = bull.length > 1, list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      if (bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`, this.options.pedantic)
        bull = isordered ? bull : "[*+-]";
      let itemRegex = this.rules.other.listItemRegex(bull), endsWithBlankLine = !1;
      while (src) {
        let endEarly = !1, raw = "", itemContents = "";
        if (!(cap = itemRegex.exec(src)))
          break;
        if (this.rules.block.hr.test(src))
          break;
        raw = cap[0], src = src.substring(raw.length);
        let line = cap[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (t2) => " ".repeat(3 * t2.length)), nextLine = src.split(`
`, 1)[0], blankLine = !line.trim(), indent = 0;
        if (this.options.pedantic)
          indent = 2, itemContents = line.trimStart();
        else if (blankLine)
          indent = cap[1].length + 1;
        else
          indent = cap[2].search(this.rules.other.nonSpaceChar), indent = indent > 4 ? 1 : indent, itemContents = line.slice(indent), indent += cap[1].length;
        if (blankLine && this.rules.other.blankLine.test(nextLine))
          raw += nextLine + `
`, src = src.substring(nextLine.length + 1), endEarly = !0;
        if (!endEarly) {
          let nextBulletRegex = this.rules.other.nextBulletRegex(indent), hrRegex = this.rules.other.hrRegex(indent), fencesBeginRegex = this.rules.other.fencesBeginRegex(indent), headingBeginRegex = this.rules.other.headingBeginRegex(indent), htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
          while (src) {
            let rawLine = src.split(`
`, 1)[0], nextLineWithoutTabs;
            if (nextLine = rawLine, this.options.pedantic)
              nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  "), nextLineWithoutTabs = nextLine;
            else
              nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
            if (fencesBeginRegex.test(nextLine))
              break;
            if (headingBeginRegex.test(nextLine))
              break;
            if (htmlBeginRegex.test(nextLine))
              break;
            if (nextBulletRegex.test(nextLine))
              break;
            if (hrRegex.test(nextLine))
              break;
            if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim())
              itemContents += `
` + nextLineWithoutTabs.slice(indent);
            else {
              if (blankLine)
                break;
              if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4)
                break;
              if (fencesBeginRegex.test(line))
                break;
              if (headingBeginRegex.test(line))
                break;
              if (hrRegex.test(line))
                break;
              itemContents += `
` + nextLine;
            }
            if (!blankLine && !nextLine.trim())
              blankLine = !0;
            raw += rawLine + `
`, src = src.substring(rawLine.length + 1), line = nextLineWithoutTabs.slice(indent);
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine)
            list2.loose = !0;
          else if (this.rules.other.doubleBlankLine.test(raw))
            endsWithBlankLine = !0;
        }
        let istask = null, ischecked;
        if (this.options.gfm) {
          if (istask = this.rules.other.listIsTask.exec(itemContents), istask)
            ischecked = istask[0] !== "[ ] ", itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: !1,
          text: itemContents,
          tokens: []
        }), list2.raw += raw;
      }
      let lastItem = list2.items.at(-1);
      if (lastItem)
        lastItem.raw = lastItem.raw.trimEnd(), lastItem.text = lastItem.text.trimEnd();
      else
        return;
      list2.raw = list2.raw.trimEnd();
      for (let i5 = 0;i5 < list2.items.length; i5++)
        if (this.lexer.state.top = !1, list2.items[i5].tokens = this.lexer.blockTokens(list2.items[i5].text, []), !list2.loose) {
          let spacers = list2.items[i5].tokens.filter((t2) => t2.type === "space"), hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t2) => this.rules.other.anyLine.test(t2.raw));
          list2.loose = hasMultipleLineBreaks;
        }
      if (list2.loose)
        for (let i5 = 0;i5 < list2.items.length; i5++)
          list2.items[i5].loose = !0;
      return list2;
    }
  }
  html(src) {
    let cap = this.rules.block.html.exec(src);
    if (cap)
      return {
        type: "html",
        block: !0,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0]
      };
  }
  def(src) {
    let cap = this.rules.block.def.exec(src);
    if (cap) {
      let tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
      return {
        type: "def",
        tag: tag2,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    let cap = this.rules.block.table.exec(src);
    if (!cap)
      return;
    if (!this.rules.other.tableDelimiter.test(cap[2]))
      return;
    let headers = splitCells(cap[1]), aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|"), rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], item = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: []
    };
    if (headers.length !== aligns.length)
      return;
    for (let align of aligns)
      if (this.rules.other.tableAlignRight.test(align))
        item.align.push("right");
      else if (this.rules.other.tableAlignCenter.test(align))
        item.align.push("center");
      else if (this.rules.other.tableAlignLeft.test(align))
        item.align.push("left");
      else
        item.align.push(null);
    for (let i5 = 0;i5 < headers.length; i5++)
      item.header.push({
        text: headers[i5],
        tokens: this.lexer.inline(headers[i5]),
        header: !0,
        align: item.align[i5]
      });
    for (let row of rows)
      item.rows.push(splitCells(row, item.header.length).map((cell, i5) => {
        return {
          text: cell,
          tokens: this.lexer.inline(cell),
          header: !1,
          align: item.align[i5]
        };
      }));
    return item;
  }
  lheading(src) {
    let cap = this.rules.block.lheading.exec(src);
    if (cap)
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
  }
  paragraph(src) {
    let cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      let text2 = cap[1].charAt(cap[1].length - 1) === `
` ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text: text2,
        tokens: this.lexer.inline(text2)
      };
    }
  }
  text(src) {
    let cap = this.rules.block.text.exec(src);
    if (cap)
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
  }
  escape(src) {
    let cap = this.rules.inline.escape.exec(src);
    if (cap)
      return {
        type: "escape",
        raw: cap[0],
        text: cap[1]
      };
  }
  tag(src) {
    let cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0]))
        this.lexer.state.inLink = !0;
      else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0]))
        this.lexer.state.inLink = !1;
      if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0]))
        this.lexer.state.inRawBlock = !0;
      else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0]))
        this.lexer.state.inRawBlock = !1;
      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: cap[0]
      };
    }
  }
  link(src) {
    let cap = this.rules.inline.link.exec(src);
    if (cap) {
      let trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
        if (!this.rules.other.endAngleBracket.test(trimmedUrl))
          return;
        let rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0)
          return;
      } else {
        let lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex === -2)
          return;
        if (lastParenIndex > -1) {
          let linkLen = (cap[0].indexOf("!") === 0 ? 5 : 4) + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex), cap[0] = cap[0].substring(0, linkLen).trim(), cap[3] = "";
        }
      }
      let href = cap[2], title = "";
      if (this.options.pedantic) {
        let link22 = this.rules.other.pedanticHrefTitle.exec(href);
        if (link22)
          href = link22[1], title = link22[3];
      } else
        title = cap[3] ? cap[3].slice(1, -1) : "";
      if (href = href.trim(), this.rules.other.startAngleBracket.test(href))
        if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl))
          href = href.slice(1);
        else
          href = href.slice(1, -1);
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
        title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
      }, cap[0], this.lexer, this.rules);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      let linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " "), link22 = links[linkString.toLowerCase()];
      if (!link22) {
        let text2 = cap[0].charAt(0);
        return {
          type: "text",
          raw: text2,
          text: text2
        };
      }
      return outputLink(cap, link22, cap[0], this.lexer, this.rules);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match)
      return;
    if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric))
      return;
    if (!(match[1] || match[2]) || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
      let lLength = [...match[0]].length - 1, rDelim, rLength, delimTotal = lLength, midDelimTotal = 0, endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0, maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        if (rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6], !rDelim)
          continue;
        if (rLength = [...rDelim].length, match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        if (delimTotal -= rLength, delimTotal > 0)
          continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        let lastCharLength = [...match[0]][0].length, raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
        if (Math.min(lLength, rLength) % 2) {
          let text22 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text22,
            tokens: this.lexer.inlineTokens(text22)
          };
        }
        let text2 = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text: text2,
          tokens: this.lexer.inlineTokens(text2)
        };
      }
    }
  }
  codespan(src) {
    let cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text2 = cap[2].replace(this.rules.other.newLineCharGlobal, " "), hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text2), hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text2) && this.rules.other.endingSpaceChar.test(text2);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds)
        text2 = text2.substring(1, text2.length - 1);
      return {
        type: "codespan",
        raw: cap[0],
        text: text2
      };
    }
  }
  br(src) {
    let cap = this.rules.inline.br.exec(src);
    if (cap)
      return {
        type: "br",
        raw: cap[0]
      };
  }
  del(src) {
    let cap = this.rules.inline.del.exec(src);
    if (cap)
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
  }
  autolink(src) {
    let cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text2, href;
      if (cap[2] === "@")
        text2 = cap[1], href = "mailto:" + text2;
      else
        text2 = cap[1], href = text2;
      return {
        type: "link",
        raw: cap[0],
        text: text2,
        href,
        tokens: [
          {
            type: "text",
            raw: text2,
            text: text2
          }
        ]
      };
    }
  }
  url(src) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text2, href;
      if (cap[2] === "@")
        text2 = cap[0], href = "mailto:" + text2;
      else {
        let prevCapZero;
        do
          prevCapZero = cap[0], cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
        while (prevCapZero !== cap[0]);
        if (text2 = cap[0], cap[1] === "www.")
          href = "http://" + cap[0];
        else
          href = cap[0];
      }
      return {
        type: "link",
        raw: cap[0],
        text: text2,
        href,
        tokens: [
          {
            type: "text",
            raw: text2,
            text: text2
          }
        ]
      };
    }
  }
  inlineText(src) {
    let cap = this.rules.inline.text.exec(src);
    if (cap) {
      let escaped = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        escaped
      };
    }
  }
}, _Lexer = class __Lexer {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(options2) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = options2 || _defaults, this.options.tokenizer = this.options.tokenizer || new _Tokenizer, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    let rules = {
      other,
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic)
      rules.block = block.pedantic, rules.inline = inline.pedantic;
    else if (this.options.gfm)
      if (rules.block = block.gfm, this.options.breaks)
        rules.inline = inline.breaks;
      else
        rules.inline = inline.gfm;
    this.tokenizer.rules = rules;
  }
  static get rules() {
    return {
      block,
      inline
    };
  }
  static lex(src, options2) {
    return new __Lexer(options2).lex(src);
  }
  static lexInline(src, options2) {
    return new __Lexer(options2).inlineTokens(src);
  }
  lex(src) {
    src = src.replace(other.carriageReturn, `
`), this.blockTokens(src, this.tokens);
    for (let i5 = 0;i5 < this.inlineQueue.length; i5++) {
      let next = this.inlineQueue[i5];
      this.inlineTokens(next.src, next.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(src, tokens = [], lastParagraphClipped = !1) {
    if (this.options.pedantic)
      src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
    while (src) {
      let token;
      if (this.options.extensions?.block?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens))
          return src = src.substring(token.raw.length), tokens.push(token), !0;
        return !1;
      }))
        continue;
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        let lastToken = tokens.at(-1);
        if (token.raw.length === 1 && lastToken !== void 0)
          lastToken.raw += `
`;
        else
          tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        let lastToken = tokens.at(-1);
        if (lastToken?.type === "paragraph" || lastToken?.type === "text")
          lastToken.raw += `
` + token.raw, lastToken.text += `
` + token.text, this.inlineQueue.at(-1).src = lastToken.text;
        else
          tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        let lastToken = tokens.at(-1);
        if (lastToken?.type === "paragraph" || lastToken?.type === "text")
          lastToken.raw += `
` + token.raw, lastToken.text += `
` + token.raw, this.inlineQueue.at(-1).src = lastToken.text;
        else if (!this.tokens.links[token.tag])
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if (this.options.extensions?.startBlock) {
        let startIndex = 1 / 0, tempSrc = src.slice(1), tempStart;
        if (this.options.extensions.startBlock.forEach((getStartIndex) => {
          if (tempStart = getStartIndex.call({ lexer: this }, tempSrc), typeof tempStart === "number" && tempStart >= 0)
            startIndex = Math.min(startIndex, tempStart);
        }), startIndex < 1 / 0 && startIndex >= 0)
          cutSrc = src.substring(0, startIndex + 1);
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        let lastToken = tokens.at(-1);
        if (lastParagraphClipped && lastToken?.type === "paragraph")
          lastToken.raw += `
` + token.raw, lastToken.text += `
` + token.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = lastToken.text;
        else
          tokens.push(token);
        lastParagraphClipped = cutSrc.length !== src.length, src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        let lastToken = tokens.at(-1);
        if (lastToken?.type === "text")
          lastToken.raw += `
` + token.raw, lastToken.text += `
` + token.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = lastToken.text;
        else
          tokens.push(token);
        continue;
      }
      if (src) {
        let errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else
          throw Error(errMsg);
      }
    }
    return this.state.top = !0, tokens;
  }
  inline(src, tokens = []) {
    return this.inlineQueue.push({ src, tokens }), tokens;
  }
  inlineTokens(src, tokens = []) {
    let maskedSrc = src, match = null;
    if (this.tokens.links) {
      let links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null)
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1)))
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
      }
    }
    while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null)
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null)
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let keepPrevChar = !1, prevChar = "";
    while (src) {
      if (!keepPrevChar)
        prevChar = "";
      keepPrevChar = !1;
      let token;
      if (this.options.extensions?.inline?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens))
          return src = src.substring(token.raw.length), tokens.push(token), !0;
        return !1;
      }))
        continue;
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        let lastToken = tokens.at(-1);
        if (token.type === "text" && lastToken?.type === "text")
          lastToken.raw += token.raw, lastToken.text += token.text;
        else
          tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src)) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length), tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if (this.options.extensions?.startInline) {
        let startIndex = 1 / 0, tempSrc = src.slice(1), tempStart;
        if (this.options.extensions.startInline.forEach((getStartIndex) => {
          if (tempStart = getStartIndex.call({ lexer: this }, tempSrc), typeof tempStart === "number" && tempStart >= 0)
            startIndex = Math.min(startIndex, tempStart);
        }), startIndex < 1 / 0 && startIndex >= 0)
          cutSrc = src.substring(0, startIndex + 1);
      }
      if (token = this.tokenizer.inlineText(cutSrc)) {
        if (src = src.substring(token.raw.length), token.raw.slice(-1) !== "_")
          prevChar = token.raw.slice(-1);
        keepPrevChar = !0;
        let lastToken = tokens.at(-1);
        if (lastToken?.type === "text")
          lastToken.raw += token.raw, lastToken.text += token.text;
        else
          tokens.push(token);
        continue;
      }
      if (src) {
        let errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else
          throw Error(errMsg);
      }
    }
    return tokens;
  }
}, _Renderer = class {
  options;
  parser;
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(token) {
    return "";
  }
  code({ text: text2, lang, escaped }) {
    let langString = (lang || "").match(other.notSpaceStart)?.[0], code = text2.replace(other.endingNewline, "") + `
`;
    if (!langString)
      return "<pre><code>" + (escaped ? code : escape22(code, !0)) + `</code></pre>
`;
    return '<pre><code class="language-' + escape22(langString) + '">' + (escaped ? code : escape22(code, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens }) {
    return `<blockquote>
${this.parser.parse(tokens)}</blockquote>
`;
  }
  html({ text: text2 }) {
    return text2;
  }
  heading({ tokens, depth }) {
    return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
  }
  hr(token) {
    return `<hr>
`;
  }
  list(token) {
    let { ordered, start } = token, body = "";
    for (let j4 = 0;j4 < token.items.length; j4++) {
      let item = token.items[j4];
      body += this.listitem(item);
    }
    let type = ordered ? "ol" : "ul", startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startAttr + `>
` + body + "</" + type + `>
`;
  }
  listitem(item) {
    let itemBody = "";
    if (item.task) {
      let checkbox = this.checkbox({ checked: !!item.checked });
      if (item.loose)
        if (item.tokens[0]?.type === "paragraph") {
          if (item.tokens[0].text = checkbox + " " + item.tokens[0].text, item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text")
            item.tokens[0].tokens[0].text = checkbox + " " + escape22(item.tokens[0].tokens[0].text), item.tokens[0].tokens[0].escaped = !0;
        } else
          item.tokens.unshift({
            type: "text",
            raw: checkbox + " ",
            text: checkbox + " ",
            escaped: !0
          });
      else
        itemBody += checkbox + " ";
    }
    return itemBody += this.parser.parse(item.tokens, !!item.loose), `<li>${itemBody}</li>
`;
  }
  checkbox({ checked }) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens }) {
    return `<p>${this.parser.parseInline(tokens)}</p>
`;
  }
  table(token) {
    let header = "", cell = "";
    for (let j4 = 0;j4 < token.header.length; j4++)
      cell += this.tablecell(token.header[j4]);
    header += this.tablerow({ text: cell });
    let body = "";
    for (let j4 = 0;j4 < token.rows.length; j4++) {
      let row = token.rows[j4];
      cell = "";
      for (let k3 = 0;k3 < row.length; k3++)
        cell += this.tablecell(row[k3]);
      body += this.tablerow({ text: cell });
    }
    if (body)
      body = `<tbody>${body}</tbody>`;
    return `<table>
<thead>
` + header + `</thead>
` + body + `</table>
`;
  }
  tablerow({ text: text2 }) {
    return `<tr>
${text2}</tr>
`;
  }
  tablecell(token) {
    let content = this.parser.parseInline(token.tokens), type = token.header ? "th" : "td";
    return (token.align ? `<${type} align="${token.align}">` : `<${type}>`) + content + `</${type}>
`;
  }
  strong({ tokens }) {
    return `<strong>${this.parser.parseInline(tokens)}</strong>`;
  }
  em({ tokens }) {
    return `<em>${this.parser.parseInline(tokens)}</em>`;
  }
  codespan({ text: text2 }) {
    return `<code>${escape22(text2, !0)}</code>`;
  }
  br(token) {
    return "<br>";
  }
  del({ tokens }) {
    return `<del>${this.parser.parseInline(tokens)}</del>`;
  }
  link({ href, title, tokens }) {
    let text2 = this.parser.parseInline(tokens), cleanHref = cleanUrl(href);
    if (cleanHref === null)
      return text2;
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title)
      out += ' title="' + escape22(title) + '"';
    return out += ">" + text2 + "</a>", out;
  }
  image({ href, title, text: text2, tokens }) {
    if (tokens)
      text2 = this.parser.parseInline(tokens, this.parser.textRenderer);
    let cleanHref = cleanUrl(href);
    if (cleanHref === null)
      return escape22(text2);
    href = cleanHref;
    let out = `<img src="${href}" alt="${text2}"`;
    if (title)
      out += ` title="${escape22(title)}"`;
    return out += ">", out;
  }
  text(token) {
    return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : ("escaped" in token) && token.escaped ? token.text : escape22(token.text);
  }
}, _TextRenderer = class {
  strong({ text: text2 }) {
    return text2;
  }
  em({ text: text2 }) {
    return text2;
  }
  codespan({ text: text2 }) {
    return text2;
  }
  del({ text: text2 }) {
    return text2;
  }
  html({ text: text2 }) {
    return text2;
  }
  text({ text: text2 }) {
    return text2;
  }
  link({ text: text2 }) {
    return "" + text2;
  }
  image({ text: text2 }) {
    return "" + text2;
  }
  br() {
    return "";
  }
}, _Parser = class __Parser {
  options;
  renderer;
  textRenderer;
  constructor(options2) {
    this.options = options2 || _defaults, this.options.renderer = this.options.renderer || new _Renderer, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new _TextRenderer;
  }
  static parse(tokens, options2) {
    return new __Parser(options2).parse(tokens);
  }
  static parseInline(tokens, options2) {
    return new __Parser(options2).parseInline(tokens);
  }
  parse(tokens, top = !0) {
    let out = "";
    for (let i5 = 0;i5 < tokens.length; i5++) {
      let anyToken = tokens[i5];
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        let genericToken = anyToken, ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
        if (ret !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
          out += ret || "";
          continue;
        }
      }
      let token = anyToken;
      switch (token.type) {
        case "space": {
          out += this.renderer.space(token);
          continue;
        }
        case "hr": {
          out += this.renderer.hr(token);
          continue;
        }
        case "heading": {
          out += this.renderer.heading(token);
          continue;
        }
        case "code": {
          out += this.renderer.code(token);
          continue;
        }
        case "table": {
          out += this.renderer.table(token);
          continue;
        }
        case "blockquote": {
          out += this.renderer.blockquote(token);
          continue;
        }
        case "list": {
          out += this.renderer.list(token);
          continue;
        }
        case "html": {
          out += this.renderer.html(token);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(token);
          continue;
        }
        case "text": {
          let textToken = token, body = this.renderer.text(textToken);
          while (i5 + 1 < tokens.length && tokens[i5 + 1].type === "text")
            textToken = tokens[++i5], body += `
` + this.renderer.text(textToken);
          if (top)
            out += this.renderer.paragraph({
              type: "paragraph",
              raw: body,
              text: body,
              tokens: [{ type: "text", raw: body, text: body, escaped: !0 }]
            });
          else
            out += body;
          continue;
        }
        default: {
          let errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent)
            return console.error(errMsg), "";
          else
            throw Error(errMsg);
        }
      }
    }
    return out;
  }
  parseInline(tokens, renderer = this.renderer) {
    let out = "";
    for (let i5 = 0;i5 < tokens.length; i5++) {
      let anyToken = tokens[i5];
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        let ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
        if (ret !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
          out += ret || "";
          continue;
        }
      }
      let token = anyToken;
      switch (token.type) {
        case "escape": {
          out += renderer.text(token);
          break;
        }
        case "html": {
          out += renderer.html(token);
          break;
        }
        case "link": {
          out += renderer.link(token);
          break;
        }
        case "image": {
          out += renderer.image(token);
          break;
        }
        case "strong": {
          out += renderer.strong(token);
          break;
        }
        case "em": {
          out += renderer.em(token);
          break;
        }
        case "codespan": {
          out += renderer.codespan(token);
          break;
        }
        case "br": {
          out += renderer.br(token);
          break;
        }
        case "del": {
          out += renderer.del(token);
          break;
        }
        case "text": {
          out += renderer.text(token);
          break;
        }
        default: {
          let errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent)
            return console.error(errMsg), "";
          else
            throw Error(errMsg);
        }
      }
    }
    return out;
  }
}, _Hooks, Marked = class {
  defaults = _getDefaults();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = _Parser;
  Renderer = _Renderer;
  TextRenderer = _TextRenderer;
  Lexer = _Lexer;
  Tokenizer = _Tokenizer;
  Hooks = _Hooks;
  constructor(...args) {
    this.use(...args);
  }
  walkTokens(tokens, callback) {
    let values3 = [];
    for (let token of tokens)
      switch (values3 = values3.concat(callback.call(this, token)), token.type) {
        case "table": {
          let tableToken = token;
          for (let cell of tableToken.header)
            values3 = values3.concat(this.walkTokens(cell.tokens, callback));
          for (let row of tableToken.rows)
            for (let cell of row)
              values3 = values3.concat(this.walkTokens(cell.tokens, callback));
          break;
        }
        case "list": {
          let listToken = token;
          values3 = values3.concat(this.walkTokens(listToken.items, callback));
          break;
        }
        default: {
          let genericToken = token;
          if (this.defaults.extensions?.childTokens?.[genericToken.type])
            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
              let tokens2 = genericToken[childTokens].flat(1 / 0);
              values3 = values3.concat(this.walkTokens(tokens2, callback));
            });
          else if (genericToken.tokens)
            values3 = values3.concat(this.walkTokens(genericToken.tokens, callback));
        }
      }
    return values3;
  }
  use(...args) {
    let extensions20 = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return args.forEach((pack2) => {
      let opts = { ...pack2 };
      if (opts.async = this.defaults.async || opts.async || !1, pack2.extensions)
        pack2.extensions.forEach((ext) => {
          if (!ext.name)
            throw Error("extension name required");
          if ("renderer" in ext) {
            let prevRenderer = extensions20.renderers[ext.name];
            if (prevRenderer)
              extensions20.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === !1)
                  ret = prevRenderer.apply(this, args2);
                return ret;
              };
            else
              extensions20.renderers[ext.name] = ext.renderer;
          }
          if ("tokenizer" in ext) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline")
              throw Error("extension level must be 'block' or 'inline'");
            let extLevel = extensions20[ext.level];
            if (extLevel)
              extLevel.unshift(ext.tokenizer);
            else
              extensions20[ext.level] = [ext.tokenizer];
            if (ext.start) {
              if (ext.level === "block")
                if (extensions20.startBlock)
                  extensions20.startBlock.push(ext.start);
                else
                  extensions20.startBlock = [ext.start];
              else if (ext.level === "inline")
                if (extensions20.startInline)
                  extensions20.startInline.push(ext.start);
                else
                  extensions20.startInline = [ext.start];
            }
          }
          if ("childTokens" in ext && ext.childTokens)
            extensions20.childTokens[ext.name] = ext.childTokens;
        }), opts.extensions = extensions20;
      if (pack2.renderer) {
        let renderer = this.defaults.renderer || new _Renderer(this.defaults);
        for (let prop in pack2.renderer) {
          if (!(prop in renderer))
            throw Error(`renderer '${prop}' does not exist`);
          if (["options", "parser"].includes(prop))
            continue;
          let rendererProp = prop, rendererFunc = pack2.renderer[rendererProp], prevRenderer = renderer[rendererProp];
          renderer[rendererProp] = (...args2) => {
            let ret = rendererFunc.apply(renderer, args2);
            if (ret === !1)
              ret = prevRenderer.apply(renderer, args2);
            return ret || "";
          };
        }
        opts.renderer = renderer;
      }
      if (pack2.tokenizer) {
        let tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
        for (let prop in pack2.tokenizer) {
          if (!(prop in tokenizer))
            throw Error(`tokenizer '${prop}' does not exist`);
          if (["options", "rules", "lexer"].includes(prop))
            continue;
          let tokenizerProp = prop, tokenizerFunc = pack2.tokenizer[tokenizerProp], prevTokenizer = tokenizer[tokenizerProp];
          tokenizer[tokenizerProp] = (...args2) => {
            let ret = tokenizerFunc.apply(tokenizer, args2);
            if (ret === !1)
              ret = prevTokenizer.apply(tokenizer, args2);
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack2.hooks) {
        let hooks = this.defaults.hooks || new _Hooks;
        for (let prop in pack2.hooks) {
          if (!(prop in hooks))
            throw Error(`hook '${prop}' does not exist`);
          if (["options", "block"].includes(prop))
            continue;
          let hooksProp = prop, hooksFunc = pack2.hooks[hooksProp], prevHook = hooks[hooksProp];
          if (_Hooks.passThroughHooks.has(prop))
            hooks[hooksProp] = (arg) => {
              if (this.defaults.async)
                return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              let ret = hooksFunc.call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          else
            hooks[hooksProp] = (...args2) => {
              let ret = hooksFunc.apply(hooks, args2);
              if (ret === !1)
                ret = prevHook.apply(hooks, args2);
              return ret;
            };
        }
        opts.hooks = hooks;
      }
      if (pack2.walkTokens) {
        let walkTokens2 = this.defaults.walkTokens, packWalktokens = pack2.walkTokens;
        opts.walkTokens = function(token) {
          let values3 = [];
          if (values3.push(packWalktokens.call(this, token)), walkTokens2)
            values3 = values3.concat(walkTokens2.call(this, token));
          return values3;
        };
      }
      this.defaults = { ...this.defaults, ...opts };
    }), this;
  }
  setOptions(opt) {
    return this.defaults = { ...this.defaults, ...opt }, this;
  }
  lexer(src, options2) {
    return _Lexer.lex(src, options2 ?? this.defaults);
  }
  parser(tokens, options2) {
    return _Parser.parse(tokens, options2 ?? this.defaults);
  }
  parseMarkdown(blockType) {
    return (src, options2) => {
      let origOpt = { ...options2 }, opt = { ...this.defaults, ...origOpt }, throwError = this.onError(!!opt.silent, !!opt.async);
      if (this.defaults.async === !0 && origOpt.async === !1)
        return throwError(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof src > "u" || src === null)
        return throwError(Error("marked(): input parameter is undefined or null"));
      if (typeof src !== "string")
        return throwError(Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      if (opt.hooks)
        opt.hooks.options = opt, opt.hooks.block = blockType;
      let lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline, parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
      if (opt.async)
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
      try {
        if (opt.hooks)
          src = opt.hooks.preprocess(src);
        let tokens = lexer2(src, opt);
        if (opt.hooks)
          tokens = opt.hooks.processAllTokens(tokens);
        if (opt.walkTokens)
          this.walkTokens(tokens, opt.walkTokens);
        let html2 = parser2(tokens, opt);
        if (opt.hooks)
          html2 = opt.hooks.postprocess(html2);
        return html2;
      } catch (e) {
        return throwError(e);
      }
    };
  }
  onError(silent, async) {
    return (e) => {
      if (e.message += `
Please report this to https://github.com/markedjs/marked.`, silent) {
        let msg = "<p>An error occurred:</p><pre>" + escape22(e.message + "", !0) + "</pre>";
        if (async)
          return Promise.resolve(msg);
        return msg;
      }
      if (async)
        return Promise.reject(e);
      throw e;
    };
  }
}, markedInstance, options, setOptions, use, walkTokens, parseInline, parser, lexer;

// node_modules/picomatch/lib/constants.js

// node_modules/picomatch/lib/utils.js

// node_modules/picomatch/lib/scan.js

// node_modules/picomatch/lib/parse.js

// node_modules/picomatch/lib/picomatch.js

// node_modules/picomatch/index.js

