// var: require_Readability
var require_Readability = __commonJS((exports, module) => {
  function Readability(doc2, options2) {
    if (options2 && options2.documentElement)
      doc2 = options2, options2 = arguments[2];
    else if (!doc2 || !doc2.documentElement)
      throw Error("First argument to Readability constructor should be a document object.");
    if (options2 = options2 || {}, this._doc = doc2, this._docJSDOMParser = this._doc.firstChild.__JSDOMParser__, this._articleTitle = null, this._articleByline = null, this._articleDir = null, this._articleSiteName = null, this._attempts = [], this._metadata = {}, this._debug = !!options2.debug, this._maxElemsToParse = options2.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE, this._nbTopCandidates = options2.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES, this._charThreshold = options2.charThreshold || this.DEFAULT_CHAR_THRESHOLD, this._classesToPreserve = this.CLASSES_TO_PRESERVE.concat(options2.classesToPreserve || []), this._keepClasses = !!options2.keepClasses, this._serializer = options2.serializer || function(el) {
      return el.innerHTML;
    }, this._disableJSONLD = !!options2.disableJSONLD, this._allowedVideoRegex = options2.allowedVideoRegex || this.REGEXPS.videos, this._linkDensityModifier = options2.linkDensityModifier || 0, this._flags = this.FLAG_STRIP_UNLIKELYS | this.FLAG_WEIGHT_CLASSES | this.FLAG_CLEAN_CONDITIONALLY, this._debug) {
      let logNode = function(node) {
        if (node.nodeType == node.TEXT_NODE)
          return `${node.nodeName} ("${node.textContent}")`;
        let attrPairs = Array.from(node.attributes || [], function(attr) {
          return `${attr.name}="${attr.value}"`;
        }).join(" ");
        return `<${node.localName} ${attrPairs}>`;
      };
      this.log = function() {
        if (typeof console < "u") {
          let args = Array.from(arguments, (arg) => {
            if (arg && arg.nodeType == this.ELEMENT_NODE)
              return logNode(arg);
            return arg;
          });
          args.unshift("Reader: (Readability)"), console.log(...args);
        } else if (typeof dump < "u") {
          var msg = Array.prototype.map.call(arguments, function(x4) {
            return x4 && x4.nodeName ? logNode(x4) : x4;
          }).join(" ");
          dump("Reader: (Readability) " + msg + `
`);
        }
      };
    } else
      this.log = function() {};
  }
  Readability.prototype = {
    FLAG_STRIP_UNLIKELYS: 1,
    FLAG_WEIGHT_CLASSES: 2,
    FLAG_CLEAN_CONDITIONALLY: 4,
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    DEFAULT_MAX_ELEMS_TO_PARSE: 0,
    DEFAULT_N_TOP_CANDIDATES: 5,
    DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),
    DEFAULT_CHAR_THRESHOLD: 500,
    REGEXPS: {
      unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
      okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,
      positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,
      negative: /-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|footer|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|widget/i,
      extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
      byline: /byline|author|dateline|writtenby|p-author/i,
      replaceFonts: /<(\/?)font[^>]*>/gi,
      normalize: /\s{2,}/g,
      videos: /\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i,
      shareElements: /(\b|_)(share|sharedaddy)(\b|_)/i,
      nextLink: /(next|weiter|continue|>([^\|]|$)|\u00BB([^\|]|$))/i,
      prevLink: /(prev|earl|old|new|<|\u00AB)/i,
      tokenize: /\W+/g,
      whitespace: /^\s*$/,
      hasContent: /\S$/,
      hashUrl: /^#.+/,
      srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
      b64DataUrl: /^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i,
      commas: /\u002C|\u060C|\uFE50|\uFE10|\uFE11|\u2E41|\u2E34|\u2E32|\uFF0C/g,
      jsonLdArticleTypes: /^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/,
      adWords: /^(ad(vertising|vertisement)?|pub(licit\u00E9)?|werb(ung)?|\u5E7F\u544A|\u0420\u0435\u043A\u043B\u0430\u043C\u0430|Anuncio)$/iu,
      loadingWords: /^((loading|\u6B63\u5728\u52A0\u8F7D|\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430|chargement|cargando)(\u2026|\.\.\.)?)$/iu
    },
    UNLIKELY_ROLES: [
      "menu",
      "menubar",
      "complementary",
      "navigation",
      "alert",
      "alertdialog",
      "dialog"
    ],
    DIV_TO_P_ELEMS: /* @__PURE__ */ new Set([
      "BLOCKQUOTE",
      "DL",
      "DIV",
      "IMG",
      "OL",
      "P",
      "PRE",
      "TABLE",
      "UL"
    ]),
    ALTER_TO_DIV_EXCEPTIONS: ["DIV", "ARTICLE", "SECTION", "P", "OL", "UL"],
    PRESENTATIONAL_ATTRIBUTES: [
      "align",
      "background",
      "bgcolor",
      "border",
      "cellpadding",
      "cellspacing",
      "frame",
      "hspace",
      "rules",
      "style",
      "valign",
      "vspace"
    ],
    DEPRECATED_SIZE_ATTRIBUTE_ELEMS: ["TABLE", "TH", "TD", "HR", "PRE"],
    PHRASING_ELEMS: [
      "ABBR",
      "AUDIO",
      "B",
      "BDO",
      "BR",
      "BUTTON",
      "CITE",
      "CODE",
      "DATA",
      "DATALIST",
      "DFN",
      "EM",
      "EMBED",
      "I",
      "IMG",
      "INPUT",
      "KBD",
      "LABEL",
      "MARK",
      "MATH",
      "METER",
      "NOSCRIPT",
      "OBJECT",
      "OUTPUT",
      "PROGRESS",
      "Q",
      "RUBY",
      "SAMP",
      "SCRIPT",
      "SELECT",
      "SMALL",
      "SPAN",
      "STRONG",
      "SUB",
      "SUP",
      "TEXTAREA",
      "TIME",
      "VAR",
      "WBR"
    ],
    CLASSES_TO_PRESERVE: ["page"],
    HTML_ESCAPE_MAP: {
      lt: "<",
      gt: ">",
      amp: "&",
      quot: '"',
      apos: "'"
    },
    _postProcessContent(articleContent) {
      if (this._fixRelativeUris(articleContent), this._simplifyNestedElements(articleContent), !this._keepClasses)
        this._cleanClasses(articleContent);
    },
    _removeNodes(nodeList, filterFn) {
      if (this._docJSDOMParser && nodeList._isLiveNodeList)
        throw Error("Do not pass live node lists to _removeNodes");
      for (var i5 = nodeList.length - 1;i5 >= 0; i5--) {
        var node = nodeList[i5], parentNode = node.parentNode;
        if (parentNode) {
          if (!filterFn || filterFn.call(this, node, i5, nodeList))
            parentNode.removeChild(node);
        }
      }
    },
    _replaceNodeTags(nodeList, newTagName) {
      if (this._docJSDOMParser && nodeList._isLiveNodeList)
        throw Error("Do not pass live node lists to _replaceNodeTags");
      for (let node of nodeList)
        this._setNodeTag(node, newTagName);
    },
    _forEachNode(nodeList, fn) {
      Array.prototype.forEach.call(nodeList, fn, this);
    },
    _findNode(nodeList, fn) {
      return Array.prototype.find.call(nodeList, fn, this);
    },
    _someNode(nodeList, fn) {
      return Array.prototype.some.call(nodeList, fn, this);
    },
    _everyNode(nodeList, fn) {
      return Array.prototype.every.call(nodeList, fn, this);
    },
    _getAllNodesWithTag(node, tagNames) {
      if (node.querySelectorAll)
        return node.querySelectorAll(tagNames.join(","));
      return [].concat.apply([], tagNames.map(function(tag2) {
        var collection = node.getElementsByTagName(tag2);
        return Array.isArray(collection) ? collection : Array.from(collection);
      }));
    },
    _cleanClasses(node) {
      var classesToPreserve = this._classesToPreserve, className = (node.getAttribute("class") || "").split(/\s+/).filter((cls) => classesToPreserve.includes(cls)).join(" ");
      if (className)
        node.setAttribute("class", className);
      else
        node.removeAttribute("class");
      for (node = node.firstElementChild;node; node = node.nextElementSibling)
        this._cleanClasses(node);
    },
    _isUrl(str2) {
      try {
        return new URL(str2), !0;
      } catch {
        return !1;
      }
    },
    _fixRelativeUris(articleContent) {
      var baseURI = this._doc.baseURI, documentURI = this._doc.documentURI;
      function toAbsoluteURI(uri7) {
        if (baseURI == documentURI && uri7.charAt(0) == "#")
          return uri7;
        try {
          return new URL(uri7, baseURI).href;
        } catch (ex) {}
        return uri7;
      }
      var links = this._getAllNodesWithTag(articleContent, ["a"]);
      this._forEachNode(links, function(link5) {
        var href = link5.getAttribute("href");
        if (href)
          if (href.indexOf("javascript:") === 0)
            if (link5.childNodes.length === 1 && link5.childNodes[0].nodeType === this.TEXT_NODE) {
              var text2 = this._doc.createTextNode(link5.textContent);
              link5.parentNode.replaceChild(text2, link5);
            } else {
              var container = this._doc.createElement("span");
              while (link5.firstChild)
                container.appendChild(link5.firstChild);
              link5.parentNode.replaceChild(container, link5);
            }
          else
            link5.setAttribute("href", toAbsoluteURI(href));
      });
      var medias = this._getAllNodesWithTag(articleContent, [
        "img",
        "picture",
        "figure",
        "video",
        "audio",
        "source"
      ]);
      this._forEachNode(medias, function(media) {
        var src = media.getAttribute("src"), poster = media.getAttribute("poster"), srcset = media.getAttribute("srcset");
        if (src)
          media.setAttribute("src", toAbsoluteURI(src));
        if (poster)
          media.setAttribute("poster", toAbsoluteURI(poster));
        if (srcset) {
          var newSrcset = srcset.replace(this.REGEXPS.srcsetUrl, function(_, p1, p22, p32) {
            return toAbsoluteURI(p1) + (p22 || "") + p32;
          });
          media.setAttribute("srcset", newSrcset);
        }
      });
    },
    _simplifyNestedElements(articleContent) {
      var node = articleContent;
      while (node) {
        if (node.parentNode && ["DIV", "SECTION"].includes(node.tagName) && !(node.id && node.id.startsWith("readability"))) {
          if (this._isElementWithoutContent(node)) {
            node = this._removeAndGetNext(node);
            continue;
          } else if (this._hasSingleTagInsideElement(node, "DIV") || this._hasSingleTagInsideElement(node, "SECTION")) {
            var child = node.children[0];
            for (var i5 = 0;i5 < node.attributes.length; i5++)
              child.setAttributeNode(node.attributes[i5].cloneNode());
            node.parentNode.replaceChild(child, node), node = child;
            continue;
          }
        }
        node = this._getNextNode(node);
      }
    },
    _getArticleTitle() {
      var doc2 = this._doc, curTitle = "", origTitle = "";
      try {
        if (curTitle = origTitle = doc2.title.trim(), typeof curTitle !== "string")
          curTitle = origTitle = this._getInnerText(doc2.getElementsByTagName("title")[0]);
      } catch (e) {}
      var titleHadHierarchicalSeparators = !1;
      function wordCount(str2) {
        return str2.split(/\s+/).length;
      }
      if (/ [\|\-\\\/>\u00BB] /.test(curTitle)) {
        titleHadHierarchicalSeparators = / [\\\/>\u00BB] /.test(curTitle);
        let allSeparators = Array.from(origTitle.matchAll(/ [\|\-\\\/>\u00BB] /gi));
        if (curTitle = origTitle.substring(0, allSeparators.pop().index), wordCount(curTitle) < 3)
          curTitle = origTitle.replace(/^[^\|\-\\\/>\u00BB]*[\|\-\\\/>\u00BB]/gi, "");
      } else if (curTitle.includes(": ")) {
        var headings = this._getAllNodesWithTag(doc2, ["h1", "h2"]), trimmedTitle = curTitle.trim(), match = this._someNode(headings, function(heading2) {
          return heading2.textContent.trim() === trimmedTitle;
        });
        if (!match) {
          if (curTitle = origTitle.substring(origTitle.lastIndexOf(":") + 1), wordCount(curTitle) < 3)
            curTitle = origTitle.substring(origTitle.indexOf(":") + 1);
          else if (wordCount(origTitle.substr(0, origTitle.indexOf(":"))) > 5)
            curTitle = origTitle;
        }
      } else if (curTitle.length > 150 || curTitle.length < 15) {
        var hOnes = doc2.getElementsByTagName("h1");
        if (hOnes.length === 1)
          curTitle = this._getInnerText(hOnes[0]);
      }
      curTitle = curTitle.trim().replace(this.REGEXPS.normalize, " ");
      var curTitleWordCount = wordCount(curTitle);
      if (curTitleWordCount <= 4 && (!titleHadHierarchicalSeparators || curTitleWordCount != wordCount(origTitle.replace(/[\|\-\\\/>\u00BB]+/g, "")) - 1))
        curTitle = origTitle;
      return curTitle;
    },
    _prepDocument() {
      var doc2 = this._doc;
      if (this._removeNodes(this._getAllNodesWithTag(doc2, ["style"])), doc2.body)
        this._replaceBrs(doc2.body);
      this._replaceNodeTags(this._getAllNodesWithTag(doc2, ["font"]), "SPAN");
    },
    _nextNode(node) {
      var next = node;
      while (next && next.nodeType != this.ELEMENT_NODE && this.REGEXPS.whitespace.test(next.textContent))
        next = next.nextSibling;
      return next;
    },
    _replaceBrs(elem) {
      this._forEachNode(this._getAllNodesWithTag(elem, ["br"]), function(br2) {
        var next = br2.nextSibling, replaced = !1;
        while ((next = this._nextNode(next)) && next.tagName == "BR") {
          replaced = !0;
          var brSibling = next.nextSibling;
          next.remove(), next = brSibling;
        }
        if (replaced) {
          var p4 = this._doc.createElement("p");
          br2.parentNode.replaceChild(p4, br2), next = p4.nextSibling;
          while (next) {
            if (next.tagName == "BR") {
              var nextElem = this._nextNode(next.nextSibling);
              if (nextElem && nextElem.tagName == "BR")
                break;
            }
            if (!this._isPhrasingContent(next))
              break;
            var sibling = next.nextSibling;
            p4.appendChild(next), next = sibling;
          }
          while (p4.lastChild && this._isWhitespace(p4.lastChild))
            p4.lastChild.remove();
          if (p4.parentNode.tagName === "P")
            this._setNodeTag(p4.parentNode, "DIV");
        }
      });
    },
    _setNodeTag(node, tag2) {
      if (this.log("_setNodeTag", node, tag2), this._docJSDOMParser)
        return node.localName = tag2.toLowerCase(), node.tagName = tag2.toUpperCase(), node;
      var replacement = node.ownerDocument.createElement(tag2);
      while (node.firstChild)
        replacement.appendChild(node.firstChild);
      if (node.parentNode.replaceChild(replacement, node), node.readability)
        replacement.readability = node.readability;
      for (var i5 = 0;i5 < node.attributes.length; i5++)
        replacement.setAttributeNode(node.attributes[i5].cloneNode());
      return replacement;
    },
    _prepArticle(articleContent) {
      this._cleanStyles(articleContent), this._markDataTables(articleContent), this._fixLazyImages(articleContent), this._cleanConditionally(articleContent, "form"), this._cleanConditionally(articleContent, "fieldset"), this._clean(articleContent, "object"), this._clean(articleContent, "embed"), this._clean(articleContent, "footer"), this._clean(articleContent, "link"), this._clean(articleContent, "aside");
      var shareElementThreshold = this.DEFAULT_CHAR_THRESHOLD;
      this._forEachNode(articleContent.children, function(topCandidate) {
        this._cleanMatchedNodes(topCandidate, function(node, matchString) {
          return this.REGEXPS.shareElements.test(matchString) && node.textContent.length < shareElementThreshold;
        });
      }), this._clean(articleContent, "iframe"), this._clean(articleContent, "input"), this._clean(articleContent, "textarea"), this._clean(articleContent, "select"), this._clean(articleContent, "button"), this._cleanHeaders(articleContent), this._cleanConditionally(articleContent, "table"), this._cleanConditionally(articleContent, "ul"), this._cleanConditionally(articleContent, "div"), this._replaceNodeTags(this._getAllNodesWithTag(articleContent, ["h1"]), "h2"), this._removeNodes(this._getAllNodesWithTag(articleContent, ["p"]), function(paragraph2) {
        var contentElementCount = this._getAllNodesWithTag(paragraph2, [
          "img",
          "embed",
          "object",
          "iframe"
        ]).length;
        return contentElementCount === 0 && !this._getInnerText(paragraph2, !1);
      }), this._forEachNode(this._getAllNodesWithTag(articleContent, ["br"]), function(br2) {
        var next = this._nextNode(br2.nextSibling);
        if (next && next.tagName == "P")
          br2.remove();
      }), this._forEachNode(this._getAllNodesWithTag(articleContent, ["table"]), function(table) {
        var tbody = this._hasSingleTagInsideElement(table, "TBODY") ? table.firstElementChild : table;
        if (this._hasSingleTagInsideElement(tbody, "TR")) {
          var row = tbody.firstElementChild;
          if (this._hasSingleTagInsideElement(row, "TD")) {
            var cell = row.firstElementChild;
            cell = this._setNodeTag(cell, this._everyNode(cell.childNodes, this._isPhrasingContent) ? "P" : "DIV"), table.parentNode.replaceChild(cell, table);
          }
        }
      });
    },
    _initializeNode(node) {
      switch (node.readability = { contentScore: 0 }, node.tagName) {
        case "DIV":
          node.readability.contentScore += 5;
          break;
        case "PRE":
        case "TD":
        case "BLOCKQUOTE":
          node.readability.contentScore += 3;
          break;
        case "ADDRESS":
        case "OL":
        case "UL":
        case "DL":
        case "DD":
        case "DT":
        case "LI":
        case "FORM":
          node.readability.contentScore -= 3;
          break;
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
        case "TH":
          node.readability.contentScore -= 5;
          break;
      }
      node.readability.contentScore += this._getClassWeight(node);
    },
    _removeAndGetNext(node) {
      var nextNode = this._getNextNode(node, !0);
      return node.remove(), nextNode;
    },
    _getNextNode(node, ignoreSelfAndKids) {
      if (!ignoreSelfAndKids && node.firstElementChild)
        return node.firstElementChild;
      if (node.nextElementSibling)
        return node.nextElementSibling;
      do
        node = node.parentNode;
      while (node && !node.nextElementSibling);
      return node && node.nextElementSibling;
    },
    _textSimilarity(textA, textB) {
      var tokensA = textA.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean), tokensB = textB.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
      if (!tokensA.length || !tokensB.length)
        return 0;
      var uniqTokensB = tokensB.filter((token) => !tokensA.includes(token)), distanceB = uniqTokensB.join(" ").length / tokensB.join(" ").length;
      return 1 - distanceB;
    },
    _isValidByline(node, matchString) {
      var rel = node.getAttribute("rel"), itemprop = node.getAttribute("itemprop"), bylineLength = node.textContent.trim().length;
      return (rel === "author" || itemprop && itemprop.includes("author") || this.REGEXPS.byline.test(matchString)) && !!bylineLength && bylineLength < 100;
    },
    _getNodeAncestors(node, maxDepth) {
      maxDepth = maxDepth || 0;
      var i5 = 0, ancestors = [];
      while (node.parentNode) {
        if (ancestors.push(node.parentNode), maxDepth && ++i5 === maxDepth)
          break;
        node = node.parentNode;
      }
      return ancestors;
    },
    _grabArticle(page) {
      this.log("**** grabArticle ****");
      var doc2 = this._doc, isPaging = page !== null;
      if (page = page ? page : this._doc.body, !page)
        return this.log("No body found in document. Abort."), null;
      var pageCacheHtml = page.innerHTML;
      while (!0) {
        this.log("Starting grabArticle loop");
        var stripUnlikelyCandidates = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS), elementsToScore = [], node = this._doc.documentElement;
        let shouldRemoveTitleHeader = !0;
        while (node) {
          if (node.tagName === "HTML")
            this._articleLang = node.getAttribute("lang");
          var matchString = node.className + " " + node.id;
          if (!this._isProbablyVisible(node)) {
            this.log("Removing hidden node - " + matchString), node = this._removeAndGetNext(node);
            continue;
          }
          if (node.getAttribute("aria-modal") == "true" && node.getAttribute("role") == "dialog") {
            node = this._removeAndGetNext(node);
            continue;
          }
          if (!this._articleByline && !this._metadata.byline && this._isValidByline(node, matchString)) {
            var endOfSearchMarkerNode = this._getNextNode(node, !0), next = this._getNextNode(node), itemPropNameNode = null;
            while (next && next != endOfSearchMarkerNode) {
              var itemprop = next.getAttribute("itemprop");
              if (itemprop && itemprop.includes("name")) {
                itemPropNameNode = next;
                break;
              } else
                next = this._getNextNode(next);
            }
            this._articleByline = (itemPropNameNode ?? node).textContent.trim(), node = this._removeAndGetNext(node);
            continue;
          }
          if (shouldRemoveTitleHeader && this._headerDuplicatesTitle(node)) {
            this.log("Removing header: ", node.textContent.trim(), this._articleTitle.trim()), shouldRemoveTitleHeader = !1, node = this._removeAndGetNext(node);
            continue;
          }
          if (stripUnlikelyCandidates) {
            if (this.REGEXPS.unlikelyCandidates.test(matchString) && !this.REGEXPS.okMaybeItsACandidate.test(matchString) && !this._hasAncestorTag(node, "table") && !this._hasAncestorTag(node, "code") && node.tagName !== "BODY" && node.tagName !== "A") {
              this.log("Removing unlikely candidate - " + matchString), node = this._removeAndGetNext(node);
              continue;
            }
            if (this.UNLIKELY_ROLES.includes(node.getAttribute("role"))) {
              this.log("Removing content with role " + node.getAttribute("role") + " - " + matchString), node = this._removeAndGetNext(node);
              continue;
            }
          }
          if ((node.tagName === "DIV" || node.tagName === "SECTION" || node.tagName === "HEADER" || node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") && this._isElementWithoutContent(node)) {
            node = this._removeAndGetNext(node);
            continue;
          }
          if (this.DEFAULT_TAGS_TO_SCORE.includes(node.tagName))
            elementsToScore.push(node);
          if (node.tagName === "DIV") {
            var p4 = null, childNode = node.firstChild;
            while (childNode) {
              var nextSibling = childNode.nextSibling;
              if (this._isPhrasingContent(childNode)) {
                if (p4 !== null)
                  p4.appendChild(childNode);
                else if (!this._isWhitespace(childNode))
                  p4 = doc2.createElement("p"), node.replaceChild(p4, childNode), p4.appendChild(childNode);
              } else if (p4 !== null) {
                while (p4.lastChild && this._isWhitespace(p4.lastChild))
                  p4.lastChild.remove();
                p4 = null;
              }
              childNode = nextSibling;
            }
            if (this._hasSingleTagInsideElement(node, "P") && this._getLinkDensity(node) < 0.25) {
              var newNode = node.children[0];
              node.parentNode.replaceChild(newNode, node), node = newNode, elementsToScore.push(node);
            } else if (!this._hasChildBlockElement(node))
              node = this._setNodeTag(node, "P"), elementsToScore.push(node);
          }
          node = this._getNextNode(node);
        }
        var candidates = [];
        this._forEachNode(elementsToScore, function(elementToScore) {
          if (!elementToScore.parentNode || typeof elementToScore.parentNode.tagName > "u")
            return;
          var innerText = this._getInnerText(elementToScore);
          if (innerText.length < 25)
            return;
          var ancestors2 = this._getNodeAncestors(elementToScore, 5);
          if (ancestors2.length === 0)
            return;
          var contentScore = 0;
          contentScore += 1, contentScore += innerText.split(this.REGEXPS.commas).length, contentScore += Math.min(Math.floor(innerText.length / 100), 3), this._forEachNode(ancestors2, function(ancestor, level) {
            if (!ancestor.tagName || !ancestor.parentNode || typeof ancestor.parentNode.tagName > "u")
              return;
            if (typeof ancestor.readability > "u")
              this._initializeNode(ancestor), candidates.push(ancestor);
            if (level === 0)
              var scoreDivider = 1;
            else if (level === 1)
              scoreDivider = 2;
            else
              scoreDivider = level * 3;
            ancestor.readability.contentScore += contentScore / scoreDivider;
          });
        });
        var topCandidates = [];
        for (var c3 = 0, cl = candidates.length;c3 < cl; c3 += 1) {
          var candidate = candidates[c3], candidateScore = candidate.readability.contentScore * (1 - this._getLinkDensity(candidate));
          candidate.readability.contentScore = candidateScore, this.log("Candidate:", candidate, "with score " + candidateScore);
          for (var t2 = 0;t2 < this._nbTopCandidates; t2++) {
            var aTopCandidate = topCandidates[t2];
            if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
              if (topCandidates.splice(t2, 0, candidate), topCandidates.length > this._nbTopCandidates)
                topCandidates.pop();
              break;
            }
          }
        }
        var topCandidate = topCandidates[0] || null, neededToCreateTopCandidate = !1, parentOfTopCandidate;
        if (topCandidate === null || topCandidate.tagName === "BODY") {
          topCandidate = doc2.createElement("DIV"), neededToCreateTopCandidate = !0;
          while (page.firstChild)
            this.log("Moving child out:", page.firstChild), topCandidate.appendChild(page.firstChild);
          page.appendChild(topCandidate), this._initializeNode(topCandidate);
        } else if (topCandidate) {
          var alternativeCandidateAncestors = [];
          for (var i5 = 1;i5 < topCandidates.length; i5++)
            if (topCandidates[i5].readability.contentScore / topCandidate.readability.contentScore >= 0.75)
              alternativeCandidateAncestors.push(this._getNodeAncestors(topCandidates[i5]));
          var MINIMUM_TOPCANDIDATES = 3;
          if (alternativeCandidateAncestors.length >= MINIMUM_TOPCANDIDATES) {
            parentOfTopCandidate = topCandidate.parentNode;
            while (parentOfTopCandidate.tagName !== "BODY") {
              var listsContainingThisAncestor = 0;
              for (var ancestorIndex = 0;ancestorIndex < alternativeCandidateAncestors.length && listsContainingThisAncestor < MINIMUM_TOPCANDIDATES; ancestorIndex++)
                listsContainingThisAncestor += Number(alternativeCandidateAncestors[ancestorIndex].includes(parentOfTopCandidate));
              if (listsContainingThisAncestor >= MINIMUM_TOPCANDIDATES) {
                topCandidate = parentOfTopCandidate;
                break;
              }
              parentOfTopCandidate = parentOfTopCandidate.parentNode;
            }
          }
          if (!topCandidate.readability)
            this._initializeNode(topCandidate);
          parentOfTopCandidate = topCandidate.parentNode;
          var lastScore = topCandidate.readability.contentScore, scoreThreshold = lastScore / 3;
          while (parentOfTopCandidate.tagName !== "BODY") {
            if (!parentOfTopCandidate.readability) {
              parentOfTopCandidate = parentOfTopCandidate.parentNode;
              continue;
            }
            var parentScore = parentOfTopCandidate.readability.contentScore;
            if (parentScore < scoreThreshold)
              break;
            if (parentScore > lastScore) {
              topCandidate = parentOfTopCandidate;
              break;
            }
            lastScore = parentOfTopCandidate.readability.contentScore, parentOfTopCandidate = parentOfTopCandidate.parentNode;
          }
          parentOfTopCandidate = topCandidate.parentNode;
          while (parentOfTopCandidate.tagName != "BODY" && parentOfTopCandidate.children.length == 1)
            topCandidate = parentOfTopCandidate, parentOfTopCandidate = topCandidate.parentNode;
          if (!topCandidate.readability)
            this._initializeNode(topCandidate);
        }
        var articleContent = doc2.createElement("DIV");
        if (isPaging)
          articleContent.id = "readability-content";
        var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
        parentOfTopCandidate = topCandidate.parentNode;
        var siblings = parentOfTopCandidate.children;
        for (var s2 = 0, sl = siblings.length;s2 < sl; s2++) {
          var sibling = siblings[s2], append2 = !1;
          if (this.log("Looking at sibling node:", sibling, sibling.readability ? "with score " + sibling.readability.contentScore : ""), this.log("Sibling has score", sibling.readability ? sibling.readability.contentScore : "Unknown"), sibling === topCandidate)
            append2 = !0;
          else {
            var contentBonus = 0;
            if (sibling.className === topCandidate.className && topCandidate.className !== "")
              contentBonus += topCandidate.readability.contentScore * 0.2;
            if (sibling.readability && sibling.readability.contentScore + contentBonus >= siblingScoreThreshold)
              append2 = !0;
            else if (sibling.nodeName === "P") {
              var linkDensity = this._getLinkDensity(sibling), nodeContent = this._getInnerText(sibling), nodeLength = nodeContent.length;
              if (nodeLength > 80 && linkDensity < 0.25)
                append2 = !0;
              else if (nodeLength < 80 && nodeLength > 0 && linkDensity === 0 && nodeContent.search(/\.( |$)/) !== -1)
                append2 = !0;
            }
          }
          if (append2) {
            if (this.log("Appending node:", sibling), !this.ALTER_TO_DIV_EXCEPTIONS.includes(sibling.nodeName))
              this.log("Altering sibling:", sibling, "to div."), sibling = this._setNodeTag(sibling, "DIV");
            articleContent.appendChild(sibling), siblings = parentOfTopCandidate.children, s2 -= 1, sl -= 1;
          }
        }
        if (this._debug)
          this.log("Article content pre-prep: " + articleContent.innerHTML);
        if (this._prepArticle(articleContent), this._debug)
          this.log("Article content post-prep: " + articleContent.innerHTML);
        if (neededToCreateTopCandidate)
          topCandidate.id = "readability-page-1", topCandidate.className = "page";
        else {
          var div = doc2.createElement("DIV");
          div.id = "readability-page-1", div.className = "page";
          while (articleContent.firstChild)
            div.appendChild(articleContent.firstChild);
          articleContent.appendChild(div);
        }
        if (this._debug)
          this.log("Article content after paging: " + articleContent.innerHTML);
        var parseSuccessful = !0, textLength = this._getInnerText(articleContent, !0).length;
        if (textLength < this._charThreshold)
          if (parseSuccessful = !1, page.innerHTML = pageCacheHtml, this._attempts.push({
            articleContent,
            textLength
          }), this._flagIsActive(this.FLAG_STRIP_UNLIKELYS))
            this._removeFlag(this.FLAG_STRIP_UNLIKELYS);
          else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES))
            this._removeFlag(this.FLAG_WEIGHT_CLASSES);
          else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))
            this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY);
          else {
            if (this._attempts.sort(function(a2, b) {
              return b.textLength - a2.textLength;
            }), !this._attempts[0].textLength)
              return null;
            articleContent = this._attempts[0].articleContent, parseSuccessful = !0;
          }
        if (parseSuccessful) {
          var ancestors = [parentOfTopCandidate, topCandidate].concat(this._getNodeAncestors(parentOfTopCandidate));
          return this._someNode(ancestors, function(ancestor) {
            if (!ancestor.tagName)
              return !1;
            var articleDir = ancestor.getAttribute("dir");
            if (articleDir)
              return this._articleDir = articleDir, !0;
            return !1;
          }), articleContent;
        }
      }
    },
    _unescapeHtmlEntities(str2) {
      if (!str2)
        return str2;
      var htmlEscapeMap = this.HTML_ESCAPE_MAP;
      return str2.replace(/&(quot|amp|apos|lt|gt);/g, function(_, tag2) {
        return htmlEscapeMap[tag2];
      }).replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, function(_, hex, numStr) {
        var num = parseInt(hex || numStr, hex ? 16 : 10);
        if (num == 0 || num > 1114111 || num >= 55296 && num <= 57343)
          num = 65533;
        return String.fromCodePoint(num);
      });
    },
    _getJSONLD(doc2) {
      var scripts = this._getAllNodesWithTag(doc2, ["script"]), metadata;
      return this._forEachNode(scripts, function(jsonLdElement) {
        if (!metadata && jsonLdElement.getAttribute("type") === "application/ld+json")
          try {
            var content = jsonLdElement.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, ""), parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
              if (parsed = parsed.find((it) => {
                return it["@type"] && it["@type"].match(this.REGEXPS.jsonLdArticleTypes);
              }), !parsed)
                return;
            }
            var schemaDotOrgRegex = /^https?\:\/\/schema\.org\/?$/, matches = typeof parsed["@context"] === "string" && parsed["@context"].match(schemaDotOrgRegex) || typeof parsed["@context"] === "object" && typeof parsed["@context"]["@vocab"] == "string" && parsed["@context"]["@vocab"].match(schemaDotOrgRegex);
            if (!matches)
              return;
            if (!parsed["@type"] && Array.isArray(parsed["@graph"]))
              parsed = parsed["@graph"].find((it) => {
                return (it["@type"] || "").match(this.REGEXPS.jsonLdArticleTypes);
              });
            if (!parsed || !parsed["@type"] || !parsed["@type"].match(this.REGEXPS.jsonLdArticleTypes))
              return;
            if (metadata = {}, typeof parsed.name === "string" && typeof parsed.headline === "string" && parsed.name !== parsed.headline) {
              var title = this._getArticleTitle(), nameMatches = this._textSimilarity(parsed.name, title) > 0.75, headlineMatches = this._textSimilarity(parsed.headline, title) > 0.75;
              if (headlineMatches && !nameMatches)
                metadata.title = parsed.headline;
              else
                metadata.title = parsed.name;
            } else if (typeof parsed.name === "string")
              metadata.title = parsed.name.trim();
            else if (typeof parsed.headline === "string")
              metadata.title = parsed.headline.trim();
            if (parsed.author) {
              if (typeof parsed.author.name === "string")
                metadata.byline = parsed.author.name.trim();
              else if (Array.isArray(parsed.author) && parsed.author[0] && typeof parsed.author[0].name === "string")
                metadata.byline = parsed.author.filter(function(author) {
                  return author && typeof author.name === "string";
                }).map(function(author) {
                  return author.name.trim();
                }).join(", ");
            }
            if (typeof parsed.description === "string")
              metadata.excerpt = parsed.description.trim();
            if (parsed.publisher && typeof parsed.publisher.name === "string")
              metadata.siteName = parsed.publisher.name.trim();
            if (typeof parsed.datePublished === "string")
              metadata.datePublished = parsed.datePublished.trim();
          } catch (err2) {
            this.log(err2.message);
          }
      }), metadata ? metadata : {};
    },
    _getArticleMetadata(jsonld) {
      var metadata = {}, values3 = {}, metaElements = this._doc.getElementsByTagName("meta"), propertyPattern = /\s*(article|dc|dcterm|og|twitter)\s*:\s*(author|creator|description|published_time|title|site_name)\s*/gi, namePattern = /^\s*(?:(dc|dcterm|og|twitter|parsely|weibo:(article|webpage))\s*[-\.:]\s*)?(author|creator|pub-date|description|title|site_name)\s*$/i;
      if (this._forEachNode(metaElements, function(element) {
        var elementName = element.getAttribute("name"), elementProperty = element.getAttribute("property"), content = element.getAttribute("content");
        if (!content)
          return;
        var matches = null, name3 = null;
        if (elementProperty) {
          if (matches = elementProperty.match(propertyPattern), matches)
            name3 = matches[0].toLowerCase().replace(/\s/g, ""), values3[name3] = content.trim();
        }
        if (!matches && elementName && namePattern.test(elementName)) {
          if (name3 = elementName, content)
            name3 = name3.toLowerCase().replace(/\s/g, "").replace(/\./g, ":"), values3[name3] = content.trim();
        }
      }), metadata.title = jsonld.title || values3["dc:title"] || values3["dcterm:title"] || values3["og:title"] || values3["weibo:article:title"] || values3["weibo:webpage:title"] || values3.title || values3["twitter:title"] || values3["parsely-title"], !metadata.title)
        metadata.title = this._getArticleTitle();
      let articleAuthor = typeof values3["article:author"] === "string" && !this._isUrl(values3["article:author"]) ? values3["article:author"] : void 0;
      return metadata.byline = jsonld.byline || values3["dc:creator"] || values3["dcterm:creator"] || values3.author || values3["parsely-author"] || articleAuthor, metadata.excerpt = jsonld.excerpt || values3["dc:description"] || values3["dcterm:description"] || values3["og:description"] || values3["weibo:article:description"] || values3["weibo:webpage:description"] || values3.description || values3["twitter:description"], metadata.siteName = jsonld.siteName || values3["og:site_name"], metadata.publishedTime = jsonld.datePublished || values3["article:published_time"] || values3["parsely-pub-date"] || null, metadata.title = this._unescapeHtmlEntities(metadata.title), metadata.byline = this._unescapeHtmlEntities(metadata.byline), metadata.excerpt = this._unescapeHtmlEntities(metadata.excerpt), metadata.siteName = this._unescapeHtmlEntities(metadata.siteName), metadata.publishedTime = this._unescapeHtmlEntities(metadata.publishedTime), metadata;
    },
    _isSingleImage(node) {
      while (node) {
        if (node.tagName === "IMG")
          return !0;
        if (node.children.length !== 1 || node.textContent.trim() !== "")
          return !1;
        node = node.children[0];
      }
      return !1;
    },
    _unwrapNoscriptImages(doc2) {
      var imgs = Array.from(doc2.getElementsByTagName("img"));
      this._forEachNode(imgs, function(img) {
        for (var i5 = 0;i5 < img.attributes.length; i5++) {
          var attr = img.attributes[i5];
          switch (attr.name) {
            case "src":
            case "srcset":
            case "data-src":
            case "data-srcset":
              return;
          }
          if (/\.(jpg|jpeg|png|webp)/i.test(attr.value))
            return;
        }
        img.remove();
      });
      var noscripts = Array.from(doc2.getElementsByTagName("noscript"));
      this._forEachNode(noscripts, function(noscript) {
        if (!this._isSingleImage(noscript))
          return;
        var tmp = doc2.createElement("div");
        tmp.innerHTML = noscript.innerHTML;
        var prevElement = noscript.previousElementSibling;
        if (prevElement && this._isSingleImage(prevElement)) {
          var prevImg = prevElement;
          if (prevImg.tagName !== "IMG")
            prevImg = prevElement.getElementsByTagName("img")[0];
          var newImg = tmp.getElementsByTagName("img")[0];
          for (var i5 = 0;i5 < prevImg.attributes.length; i5++) {
            var attr = prevImg.attributes[i5];
            if (attr.value === "")
              continue;
            if (attr.name === "src" || attr.name === "srcset" || /\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
              if (newImg.getAttribute(attr.name) === attr.value)
                continue;
              var attrName = attr.name;
              if (newImg.hasAttribute(attrName))
                attrName = "data-old-" + attrName;
              newImg.setAttribute(attrName, attr.value);
            }
          }
          noscript.parentNode.replaceChild(tmp.firstElementChild, prevElement);
        }
      });
    },
    _removeScripts(doc2) {
      this._removeNodes(this._getAllNodesWithTag(doc2, ["script", "noscript"]));
    },
    _hasSingleTagInsideElement(element, tag2) {
      if (element.children.length != 1 || element.children[0].tagName !== tag2)
        return !1;
      return !this._someNode(element.childNodes, function(node) {
        return node.nodeType === this.TEXT_NODE && this.REGEXPS.hasContent.test(node.textContent);
      });
    },
    _isElementWithoutContent(node) {
      return node.nodeType === this.ELEMENT_NODE && !node.textContent.trim().length && (!node.children.length || node.children.length == node.getElementsByTagName("br").length + node.getElementsByTagName("hr").length);
    },
    _hasChildBlockElement(element) {
      return this._someNode(element.childNodes, function(node) {
        return this.DIV_TO_P_ELEMS.has(node.tagName) || this._hasChildBlockElement(node);
      });
    },
    _isPhrasingContent(node) {
      return node.nodeType === this.TEXT_NODE || this.PHRASING_ELEMS.includes(node.tagName) || (node.tagName === "A" || node.tagName === "DEL" || node.tagName === "INS") && this._everyNode(node.childNodes, this._isPhrasingContent);
    },
    _isWhitespace(node) {
      return node.nodeType === this.TEXT_NODE && node.textContent.trim().length === 0 || node.nodeType === this.ELEMENT_NODE && node.tagName === "BR";
    },
    _getInnerText(e, normalizeSpaces) {
      normalizeSpaces = typeof normalizeSpaces > "u" ? !0 : normalizeSpaces;
      var textContent = e.textContent.trim();
      if (normalizeSpaces)
        return textContent.replace(this.REGEXPS.normalize, " ");
      return textContent;
    },
    _getCharCount(e, s2) {
      return s2 = s2 || ",", this._getInnerText(e).split(s2).length - 1;
    },
    _cleanStyles(e) {
      if (!e || e.tagName.toLowerCase() === "svg")
        return;
      for (var i5 = 0;i5 < this.PRESENTATIONAL_ATTRIBUTES.length; i5++)
        e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[i5]);
      if (this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.includes(e.tagName))
        e.removeAttribute("width"), e.removeAttribute("height");
      var cur = e.firstElementChild;
      while (cur !== null)
        this._cleanStyles(cur), cur = cur.nextElementSibling;
    },
    _getLinkDensity(element) {
      var textLength = this._getInnerText(element).length;
      if (textLength === 0)
        return 0;
      var linkLength = 0;
      return this._forEachNode(element.getElementsByTagName("a"), function(linkNode) {
        var href = linkNode.getAttribute("href"), coefficient = href && this.REGEXPS.hashUrl.test(href) ? 0.3 : 1;
        linkLength += this._getInnerText(linkNode).length * coefficient;
      }), linkLength / textLength;
    },
    _getClassWeight(e) {
      if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES))
        return 0;
      var weight = 0;
      if (typeof e.className === "string" && e.className !== "") {
        if (this.REGEXPS.negative.test(e.className))
          weight -= 25;
        if (this.REGEXPS.positive.test(e.className))
          weight += 25;
      }
      if (typeof e.id === "string" && e.id !== "") {
        if (this.REGEXPS.negative.test(e.id))
          weight -= 25;
        if (this.REGEXPS.positive.test(e.id))
          weight += 25;
      }
      return weight;
    },
    _clean(e, tag2) {
      var isEmbed = ["object", "embed", "iframe"].includes(tag2);
      this._removeNodes(this._getAllNodesWithTag(e, [tag2]), function(element) {
        if (isEmbed) {
          for (var i5 = 0;i5 < element.attributes.length; i5++)
            if (this._allowedVideoRegex.test(element.attributes[i5].value))
              return !1;
          if (element.tagName === "object" && this._allowedVideoRegex.test(element.innerHTML))
            return !1;
        }
        return !0;
      });
    },
    _hasAncestorTag(node, tagName, maxDepth, filterFn) {
      maxDepth = maxDepth || 3, tagName = tagName.toUpperCase();
      var depth = 0;
      while (node.parentNode) {
        if (maxDepth > 0 && depth > maxDepth)
          return !1;
        if (node.parentNode.tagName === tagName && (!filterFn || filterFn(node.parentNode)))
          return !0;
        node = node.parentNode, depth++;
      }
      return !1;
    },
    _getRowAndColumnCount(table) {
      var rows = 0, columns = 0, trs = table.getElementsByTagName("tr");
      for (var i5 = 0;i5 < trs.length; i5++) {
        var rowspan = trs[i5].getAttribute("rowspan") || 0;
        if (rowspan)
          rowspan = parseInt(rowspan, 10);
        rows += rowspan || 1;
        var columnsInThisRow = 0, cells = trs[i5].getElementsByTagName("td");
        for (var j4 = 0;j4 < cells.length; j4++) {
          var colspan = cells[j4].getAttribute("colspan") || 0;
          if (colspan)
            colspan = parseInt(colspan, 10);
          columnsInThisRow += colspan || 1;
        }
        columns = Math.max(columns, columnsInThisRow);
      }
      return { rows, columns };
    },
    _markDataTables(root2) {
      var tables = root2.getElementsByTagName("table");
      for (var i5 = 0;i5 < tables.length; i5++) {
        var table = tables[i5], role = table.getAttribute("role");
        if (role == "presentation") {
          table._readabilityDataTable = !1;
          continue;
        }
        var datatable = table.getAttribute("datatable");
        if (datatable == "0") {
          table._readabilityDataTable = !1;
          continue;
        }
        var summary = table.getAttribute("summary");
        if (summary) {
          table._readabilityDataTable = !0;
          continue;
        }
        var caption = table.getElementsByTagName("caption")[0];
        if (caption && caption.childNodes.length) {
          table._readabilityDataTable = !0;
          continue;
        }
        var dataTableDescendants = ["col", "colgroup", "tfoot", "thead", "th"], descendantExists = function(tag2) {
          return !!table.getElementsByTagName(tag2)[0];
        };
        if (dataTableDescendants.some(descendantExists)) {
          this.log("Data table because found data-y descendant"), table._readabilityDataTable = !0;
          continue;
        }
        if (table.getElementsByTagName("table")[0]) {
          table._readabilityDataTable = !1;
          continue;
        }
        var sizeInfo = this._getRowAndColumnCount(table);
        if (sizeInfo.columns == 1 || sizeInfo.rows == 1) {
          table._readabilityDataTable = !1;
          continue;
        }
        if (sizeInfo.rows >= 10 || sizeInfo.columns > 4) {
          table._readabilityDataTable = !0;
          continue;
        }
        table._readabilityDataTable = sizeInfo.rows * sizeInfo.columns > 10;
      }
    },
    _fixLazyImages(root2) {
      this._forEachNode(this._getAllNodesWithTag(root2, ["img", "picture", "figure"]), function(elem) {
        if (elem.src && this.REGEXPS.b64DataUrl.test(elem.src)) {
          var parts = this.REGEXPS.b64DataUrl.exec(elem.src);
          if (parts[1] === "image/svg+xml")
            return;
          var srcCouldBeRemoved = !1;
          for (var i5 = 0;i5 < elem.attributes.length; i5++) {
            var attr = elem.attributes[i5];
            if (attr.name === "src")
              continue;
            if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
              srcCouldBeRemoved = !0;
              break;
            }
          }
          if (srcCouldBeRemoved) {
            var b64starts = parts[0].length, b64length = elem.src.length - b64starts;
            if (b64length < 133)
              elem.removeAttribute("src");
          }
        }
        if ((elem.src || elem.srcset && elem.srcset != "null") && !elem.className.toLowerCase().includes("lazy"))
          return;
        for (var j4 = 0;j4 < elem.attributes.length; j4++) {
          if (attr = elem.attributes[j4], attr.name === "src" || attr.name === "srcset" || attr.name === "alt")
            continue;
          var copyTo = null;
          if (/\.(jpg|jpeg|png|webp)\s+\d/.test(attr.value))
            copyTo = "srcset";
          else if (/^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(attr.value))
            copyTo = "src";
          if (copyTo) {
            if (elem.tagName === "IMG" || elem.tagName === "PICTURE")
              elem.setAttribute(copyTo, attr.value);
            else if (elem.tagName === "FIGURE" && !this._getAllNodesWithTag(elem, ["img", "picture"]).length) {
              var img = this._doc.createElement("img");
              img.setAttribute(copyTo, attr.value), elem.appendChild(img);
            }
          }
        }
      });
    },
    _getTextDensity(e, tags) {
      var textLength = this._getInnerText(e, !0).length;
      if (textLength === 0)
        return 0;
      var childrenLength = 0, children = this._getAllNodesWithTag(e, tags);
      return this._forEachNode(children, (child) => childrenLength += this._getInnerText(child, !0).length), childrenLength / textLength;
    },
    _cleanConditionally(e, tag2) {
      if (!this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))
        return;
      this._removeNodes(this._getAllNodesWithTag(e, [tag2]), function(node) {
        var isDataTable = function(t2) {
          return t2._readabilityDataTable;
        }, isList = tag2 === "ul" || tag2 === "ol";
        if (!isList) {
          var listLength = 0, listNodes = this._getAllNodesWithTag(node, ["ul", "ol"]);
          this._forEachNode(listNodes, (list2) => listLength += this._getInnerText(list2).length), isList = listLength / this._getInnerText(node).length > 0.9;
        }
        if (tag2 === "table" && isDataTable(node))
          return !1;
        if (this._hasAncestorTag(node, "table", -1, isDataTable))
          return !1;
        if (this._hasAncestorTag(node, "code"))
          return !1;
        if ([...node.getElementsByTagName("table")].some((tbl) => tbl._readabilityDataTable))
          return !1;
        var weight = this._getClassWeight(node);
        this.log("Cleaning Conditionally", node);
        var contentScore = 0;
        if (weight + contentScore < 0)
          return !0;
        if (this._getCharCount(node, ",") < 10) {
          var p4 = node.getElementsByTagName("p").length, img = node.getElementsByTagName("img").length, li = node.getElementsByTagName("li").length - 100, input = node.getElementsByTagName("input").length, headingDensity = this._getTextDensity(node, [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6"
          ]), embedCount = 0, embeds = this._getAllNodesWithTag(node, [
            "object",
            "embed",
            "iframe"
          ]);
          for (var i5 = 0;i5 < embeds.length; i5++) {
            for (var j4 = 0;j4 < embeds[i5].attributes.length; j4++)
              if (this._allowedVideoRegex.test(embeds[i5].attributes[j4].value))
                return !1;
            if (embeds[i5].tagName === "object" && this._allowedVideoRegex.test(embeds[i5].innerHTML))
              return !1;
            embedCount++;
          }
          var innerText = this._getInnerText(node);
          if (this.REGEXPS.adWords.test(innerText) || this.REGEXPS.loadingWords.test(innerText))
            return !0;
          var contentLength = innerText.length, linkDensity = this._getLinkDensity(node), textishTags = ["SPAN", "LI", "TD"].concat(Array.from(this.DIV_TO_P_ELEMS)), textDensity = this._getTextDensity(node, textishTags), isFigureChild = this._hasAncestorTag(node, "figure"), haveToRemove = (() => {
            let errs = [];
            if (!isFigureChild && img > 1 && p4 / img < 0.5)
              errs.push(`Bad p to img ratio (img=${img}, p=${p4})`);
            if (!isList && li > p4)
              errs.push(`Too many li's outside of a list. (li=${li} > p=${p4})`);
            if (input > Math.floor(p4 / 3))
              errs.push(`Too many inputs per p. (input=${input}, p=${p4})`);
            if (!isList && !isFigureChild && headingDensity < 0.9 && contentLength < 25 && (img === 0 || img > 2) && linkDensity > 0)
              errs.push(`Suspiciously short. (headingDensity=${headingDensity}, img=${img}, linkDensity=${linkDensity})`);
            if (!isList && weight < 25 && linkDensity > 0.2 + this._linkDensityModifier)
              errs.push(`Low weight and a little linky. (linkDensity=${linkDensity})`);
            if (weight >= 25 && linkDensity > 0.5 + this._linkDensityModifier)
              errs.push(`High weight and mostly links. (linkDensity=${linkDensity})`);
            if (embedCount === 1 && contentLength < 75 || embedCount > 1)
              errs.push(`Suspicious embed. (embedCount=${embedCount}, contentLength=${contentLength})`);
            if (img === 0 && textDensity === 0)
              errs.push(`No useful content. (img=${img}, textDensity=${textDensity})`);
            if (errs.length)
              return this.log("Checks failed", errs), !0;
            return !1;
          })();
          if (isList && haveToRemove) {
            for (var x4 = 0;x4 < node.children.length; x4++)
              if (node.children[x4].children.length > 1)
                return haveToRemove;
            let li_count = node.getElementsByTagName("li").length;
            if (img == li_count)
              return !1;
          }
          return haveToRemove;
        }
        return !1;
      });
    },
    _cleanMatchedNodes(e, filter2) {
      var endOfSearchMarkerNode = this._getNextNode(e, !0), next = this._getNextNode(e);
      while (next && next != endOfSearchMarkerNode)
        if (filter2.call(this, next, next.className + " " + next.id))
          next = this._removeAndGetNext(next);
        else
          next = this._getNextNode(next);
    },
    _cleanHeaders(e) {
      let headingNodes = this._getAllNodesWithTag(e, ["h1", "h2"]);
      this._removeNodes(headingNodes, function(node) {
        let shouldRemove = this._getClassWeight(node) < 0;
        if (shouldRemove)
          this.log("Removing header with low class weight:", node);
        return shouldRemove;
      });
    },
    _headerDuplicatesTitle(node) {
      if (node.tagName != "H1" && node.tagName != "H2")
        return !1;
      var heading2 = this._getInnerText(node, !1);
      return this.log("Evaluating similarity of header:", heading2, this._articleTitle), this._textSimilarity(this._articleTitle, heading2) > 0.75;
    },
    _flagIsActive(flag) {
      return (this._flags & flag) > 0;
    },
    _removeFlag(flag) {
      this._flags = this._flags & ~flag;
    },
    _isProbablyVisible(node) {
      return (!node.style || node.style.display != "none") && (!node.style || node.style.visibility != "hidden") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.includes && node.className.includes("fallback-image"));
    },
    parse() {
      if (this._maxElemsToParse > 0) {
        var numTags = this._doc.getElementsByTagName("*").length;
        if (numTags > this._maxElemsToParse)
          throw Error("Aborting parsing document; " + numTags + " elements found");
      }
      this._unwrapNoscriptImages(this._doc);
      var jsonLd = this._disableJSONLD ? {} : this._getJSONLD(this._doc);
      this._removeScripts(this._doc), this._prepDocument();
      var metadata = this._getArticleMetadata(jsonLd);
      this._metadata = metadata, this._articleTitle = metadata.title;
      var articleContent = this._grabArticle();
      if (!articleContent)
        return null;
      if (this.log("Grabbed: " + articleContent.innerHTML), this._postProcessContent(articleContent), !metadata.excerpt) {
        var paragraphs = articleContent.getElementsByTagName("p");
        if (paragraphs.length)
          metadata.excerpt = paragraphs[0].textContent.trim();
      }
      var textContent = articleContent.textContent;
      return {
        title: this._articleTitle,
        byline: metadata.byline || this._articleByline,
        dir: this._articleDir,
        lang: this._articleLang,
        content: this._serializer(articleContent),
        textContent,
        length: textContent.length,
        excerpt: metadata.excerpt,
        siteName: metadata.siteName || this._articleSiteName,
        publishedTime: metadata.publishedTime
      };
    }
  };
  if (typeof module === "object")
    module.exports = Readability;
});
