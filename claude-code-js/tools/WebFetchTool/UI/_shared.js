// Shared module state and imports
// Original: src/tools/WebFetchTool/UI.tsx
var jsx_dev_runtime138;

// node_modules/@mozilla/readability/Readability.js

// node_modules/@mozilla/readability/Readability-readerable.js

// node_modules/@mozilla/readability/index.js

// node_modules/linkedom/esm/shared/symbols.js
var CHANGED, CLASS_LIST, CUSTOM_ELEMENTS, CONTENT, DATASET, DOCTYPE, DOM_PARSER, END, EVENT_TARGET, GLOBALS, IMAGE, MIME, MUTATION_OBSERVER, NEXT, OWNER_ELEMENT, PREV, PRIVATE, SHEET, START, STYLE, UPGRADE, VALUE;

// node_modules/entities/dist/esm/decode-codepoint.js
var _a3, decodeMap, fromCodePoint;

// node_modules/entities/dist/esm/internal/decode-shared.js

// node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree;

// node_modules/entities/dist/esm/generated/decode-data-xml.js
var xmlDecodeTree;

// node_modules/entities/dist/esm/internal/bin-trie-flags.js
var BinTrieFlags;

// node_modules/entities/dist/esm/decode.js

var CharCodes, TO_LOWER_BIT = 32, EntityDecoderState, DecodingMode;

// node_modules/htmlparser2/dist/esm/Tokenizer.js

var CharCodes2, State, QuoteType, Sequences;

// node_modules/htmlparser2/dist/esm/Parser.js
var formTags, pTag, tableSectionTags, ddtTags, rtpTags, openImpliesClose, voidElements, foreignContextElements, htmlIntegrationElements, reNameEnd;

// node_modules/domelementtype/lib/esm/index.js
__export(exports_esm6, {
  isTag: () => isTag,
  Text: () => Text3,
  Tag: () => Tag,
  Style: () => Style,
  Script: () => Script,
  Root: () => Root,
  ElementType: () => ElementType,
  Doctype: () => Doctype,
  Directive: () => Directive,
  Comment: () => Comment,
  CDATA: () => CDATA
});
var ElementType, Root, Text3, Directive, Comment, Script, Style, Tag, CDATA, Doctype;

// node_modules/domhandler/lib/esm/node.js
var DataNode, Text4, Comment2, ProcessingInstruction, NodeWithChildren, CDATA2, Document, Element;

// node_modules/domhandler/lib/esm/index.js
var defaultOpts;

// node_modules/dom-serializer/node_modules/entities/lib/esm/escape.js
var xmlReplacer, xmlCodeMap, getCodePoint, escapeUTF8, escapeAttribute, escapeText;

// node_modules/dom-serializer/node_modules/entities/lib/esm/index.js
var EntityLevel, EncodingMode;

// node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames, attributeNames;

// node_modules/dom-serializer/lib/esm/index.js
var unencodedElements, singleTag, esm_default6, foreignModeIntegrationPoints, foreignElements;

// node_modules/domutils/lib/esm/stringify.js

// node_modules/domutils/lib/esm/traversal.js

// node_modules/domutils/lib/esm/manipulation.js

// node_modules/domutils/lib/esm/querying.js

// node_modules/domutils/lib/esm/legacy.js
var Checks;

// node_modules/domutils/lib/esm/helpers.js
var DocumentPosition;

// node_modules/domutils/lib/esm/feeds.js
var MEDIA_KEYS_STRING, MEDIA_KEYS_INT;

// node_modules/domutils/lib/esm/index.js
__export(exports_esm7, {
  uniqueSort: () => uniqueSort,
  textContent: () => textContent,
  testElement: () => testElement,
  replaceElement: () => replaceElement,
  removeSubsets: () => removeSubsets,
  removeElement: () => removeElement,
  prevElementSibling: () => prevElementSibling,
  prependChild: () => prependChild,
  prepend: () => prepend,
  nextElementSibling: () => nextElementSibling,
  isText: () => isText,
  isTag: () => isTag2,
  isDocument: () => isDocument,
  isComment: () => isComment,
  isCDATA: () => isCDATA,
  innerText: () => innerText,
  hasChildren: () => hasChildren,
  hasAttrib: () => hasAttrib,
  getText: () => getText,
  getSiblings: () => getSiblings,
  getParent: () => getParent,
  getOuterHTML: () => getOuterHTML,
  getName: () => getName2,
  getInnerHTML: () => getInnerHTML,
  getFeed: () => getFeed,
  getElementsByTagType: () => getElementsByTagType,
  getElementsByTagName: () => getElementsByTagName,
  getElementsByClassName: () => getElementsByClassName,
  getElements: () => getElements,
  getElementById: () => getElementById,
  getChildren: () => getChildren,
  getAttributeValue: () => getAttributeValue,
  findOneChild: () => findOneChild,
  findOne: () => findOne,
  findAll: () => findAll,
  find: () => find,
  filter: () => filter2,
  existsOne: () => existsOne,
  compareDocumentPosition: () => compareDocumentPosition,
  appendChild: () => appendChild,
  append: () => append2,
  DocumentPosition: () => DocumentPosition
});

// node_modules/htmlparser2/dist/esm/index.js
__export(exports_esm8, {
  parseFeed: () => parseFeed,
  parseDocument: () => parseDocument,
  parseDOM: () => parseDOM,
  getFeed: () => getFeed,
  createDomStream: () => createDomStream,
  createDocumentStream: () => createDocumentStream,
  Tokenizer: () => Tokenizer,
  QuoteType: () => QuoteType,
  Parser: () => Parser2,
  ElementType: () => exports_esm6,
  DomUtils: () => exports_esm7,
  DomHandler: () => DomHandler,
  DefaultHandler: () => DomHandler
});
var parseFeedDefaultOptions;

// node_modules/linkedom/esm/shared/constants.js

// node_modules/linkedom/esm/shared/object.js
var assign, create, defineProperties, entries, getOwnPropertyDescriptors, keys2, setPrototypeOf;

// node_modules/linkedom/esm/shared/utils.js
var $String, getEnd = (node2) => node2.nodeType === ELEMENT_NODE ? node2[END] : node2, ignoreCase = ({ ownerDocument }) => ownerDocument[MIME].ignoreCase, knownAdjacent = (prev, next) => {
  prev[NEXT] = next, next[PREV] = prev;
}, knownBoundaries = (prev, current, next) => {
  knownAdjacent(prev, current), knownAdjacent(getEnd(current), next);
}, knownSegment = (prev, start, end, next) => {
  knownAdjacent(prev, start), knownAdjacent(getEnd(end), next);
}, knownSiblings = (prev, current, next) => {
  knownAdjacent(prev, current), knownAdjacent(current, next);
}, localCase = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].ignoreCase ? localName.toUpperCase() : localName;
}, setAdjacent = (prev, next) => {
  if (prev)
    prev[NEXT] = next;
  if (next)
    next[PREV] = prev;
}, htmlToFragment = (ownerDocument, html2) => {
  let fragment = ownerDocument.createDocumentFragment(), elem = ownerDocument.createElement("");
  elem.innerHTML = html2;
  let { firstChild, lastChild } = elem;
  if (firstChild) {
    knownSegment(fragment, firstChild, lastChild, fragment[END]);
    let child = firstChild;
    do
      child.parentNode = fragment;
    while (child !== lastChild && (child = getEnd(child)[NEXT]));
  }
  return fragment;
};

// node_modules/linkedom/esm/shared/shadow-roots.js
var shadowRoots;

// node_modules/linkedom/esm/interface/custom-element-registry.js

// node_modules/linkedom/esm/shared/parse-from-string.js
var Parser3, notParsing = !0, append3 = (self2, node2, active) => {
  let end = self2[END];
  if (node2.parentNode = self2, knownBoundaries(end[PREV], node2, end), active && node2.nodeType === ELEMENT_NODE)
    connectedCallback(node2);
  return node2;
}, attribute = (element, end, attribute2, value, active) => {
  if (attribute2[VALUE] = value, attribute2.ownerElement = element, knownSiblings(end[PREV], attribute2, end), attribute2.name === "class")
    element.className = value;
  if (active)
    attributeChangedCallback(element, attribute2.name, null, value);
}, parseFromString = (document2, isHTML, markupLanguage) => {
  let { active, registry: registry2 } = document2[CUSTOM_ELEMENTS], node2 = document2, ownerSVGElement = null, parsingCData = !1;
  notParsing = !1;
  let content = new Parser3({
    onprocessinginstruction(name3, data) {
      if (name3.toLowerCase() === "!doctype")
        document2.doctype = data.slice(name3.length).trim();
    },
    onopentag(name3, attributes) {
      let create2 = !0;
      if (isHTML) {
        if (ownerSVGElement)
          node2 = append3(node2, document2.createElementNS(SVG_NAMESPACE, name3), active), node2.ownerSVGElement = ownerSVGElement, create2 = !1;
        else if (name3 === "svg" || name3 === "SVG")
          ownerSVGElement = document2.createElementNS(SVG_NAMESPACE, name3), node2 = append3(node2, ownerSVGElement, active), create2 = !1;
        else if (active) {
          let ce = name3.includes("-") ? name3 : attributes.is || "";
          if (ce && registry2.has(ce)) {
            let { Class: Class2 } = registry2.get(ce);
            node2 = append3(node2, new Class2, active), delete attributes.is, create2 = !1;
          }
        }
      }
      if (create2)
        node2 = append3(node2, document2.createElement(name3), !1);
      let end = node2[END];
      for (let name4 of keys2(attributes))
        attribute(node2, end, document2.createAttribute(name4), attributes[name4], active);
    },
    oncomment(data) {
      append3(node2, document2.createComment(data), active);
    },
    ontext(text2) {
      if (parsingCData)
        append3(node2, document2.createCDATASection(text2), active);
      else
        append3(node2, document2.createTextNode(text2), active);
    },
    oncdatastart() {
      parsingCData = !0;
    },
    oncdataend() {
      parsingCData = !1;
    },
    onclosetag() {
      if (isHTML && node2 === ownerSVGElement)
        ownerSVGElement = null;
      node2 = node2.parentNode;
    }
  }, {
    lowerCaseAttributeNames: !1,
    decodeEntities: !0,
    xmlMode: !isHTML
  });
  return content.write(markupLanguage), content.end(), notParsing = !0, document2;
};

// node_modules/linkedom/esm/shared/register-html-class.js
var htmlClasses, registerHTMLClass = (names, Class2) => {
  for (let name3 of [].concat(names))
    htmlClasses.set(name3, Class2), htmlClasses.set(name3.toUpperCase(), Class2);
};

// node_modules/linkedom/esm/shared/jsdon.js

// node_modules/linkedom/esm/interface/mutation-observer.js

// node_modules/linkedom/esm/shared/attributes.js
var emptyAttributes, setAttribute2 = (element, attribute2) => {
  let { [VALUE]: value, name: name3 } = attribute2;
  if (attribute2.ownerElement = element, knownSiblings(element, attribute2, element[NEXT]), name3 === "class")
    element.className = value;
  attributeChangedCallback2(element, name3, null), attributeChangedCallback(element, name3, null, value);
}, removeAttribute = (element, attribute2) => {
  let { [VALUE]: value, name: name3 } = attribute2;
  if (knownAdjacent(attribute2[PREV], attribute2[NEXT]), attribute2.ownerElement = attribute2[PREV] = attribute2[NEXT] = null, name3 === "class")
    element[CLASS_LIST] = null;
  attributeChangedCallback2(element, name3, value), attributeChangedCallback(element, name3, value, null);
}, booleanAttribute, numericAttribute, stringAttribute;

// node_modules/linkedom/esm/interface/event-target.js

var wm;

// node_modules/linkedom/esm/interface/node-list.js
var NodeList;

// node_modules/linkedom/esm/interface/node.js

// node_modules/linkedom/esm/shared/text-escaper.js
var { replace } = "", ca, esca, pe = (m4) => esca[m4], escape4 = (es) => replace.call(es, ca, pe);

// node_modules/linkedom/esm/interface/attr.js
var QUOTE, Attr;

// node_modules/linkedom/esm/shared/node.js

// node_modules/linkedom/esm/mixin/non-document-type-child-node.js

// node_modules/linkedom/esm/mixin/child-node.js

// node_modules/linkedom/esm/interface/character-data.js
var CharacterData;

// node_modules/linkedom/esm/interface/cdata-section.js
var CDATASection;

// node_modules/linkedom/esm/interface/comment.js
var Comment3;

// node_modules/boolbase/index.js

// node_modules/css-what/lib/es/types.js
var SelectorType, AttributeAction;

// node_modules/css-what/lib/es/parse.js
var reName, reEscape, actionTypes, unpackPseudos, stripQuotesFromPseudos;

// node_modules/css-what/lib/es/index.js

// node_modules/css-select/lib/esm/sort.js
var procedure, attributes;

// node_modules/css-select/lib/esm/attributes.js
var import_boolbase, reChars, caseInsensitiveAttributes, attributeRules;

// node_modules/nth-check/lib/esm/parse.js
var whitespace;

// node_modules/nth-check/lib/esm/compile.js
var import_boolbase2;

// node_modules/nth-check/lib/esm/index.js

// node_modules/css-select/lib/esm/pseudo-selectors/filters.js
var import_boolbase3, filters;

// node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js
var pseudos;

// node_modules/css-select/lib/esm/pseudo-selectors/aliases.js
var aliases;

// node_modules/css-select/lib/esm/pseudo-selectors/subselects.js
var import_boolbase4, PLACEHOLDER_ELEMENT, is = (next, token, options2, context6, compileToken) => {
  let func = compileToken(token, copyOptions(options2), context6);
  return func === import_boolbase4.default.trueFunc ? next : func === import_boolbase4.default.falseFunc ? import_boolbase4.default.falseFunc : (elem) => func(elem) && next(elem);
}, subselects;

// node_modules/css-select/lib/esm/pseudo-selectors/index.js

// node_modules/css-select/lib/esm/general.js

// node_modules/css-select/lib/esm/compile.js
var import_boolbase5, DESCENDANT_TOKEN, FLEXIBLE_DESCENDANT_TOKEN, SCOPE_TOKEN;

// node_modules/css-select/lib/esm/index.js
var import_boolbase6, defaultEquals = (a2, b) => a2 === b, defaultOptions2, compile3, _compileUnsafe, _compileToken, selectAll, selectOne;

// node_modules/linkedom/esm/shared/matches.js
var isArray7, isTag3 = ({ nodeType }) => nodeType === ELEMENT_NODE, existsOne2 = (test2, elements) => elements.some((element) => isTag3(element) && (test2(element) || existsOne2(test2, getChildren2(element)))), getAttributeValue2 = (element, name3) => name3 === "class" ? element.classList.value : element.getAttribute(name3), getChildren2 = ({ childNodes }) => childNodes, getName3 = (element) => {
  let { localName } = element;
  return ignoreCase(element) ? localName.toLowerCase() : localName;
}, getParent2 = ({ parentNode }) => parentNode, getSiblings2 = (element) => {
  let { parentNode } = element;
  return parentNode ? getChildren2(parentNode) : element;
}, getText2 = (node2) => {
  if (isArray7(node2))
    return node2.map(getText2).join("");
  if (isTag3(node2))
    return getText2(getChildren2(node2));
  if (node2.nodeType === TEXT_NODE)
    return node2.data;
  return "";
}, hasAttrib2 = (element, name3) => element.hasAttribute(name3), removeSubsets2 = (nodes) => {
  let { length } = nodes;
  while (length--) {
    let node2 = nodes[length];
    if (length && -1 < nodes.lastIndexOf(node2, length - 1)) {
      nodes.splice(length, 1);
      continue;
    }
    for (let { parentNode } = node2;parentNode; parentNode = parentNode.parentNode)
      if (nodes.includes(parentNode)) {
        nodes.splice(length, 1);
        break;
      }
  }
  return nodes;
}, findAll2 = (test2, nodes) => {
  let matches = [];
  for (let node2 of nodes)
    if (isTag3(node2)) {
      if (test2(node2))
        matches.push(node2);
      matches.push(...findAll2(test2, getChildren2(node2)));
    }
  return matches;
}, findOne2 = (test2, nodes) => {
  for (let node2 of nodes)
    if (test2(node2) || (node2 = findOne2(test2, getChildren2(node2))))
      return node2;
  return null;
}, adapter2, prepareMatch = (element, selectors) => compile3(selectors, {
  context: selectors.includes(":scope") ? element : void 0,
  xmlMode: !ignoreCase(element),
  adapter: adapter2
}), matches = (element, selectors) => is2(element, selectors, {
  strict: !0,
  context: selectors.includes(":scope") ? element : void 0,
  xmlMode: !ignoreCase(element),
  adapter: adapter2
});

// node_modules/linkedom/esm/interface/text.js
var Text5;

// node_modules/linkedom/esm/mixin/parent-node.js

// node_modules/linkedom/esm/mixin/non-element-parent-node.js
var NonElementParentNode;

// node_modules/linkedom/esm/interface/document-fragment.js
var DocumentFragment;

// node_modules/linkedom/esm/interface/document-type.js
var DocumentType;

// node_modules/linkedom/esm/mixin/inner-html.js

// node_modules/uhyphen/esm/index.js
var refs, key2 = (name3) => `data-${esm_default7(name3)}`, prop = (name3) => name3.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase()), handler;

// node_modules/linkedom/esm/dom/token-list.js
var add, addTokens = (self2, tokens) => {
  for (let token of tokens)
    if (token)
      add.call(self2, token);
}, update = ({ [OWNER_ELEMENT]: ownerElement, value }) => {
  let attribute2 = ownerElement.getAttributeNode("class");
  if (attribute2)
    attribute2.value = value;
  else
    setAttribute2(ownerElement, new Attr(ownerElement.ownerDocument, "class", value));
}, DOMTokenList;

// node_modules/linkedom/esm/interface/css-style-declaration.js
var refs2, getKeys = (style) => [...style.keys()].filter((key3) => key3 !== PRIVATE), updateKeys = (style) => {
  let attr = refs2.get(style).getAttributeNode("style");
  if (!attr || attr[CHANGED] || style.get(PRIVATE) !== attr) {
    if (style.clear(), attr) {
      style.set(PRIVATE, attr);
      for (let rule of attr[VALUE].split(/\s*;\s*/)) {
        let [key3, ...rest] = rule.split(":");
        if (rest.length > 0) {
          key3 = key3.trim();
          let value = rest.join(":").trim();
          if (key3 && value)
            style.set(key3, value);
        }
      }
    }
  }
  return attr;
}, handler2, CSSStyleDeclaration, prototype2;

// node_modules/linkedom/esm/interface/event.js


// node_modules/linkedom/esm/interface/named-node-map.js
var NamedNodeMap;

// node_modules/linkedom/esm/interface/shadow-root.js
var ShadowRoot;

// node_modules/linkedom/esm/interface/element.js
var attributesHandler, create2 = (ownerDocument, element, localName) => {
  if ("ownerSVGElement" in element) {
    let svg = ownerDocument.createElementNS(SVG_NAMESPACE, localName);
    return svg.ownerSVGElement = element.ownerSVGElement, svg;
  }
  return ownerDocument.createElement(localName);
}, isVoid = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].voidElements.test(localName);
}, Element2;

// node_modules/linkedom/esm/svg/element.js
var classNames, handler3, SVGElement;

// node_modules/linkedom/esm/shared/facades.js

// node_modules/linkedom/esm/html/element.js
var Level0, level0, HTMLElement;

// node_modules/linkedom/esm/html/template-element.js

// node_modules/linkedom/esm/html/html-element.js
var HTMLHtmlElement;

// node_modules/linkedom/esm/html/text-element.js
var toString5, TextElement;

// node_modules/linkedom/esm/html/script-element.js

// node_modules/linkedom/esm/html/frame-element.js
var HTMLFrameElement;

// node_modules/linkedom/esm/html/i-frame-element.js

// node_modules/linkedom/esm/html/object-element.js
var HTMLObjectElement;

// node_modules/linkedom/esm/html/head-element.js
var HTMLHeadElement;

// node_modules/linkedom/esm/html/body-element.js
var HTMLBodyElement;

// node_modules/cssom/lib/StyleSheet.js

// node_modules/cssom/lib/CSSRule.js

// node_modules/cssom/lib/CSSStyleRule.js

// node_modules/cssom/lib/CSSStyleSheet.js

// node_modules/cssom/lib/MediaList.js

// node_modules/cssom/lib/CSSImportRule.js

// node_modules/cssom/lib/CSSGroupingRule.js

// node_modules/cssom/lib/CSSConditionRule.js

// node_modules/cssom/lib/CSSMediaRule.js

// node_modules/cssom/lib/CSSSupportsRule.js

// node_modules/cssom/lib/CSSFontFaceRule.js

// node_modules/cssom/lib/CSSHostRule.js

// node_modules/cssom/lib/CSSKeyframeRule.js

// node_modules/cssom/lib/CSSKeyframesRule.js

// node_modules/cssom/lib/CSSValue.js

// node_modules/cssom/lib/CSSValueExpression.js

// node_modules/cssom/lib/MatcherList.js

// node_modules/cssom/lib/CSSDocumentRule.js

// node_modules/cssom/lib/parse.js
  exports.parse = CSSOM.parse;
  CSSOM.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
  CSSOM.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
  CSSOM.CSSImportRule = require_CSSImportRule().CSSImportRule;
  CSSOM.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
  CSSOM.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
  CSSOM.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
  CSSOM.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
  CSSOM.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
  CSSOM.CSSHostRule = require_CSSHostRule().CSSHostRule;
  CSSOM.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
  CSSOM.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
  CSSOM.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
  CSSOM.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
  CSSOM.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
});

// node_modules/cssom/lib/CSSStyleDeclaration.js

// node_modules/cssom/lib/clone.js

// node_modules/cssom/lib/index.js
var $CSSStyleDeclaration, $CSSRule, $CSSGroupingRule, $CSSConditionRule, $CSSStyleRule, $MediaList, $CSSMediaRule, $CSSSupportsRule, $CSSImportRule, $CSSFontFaceRule, $CSSHostRule, $StyleSheet, $CSSStyleSheet, $CSSKeyframesRule, $CSSKeyframeRule, $MatcherList, $CSSDocumentRule, $CSSValue, $CSSValueExpression, $parse, $clone;

// node_modules/linkedom/esm/html/style-element.js

// node_modules/linkedom/esm/html/time-element.js
var HTMLTimeElement;

// node_modules/linkedom/esm/html/field-set-element.js
var HTMLFieldSetElement;

// node_modules/linkedom/esm/html/embed-element.js
var HTMLEmbedElement;

// node_modules/linkedom/esm/html/hr-element.js
var HTMLHRElement;

// node_modules/linkedom/esm/html/progress-element.js
var HTMLProgressElement;

// node_modules/linkedom/esm/html/paragraph-element.js
var HTMLParagraphElement;

// node_modules/linkedom/esm/html/table-element.js
var HTMLTableElement;

// node_modules/linkedom/esm/html/frame-set-element.js
var HTMLFrameSetElement;

// node_modules/linkedom/esm/html/li-element.js
var HTMLLIElement;

// node_modules/linkedom/esm/html/base-element.js
var HTMLBaseElement;

// node_modules/linkedom/esm/html/data-list-element.js
var HTMLDataListElement;

// node_modules/linkedom/esm/html/input-element.js

// node_modules/linkedom/esm/html/param-element.js
var HTMLParamElement;

// node_modules/linkedom/esm/html/media-element.js
var HTMLMediaElement;

// node_modules/linkedom/esm/html/audio-element.js
var HTMLAudioElement;

// node_modules/linkedom/esm/html/heading-element.js

// node_modules/linkedom/esm/html/directory-element.js
var HTMLDirectoryElement;

// node_modules/linkedom/esm/html/quote-element.js
var HTMLQuoteElement;

// node_modules/linkedom/commonjs/canvas-shim.cjs

// node_modules/linkedom/commonjs/canvas.cjs

// node_modules/linkedom/esm/html/canvas-element.js
var import_canvas, createCanvas, tagName7 = "canvas", HTMLCanvasElement;

// node_modules/linkedom/esm/html/legend-element.js
var HTMLLegendElement;

// node_modules/linkedom/esm/html/option-element.js

// node_modules/linkedom/esm/html/span-element.js
var HTMLSpanElement;

// node_modules/linkedom/esm/html/meter-element.js
var HTMLMeterElement;

// node_modules/linkedom/esm/html/video-element.js
var HTMLVideoElement;

// node_modules/linkedom/esm/html/table-cell-element.js
var HTMLTableCellElement;

// node_modules/linkedom/esm/html/title-element.js

// node_modules/linkedom/esm/html/output-element.js
var HTMLOutputElement;

// node_modules/linkedom/esm/html/table-row-element.js
var HTMLTableRowElement;

// node_modules/linkedom/esm/html/data-element.js
var HTMLDataElement;

// node_modules/linkedom/esm/html/menu-element.js
var HTMLMenuElement;

// node_modules/linkedom/esm/html/select-element.js

// node_modules/linkedom/esm/html/br-element.js
var HTMLBRElement;

// node_modules/linkedom/esm/html/button-element.js

// node_modules/linkedom/esm/html/map-element.js
var HTMLMapElement;

// node_modules/linkedom/esm/html/opt-group-element.js
var HTMLOptGroupElement;

// node_modules/linkedom/esm/html/d-list-element.js
var HTMLDListElement;

// node_modules/linkedom/esm/html/text-area-element.js

// node_modules/linkedom/esm/html/font-element.js
var HTMLFontElement;

// node_modules/linkedom/esm/html/div-element.js
var HTMLDivElement;

// node_modules/linkedom/esm/html/link-element.js

// node_modules/linkedom/esm/html/slot-element.js

// node_modules/linkedom/esm/html/form-element.js
var HTMLFormElement;

// node_modules/linkedom/esm/html/image-element.js

// node_modules/linkedom/esm/html/pre-element.js
var HTMLPreElement;

// node_modules/linkedom/esm/html/u-list-element.js
var HTMLUListElement;

// node_modules/linkedom/esm/html/meta-element.js

// node_modules/linkedom/esm/html/picture-element.js
var HTMLPictureElement;

// node_modules/linkedom/esm/html/area-element.js
var HTMLAreaElement;

// node_modules/linkedom/esm/html/o-list-element.js
var HTMLOListElement;

// node_modules/linkedom/esm/html/table-caption-element.js
var HTMLTableCaptionElement;

// node_modules/linkedom/esm/html/anchor-element.js

// node_modules/linkedom/esm/html/label-element.js
var HTMLLabelElement;

// node_modules/linkedom/esm/html/unknown-element.js
var HTMLUnknownElement;

// node_modules/linkedom/esm/html/mod-element.js
var HTMLModElement;

// node_modules/linkedom/esm/html/details-element.js
var HTMLDetailsElement;

// node_modules/linkedom/esm/html/source-element.js

// node_modules/linkedom/esm/html/track-element.js
var HTMLTrackElement;

// node_modules/linkedom/esm/html/marquee-element.js
var HTMLMarqueeElement;

// node_modules/linkedom/esm/shared/html-classes.js
var HTMLClasses;

// node_modules/linkedom/esm/shared/mime.js
var voidElements2, Mime;

// node_modules/linkedom/esm/interface/custom-event.js
var CustomEvent;

// node_modules/linkedom/esm/interface/input-event.js
var InputEvent2;

// node_modules/linkedom/esm/interface/image.js

// node_modules/linkedom/esm/interface/range.js

// node_modules/linkedom/esm/interface/tree-walker.js

// node_modules/linkedom/esm/interface/document.js

// node_modules/linkedom/esm/html/document.js

// node_modules/linkedom/esm/svg/document.js
var SVGDocument;

// node_modules/linkedom/esm/xml/document.js
var XMLDocument;

// node_modules/linkedom/esm/dom/parser.js

// node_modules/linkedom/esm/shared/parse-json.js

// node_modules/linkedom/esm/interface/node-filter.js

// node_modules/linkedom/esm/index.js

// node_modules/@mixmark-io/domino/lib/Event.js

// node_modules/@mixmark-io/domino/lib/UIEvent.js

// node_modules/@mixmark-io/domino/lib/MouseEvent.js

// node_modules/@mixmark-io/domino/lib/DOMException.js

// node_modules/@mixmark-io/domino/lib/config.js

// node_modules/@mixmark-io/domino/lib/utils.js

// node_modules/@mixmark-io/domino/lib/EventTarget.js

// node_modules/@mixmark-io/domino/lib/LinkedList.js

// node_modules/@mixmark-io/domino/lib/NodeUtils.js

// node_modules/@mixmark-io/domino/lib/Node.js

// node_modules/@mixmark-io/domino/lib/NodeList.es6.js

// node_modules/@mixmark-io/domino/lib/NodeList.es5.js

// node_modules/@mixmark-io/domino/lib/NodeList.js

// node_modules/@mixmark-io/domino/lib/ContainerNode.js

// node_modules/@mixmark-io/domino/lib/xmlnames.js

// node_modules/@mixmark-io/domino/lib/attributes.js

// node_modules/@mixmark-io/domino/lib/FilteredElementList.js

// node_modules/@mixmark-io/domino/lib/DOMTokenList.js

// node_modules/@mixmark-io/domino/lib/select.js

// node_modules/@mixmark-io/domino/lib/ChildNode.js

// node_modules/@mixmark-io/domino/lib/NonDocumentTypeChildNode.js

// node_modules/@mixmark-io/domino/lib/NamedNodeMap.js

// node_modules/@mixmark-io/domino/lib/Element.js

// node_modules/@mixmark-io/domino/lib/Leaf.js

// node_modules/@mixmark-io/domino/lib/CharacterData.js

// node_modules/@mixmark-io/domino/lib/Text.js

// node_modules/@mixmark-io/domino/lib/Comment.js

// node_modules/@mixmark-io/domino/lib/DocumentFragment.js

// node_modules/@mixmark-io/domino/lib/ProcessingInstruction.js

// node_modules/@mixmark-io/domino/lib/NodeFilter.js

// node_modules/@mixmark-io/domino/lib/NodeTraversal.js

// node_modules/@mixmark-io/domino/lib/TreeWalker.js

// node_modules/@mixmark-io/domino/lib/NodeIterator.js

// node_modules/@mixmark-io/domino/lib/URL.js

// node_modules/@mixmark-io/domino/lib/CustomEvent.js

// node_modules/@mixmark-io/domino/lib/events.js

// node_modules/@mixmark-io/domino/lib/style_parser.js

// node_modules/@mixmark-io/domino/lib/CSSStyleDeclaration.js

// node_modules/@mixmark-io/domino/lib/URLUtils.js

// node_modules/@mixmark-io/domino/lib/defineElement.js

// node_modules/@mixmark-io/domino/lib/htmlelts.js

// node_modules/@mixmark-io/domino/lib/svg.js

// node_modules/@mixmark-io/domino/lib/MutationConstants.js

// node_modules/@mixmark-io/domino/lib/Document.js

// node_modules/@mixmark-io/domino/lib/DocumentType.js

// node_modules/@mixmark-io/domino/lib/HTMLParser.js

// node_modules/@mixmark-io/domino/lib/DOMImplementation.js

// node_modules/@mixmark-io/domino/lib/Location.js

// node_modules/@mixmark-io/domino/lib/NavigatorID.js

// node_modules/@mixmark-io/domino/lib/WindowTimers.js

// node_modules/@mixmark-io/domino/lib/impl.js

// node_modules/@mixmark-io/domino/lib/Window.js

// node_modules/@mixmark-io/domino/lib/index.js

// node_modules/turndown/lib/turndown.es.js
__export(exports_turndown_es, {
  default: () => TurndownService
});
var blockElements, voidElements3, meaningfulWhenBlankElements, markdownEscapes, rules, root2, HTMLParser, _htmlParser, reduce;

