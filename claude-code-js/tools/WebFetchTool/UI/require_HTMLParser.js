// var: require_HTMLParser
var require_HTMLParser = __commonJS((exports, module) => {
  module.exports = HTMLParser;
  var Document5 = require_Document2(), DocumentType3 = require_DocumentType(), Node5 = require_Node2(), NAMESPACE = require_utils12().NAMESPACE, html2 = require_htmlelts(), impl = html2.elements, pushAll = Function.prototype.apply.bind(Array.prototype.push), EOF = -1, TEXT = 1, TAG = 2, ENDTAG = 3, COMMENT = 4, DOCTYPE2 = 5, NOATTRS = [], quirkyPublicIds = /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i, quirkySystemId = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd", conditionallyQuirkyPublicIds = /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i, limitedQuirkyPublicIds = /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i, specialSet = Object.create(null);
  specialSet[NAMESPACE.HTML] = {
    __proto__: null,
    address: !0,
    applet: !0,
    area: !0,
    article: !0,
    aside: !0,
    base: !0,
    basefont: !0,
    bgsound: !0,
    blockquote: !0,
    body: !0,
    br: !0,
    button: !0,
    caption: !0,
    center: !0,
    col: !0,
    colgroup: !0,
    dd: !0,
    details: !0,
    dir: !0,
    div: !0,
    dl: !0,
    dt: !0,
    embed: !0,
    fieldset: !0,
    figcaption: !0,
    figure: !0,
    footer: !0,
    form: !0,
    frame: !0,
    frameset: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    head: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    html: !0,
    iframe: !0,
    img: !0,
    input: !0,
    li: !0,
    link: !0,
    listing: !0,
    main: !0,
    marquee: !0,
    menu: !0,
    meta: !0,
    nav: !0,
    noembed: !0,
    noframes: !0,
    noscript: !0,
    object: !0,
    ol: !0,
    p: !0,
    param: !0,
    plaintext: !0,
    pre: !0,
    script: !0,
    section: !0,
    select: !0,
    source: !0,
    style: !0,
    summary: !0,
    table: !0,
    tbody: !0,
    td: !0,
    template: !0,
    textarea: !0,
    tfoot: !0,
    th: !0,
    thead: !0,
    title: !0,
    tr: !0,
    track: !0,
    ul: !0,
    wbr: !0,
    xmp: !0
  };
  specialSet[NAMESPACE.SVG] = {
    __proto__: null,
    foreignObject: !0,
    desc: !0,
    title: !0
  };
  specialSet[NAMESPACE.MATHML] = {
    __proto__: null,
    mi: !0,
    mo: !0,
    mn: !0,
    ms: !0,
    mtext: !0,
    "annotation-xml": !0
  };
  var addressdivpSet = Object.create(null);
  addressdivpSet[NAMESPACE.HTML] = {
    __proto__: null,
    address: !0,
    div: !0,
    p: !0
  };
  var dddtSet = Object.create(null);
  dddtSet[NAMESPACE.HTML] = {
    __proto__: null,
    dd: !0,
    dt: !0
  };
  var tablesectionrowSet = Object.create(null);
  tablesectionrowSet[NAMESPACE.HTML] = {
    __proto__: null,
    table: !0,
    thead: !0,
    tbody: !0,
    tfoot: !0,
    tr: !0
  };
  var impliedEndTagsSet = Object.create(null);
  impliedEndTagsSet[NAMESPACE.HTML] = {
    __proto__: null,
    dd: !0,
    dt: !0,
    li: !0,
    menuitem: !0,
    optgroup: !0,
    option: !0,
    p: !0,
    rb: !0,
    rp: !0,
    rt: !0,
    rtc: !0
  };
  var thoroughImpliedEndTagsSet = Object.create(null);
  thoroughImpliedEndTagsSet[NAMESPACE.HTML] = {
    __proto__: null,
    caption: !0,
    colgroup: !0,
    dd: !0,
    dt: !0,
    li: !0,
    optgroup: !0,
    option: !0,
    p: !0,
    rb: !0,
    rp: !0,
    rt: !0,
    rtc: !0,
    tbody: !0,
    td: !0,
    tfoot: !0,
    th: !0,
    thead: !0,
    tr: !0
  };
  var tableContextSet = Object.create(null);
  tableContextSet[NAMESPACE.HTML] = {
    __proto__: null,
    table: !0,
    template: !0,
    html: !0
  };
  var tableBodyContextSet = Object.create(null);
  tableBodyContextSet[NAMESPACE.HTML] = {
    __proto__: null,
    tbody: !0,
    tfoot: !0,
    thead: !0,
    template: !0,
    html: !0
  };
  var tableRowContextSet = Object.create(null);
  tableRowContextSet[NAMESPACE.HTML] = {
    __proto__: null,
    tr: !0,
    template: !0,
    html: !0
  };
  var formassociatedSet = Object.create(null);
  formassociatedSet[NAMESPACE.HTML] = {
    __proto__: null,
    button: !0,
    fieldset: !0,
    input: !0,
    keygen: !0,
    object: !0,
    output: !0,
    select: !0,
    textarea: !0,
    img: !0
  };
  var inScopeSet = Object.create(null);
  inScopeSet[NAMESPACE.HTML] = {
    __proto__: null,
    applet: !0,
    caption: !0,
    html: !0,
    table: !0,
    td: !0,
    th: !0,
    marquee: !0,
    object: !0,
    template: !0
  };
  inScopeSet[NAMESPACE.MATHML] = {
    __proto__: null,
    mi: !0,
    mo: !0,
    mn: !0,
    ms: !0,
    mtext: !0,
    "annotation-xml": !0
  };
  inScopeSet[NAMESPACE.SVG] = {
    __proto__: null,
    foreignObject: !0,
    desc: !0,
    title: !0
  };
  var inListItemScopeSet = Object.create(inScopeSet);
  inListItemScopeSet[NAMESPACE.HTML] = Object.create(inScopeSet[NAMESPACE.HTML]);
  inListItemScopeSet[NAMESPACE.HTML].ol = !0;
  inListItemScopeSet[NAMESPACE.HTML].ul = !0;
  var inButtonScopeSet = Object.create(inScopeSet);
  inButtonScopeSet[NAMESPACE.HTML] = Object.create(inScopeSet[NAMESPACE.HTML]);
  inButtonScopeSet[NAMESPACE.HTML].button = !0;
  var inTableScopeSet = Object.create(null);
  inTableScopeSet[NAMESPACE.HTML] = {
    __proto__: null,
    html: !0,
    table: !0,
    template: !0
  };
  var invertedSelectScopeSet = Object.create(null);
  invertedSelectScopeSet[NAMESPACE.HTML] = {
    __proto__: null,
    optgroup: !0,
    option: !0
  };
  var mathmlTextIntegrationPointSet = Object.create(null);
  mathmlTextIntegrationPointSet[NAMESPACE.MATHML] = {
    __proto__: null,
    mi: !0,
    mo: !0,
    mn: !0,
    ms: !0,
    mtext: !0
  };
  var htmlIntegrationPointSet = Object.create(null);
  htmlIntegrationPointSet[NAMESPACE.SVG] = {
    __proto__: null,
    foreignObject: !0,
    desc: !0,
    title: !0
  };
  var foreignAttributes = {
    __proto__: null,
    "xlink:actuate": NAMESPACE.XLINK,
    "xlink:arcrole": NAMESPACE.XLINK,
    "xlink:href": NAMESPACE.XLINK,
    "xlink:role": NAMESPACE.XLINK,
    "xlink:show": NAMESPACE.XLINK,
    "xlink:title": NAMESPACE.XLINK,
    "xlink:type": NAMESPACE.XLINK,
    "xml:base": NAMESPACE.XML,
    "xml:lang": NAMESPACE.XML,
    "xml:space": NAMESPACE.XML,
    xmlns: NAMESPACE.XMLNS,
    "xmlns:xlink": NAMESPACE.XMLNS
  }, svgAttrAdjustments = {
    __proto__: null,
    attributename: "attributeName",
    attributetype: "attributeType",
    basefrequency: "baseFrequency",
    baseprofile: "baseProfile",
    calcmode: "calcMode",
    clippathunits: "clipPathUnits",
    diffuseconstant: "diffuseConstant",
    edgemode: "edgeMode",
    filterunits: "filterUnits",
    glyphref: "glyphRef",
    gradienttransform: "gradientTransform",
    gradientunits: "gradientUnits",
    kernelmatrix: "kernelMatrix",
    kernelunitlength: "kernelUnitLength",
    keypoints: "keyPoints",
    keysplines: "keySplines",
    keytimes: "keyTimes",
    lengthadjust: "lengthAdjust",
    limitingconeangle: "limitingConeAngle",
    markerheight: "markerHeight",
    markerunits: "markerUnits",
    markerwidth: "markerWidth",
    maskcontentunits: "maskContentUnits",
    maskunits: "maskUnits",
    numoctaves: "numOctaves",
    pathlength: "pathLength",
    patterncontentunits: "patternContentUnits",
    patterntransform: "patternTransform",
    patternunits: "patternUnits",
    pointsatx: "pointsAtX",
    pointsaty: "pointsAtY",
    pointsatz: "pointsAtZ",
    preservealpha: "preserveAlpha",
    preserveaspectratio: "preserveAspectRatio",
    primitiveunits: "primitiveUnits",
    refx: "refX",
    refy: "refY",
    repeatcount: "repeatCount",
    repeatdur: "repeatDur",
    requiredextensions: "requiredExtensions",
    requiredfeatures: "requiredFeatures",
    specularconstant: "specularConstant",
    specularexponent: "specularExponent",
    spreadmethod: "spreadMethod",
    startoffset: "startOffset",
    stddeviation: "stdDeviation",
    stitchtiles: "stitchTiles",
    surfacescale: "surfaceScale",
    systemlanguage: "systemLanguage",
    tablevalues: "tableValues",
    targetx: "targetX",
    targety: "targetY",
    textlength: "textLength",
    viewbox: "viewBox",
    viewtarget: "viewTarget",
    xchannelselector: "xChannelSelector",
    ychannelselector: "yChannelSelector",
    zoomandpan: "zoomAndPan"
  }, svgTagNameAdjustments = {
    __proto__: null,
    altglyph: "altGlyph",
    altglyphdef: "altGlyphDef",
    altglyphitem: "altGlyphItem",
    animatecolor: "animateColor",
    animatemotion: "animateMotion",
    animatetransform: "animateTransform",
    clippath: "clipPath",
    feblend: "feBlend",
    fecolormatrix: "feColorMatrix",
    fecomponenttransfer: "feComponentTransfer",
    fecomposite: "feComposite",
    feconvolvematrix: "feConvolveMatrix",
    fediffuselighting: "feDiffuseLighting",
    fedisplacementmap: "feDisplacementMap",
    fedistantlight: "feDistantLight",
    feflood: "feFlood",
    fefunca: "feFuncA",
    fefuncb: "feFuncB",
    fefuncg: "feFuncG",
    fefuncr: "feFuncR",
    fegaussianblur: "feGaussianBlur",
    feimage: "feImage",
    femerge: "feMerge",
    femergenode: "feMergeNode",
    femorphology: "feMorphology",
    feoffset: "feOffset",
    fepointlight: "fePointLight",
    fespecularlighting: "feSpecularLighting",
    fespotlight: "feSpotLight",
    fetile: "feTile",
    feturbulence: "feTurbulence",
    foreignobject: "foreignObject",
    glyphref: "glyphRef",
    lineargradient: "linearGradient",
    radialgradient: "radialGradient",
    textpath: "textPath"
  }, numericCharRefReplacements = {
    __proto__: null,
    0: 65533,
    128: 8364,
    130: 8218,
    131: 402,
    132: 8222,
    133: 8230,
    134: 8224,
    135: 8225,
    136: 710,
    137: 8240,
    138: 352,
    139: 8249,
    140: 338,
    142: 381,
    145: 8216,
    146: 8217,
    147: 8220,
    148: 8221,
    149: 8226,
    150: 8211,
    151: 8212,
    152: 732,
    153: 8482,
    154: 353,
    155: 8250,
    156: 339,
    158: 382,
    159: 376
  }, namedCharRefs = {
    __proto__: null,
    AElig: 198,
    "AElig;": 198,
    AMP: 38,
    "AMP;": 38,
    Aacute: 193,
    "Aacute;": 193,
    "Abreve;": 258,
    Acirc: 194,
    "Acirc;": 194,
    "Acy;": 1040,
    "Afr;": [55349, 56580],
    Agrave: 192,
    "Agrave;": 192,
    "Alpha;": 913,
    "Amacr;": 256,
    "And;": 10835,
    "Aogon;": 260,
    "Aopf;": [55349, 56632],
    "ApplyFunction;": 8289,
    Aring: 197,
    "Aring;": 197,
    "Ascr;": [55349, 56476],
    "Assign;": 8788,
    Atilde: 195,
    "Atilde;": 195,
    Auml: 196,
    "Auml;": 196,
    "Backslash;": 8726,
    "Barv;": 10983,
    "Barwed;": 8966,
    "Bcy;": 1041,
    "Because;": 8757,
    "Bernoullis;": 8492,
    "Beta;": 914,
    "Bfr;": [55349, 56581],
    "Bopf;": [55349, 56633],
    "Breve;": 728,
    "Bscr;": 8492,
    "Bumpeq;": 8782,
    "CHcy;": 1063,
    COPY: 169,
    "COPY;": 169,
    "Cacute;": 262,
    "Cap;": 8914,
    "CapitalDifferentialD;": 8517,
    "Cayleys;": 8493,
    "Ccaron;": 268,
    Ccedil: 199,
    "Ccedil;": 199,
    "Ccirc;": 264,
    "Cconint;": 8752,
    "Cdot;": 266,
    "Cedilla;": 184,
    "CenterDot;": 183,
    "Cfr;": 8493,
    "Chi;": 935,
    "CircleDot;": 8857,
    "CircleMinus;": 8854,
    "CirclePlus;": 8853,
    "CircleTimes;": 8855,
    "ClockwiseContourIntegral;": 8754,
    "CloseCurlyDoubleQuote;": 8221,
    "CloseCurlyQuote;": 8217,
    "Colon;": 8759,
    "Colone;": 10868,
    "Congruent;": 8801,
    "Conint;": 8751,
    "ContourIntegral;": 8750,
    "Copf;": 8450,
    "Coproduct;": 8720,
    "CounterClockwiseContourIntegral;": 8755,
    "Cross;": 10799,
    "Cscr;": [55349, 56478],
    "Cup;": 8915,
    "CupCap;": 8781,
    "DD;": 8517,
    "DDotrahd;": 10513,
    "DJcy;": 1026,
    "DScy;": 1029,
    "DZcy;": 1039,
    "Dagger;": 8225,
    "Darr;": 8609,
    "Dashv;": 10980,
    "Dcaron;": 270,
    "Dcy;": 1044,
    "Del;": 8711,
    "Delta;": 916,
    "Dfr;": [55349, 56583],
    "DiacriticalAcute;": 180,
    "DiacriticalDot;": 729,
    "DiacriticalDoubleAcute;": 733,
    "DiacriticalGrave;": 96,
    "DiacriticalTilde;": 732,
    "Diamond;": 8900,
    "DifferentialD;": 8518,
    "Dopf;": [55349, 56635],
    "Dot;": 168,
    "DotDot;": 8412,
    "DotEqual;": 8784,
    "DoubleContourIntegral;": 8751,
    "DoubleDot;": 168,
    "DoubleDownArrow;": 8659,
    "DoubleLeftArrow;": 8656,
    "DoubleLeftRightArrow;": 8660,
    "DoubleLeftTee;": 10980,
    "DoubleLongLeftArrow;": 10232,
    "DoubleLongLeftRightArrow;": 10234,
    "DoubleLongRightArrow;": 10233,
    "DoubleRightArrow;": 8658,
    "DoubleRightTee;": 8872,
    "DoubleUpArrow;": 8657,
    "DoubleUpDownArrow;": 8661,
    "DoubleVerticalBar;": 8741,
    "DownArrow;": 8595,
    "DownArrowBar;": 10515,
    "DownArrowUpArrow;": 8693,
    "DownBreve;": 785,
    "DownLeftRightVector;": 10576,
    "DownLeftTeeVector;": 10590,
    "DownLeftVector;": 8637,
    "DownLeftVectorBar;": 10582,
    "DownRightTeeVector;": 10591,
    "DownRightVector;": 8641,
    "DownRightVectorBar;": 10583,
    "DownTee;": 8868,
    "DownTeeArrow;": 8615,
    "Downarrow;": 8659,
    "Dscr;": [55349, 56479],
    "Dstrok;": 272,
    "ENG;": 330,
    ETH: 208,
    "ETH;": 208,
    Eacute: 201,
    "Eacute;": 201,
    "Ecaron;": 282,
    Ecirc: 202,
    "Ecirc;": 202,
    "Ecy;": 1069,
    "Edot;": 278,
    "Efr;": [55349, 56584],
    Egrave: 200,
    "Egrave;": 200,
    "Element;": 8712,
    "Emacr;": 274,
    "EmptySmallSquare;": 9723,
    "EmptyVerySmallSquare;": 9643,
    "Eogon;": 280,
    "Eopf;": [55349, 56636],
    "Epsilon;": 917,
    "Equal;": 10869,
    "EqualTilde;": 8770,
    "Equilibrium;": 8652,
    "Escr;": 8496,
    "Esim;": 10867,
    "Eta;": 919,
    Euml: 203,
    "Euml;": 203,
    "Exists;": 8707,
    "ExponentialE;": 8519,
    "Fcy;": 1060,
    "Ffr;": [55349, 56585],
    "FilledSmallSquare;": 9724,
    "FilledVerySmallSquare;": 9642,
    "Fopf;": [55349, 56637],
    "ForAll;": 8704,
    "Fouriertrf;": 8497,
    "Fscr;": 8497,
    "GJcy;": 1027,
    GT: 62,
    "GT;": 62,
    "Gamma;": 915,
    "Gammad;": 988,
    "Gbreve;": 286,
    "Gcedil;": 290,
    "Gcirc;": 284,
    "Gcy;": 1043,
    "Gdot;": 288,
    "Gfr;": [55349, 56586],
    "Gg;": 8921,
    "Gopf;": [55349, 56638],
    "GreaterEqual;": 8805,
    "GreaterEqualLess;": 8923,
    "GreaterFullEqual;": 8807,
    "GreaterGreater;": 10914,
    "GreaterLess;": 8823,
    "GreaterSlantEqual;": 10878,
    "GreaterTilde;": 8819,
    "Gscr;": [55349, 56482],
    "Gt;": 8811,
    "HARDcy;": 1066,
    "Hacek;": 711,
    "Hat;": 94,
    "Hcirc;": 292,
    "Hfr;": 8460,
    "HilbertSpace;": 8459,
    "Hopf;": 8461,
    "HorizontalLine;": 9472,
    "Hscr;": 8459,
    "Hstrok;": 294,
    "HumpDownHump;": 8782,
    "HumpEqual;": 8783,
    "IEcy;": 1045,
    "IJlig;": 306,
    "IOcy;": 1025,
    Iacute: 205,
    "Iacute;": 205,
    Icirc: 206,
    "Icirc;": 206,
    "Icy;": 1048,
    "Idot;": 304,
    "Ifr;": 8465,
    Igrave: 204,
    "Igrave;": 204,
    "Im;": 8465,
    "Imacr;": 298,
    "ImaginaryI;": 8520,
    "Implies;": 8658,
    "Int;": 8748,
    "Integral;": 8747,
    "Intersection;": 8898,
    "InvisibleComma;": 8291,
    "InvisibleTimes;": 8290,
    "Iogon;": 302,
    "Iopf;": [55349, 56640],
    "Iota;": 921,
    "Iscr;": 8464,
    "Itilde;": 296,
    "Iukcy;": 1030,
    Iuml: 207,
    "Iuml;": 207,
    "Jcirc;": 308,
    "Jcy;": 1049,
    "Jfr;": [55349, 56589],
    "Jopf;": [55349, 56641],
    "Jscr;": [55349, 56485],
    "Jsercy;": 1032,
    "Jukcy;": 1028,
    "KHcy;": 1061,
    "KJcy;": 1036,
    "Kappa;": 922,
    "Kcedil;": 310,
    "Kcy;": 1050,
    "Kfr;": [55349, 56590],
    "Kopf;": [55349, 56642],
    "Kscr;": [55349, 56486],
    "LJcy;": 1033,
    LT: 60,
    "LT;": 60,
    "Lacute;": 313,
    "Lambda;": 923,
    "Lang;": 10218,
    "Laplacetrf;": 8466,
    "Larr;": 8606,
    "Lcaron;": 317,
    "Lcedil;": 315,
    "Lcy;": 1051,
    "LeftAngleBracket;": 10216,
    "LeftArrow;": 8592,
    "LeftArrowBar;": 8676,
    "LeftArrowRightArrow;": 8646,
    "LeftCeiling;": 8968,
    "LeftDoubleBracket;": 10214,
    "LeftDownTeeVector;": 10593,
    "LeftDownVector;": 8643,
    "LeftDownVectorBar;": 10585,
    "LeftFloor;": 8970,
    "LeftRightArrow;": 8596,
    "LeftRightVector;": 10574,
    "LeftTee;": 8867,
    "LeftTeeArrow;": 8612,
    "LeftTeeVector;": 10586,
    "LeftTriangle;": 8882,
    "LeftTriangleBar;": 10703,
    "LeftTriangleEqual;": 8884,
    "LeftUpDownVector;": 10577,
    "LeftUpTeeVector;": 10592,
    "LeftUpVector;": 8639,
    "LeftUpVectorBar;": 10584,
    "LeftVector;": 8636,
    "LeftVectorBar;": 10578,
    "Leftarrow;": 8656,
    "Leftrightarrow;": 8660,
    "LessEqualGreater;": 8922,
    "LessFullEqual;": 8806,
    "LessGreater;": 8822,
    "LessLess;": 10913,
    "LessSlantEqual;": 10877,
    "LessTilde;": 8818,
    "Lfr;": [55349, 56591],
    "Ll;": 8920,
    "Lleftarrow;": 8666,
    "Lmidot;": 319,
    "LongLeftArrow;": 10229,
    "LongLeftRightArrow;": 10231,
    "LongRightArrow;": 10230,
    "Longleftarrow;": 10232,
    "Longleftrightarrow;": 10234,
    "Longrightarrow;": 10233,
    "Lopf;": [55349, 56643],
    "LowerLeftArrow;": 8601,
    "LowerRightArrow;": 8600,
    "Lscr;": 8466,
    "Lsh;": 8624,
    "Lstrok;": 321,
    "Lt;": 8810,
    "Map;": 10501,
    "Mcy;": 1052,
    "MediumSpace;": 8287,
    "Mellintrf;": 8499,
    "Mfr;": [55349, 56592],
    "MinusPlus;": 8723,
    "Mopf;": [55349, 56644],
    "Mscr;": 8499,
    "Mu;": 924,
    "NJcy;": 1034,
    "Nacute;": 323,
    "Ncaron;": 327,
    "Ncedil;": 325,
    "Ncy;": 1053,
    "NegativeMediumSpace;": 8203,
    "NegativeThickSpace;": 8203,
    "NegativeThinSpace;": 8203,
    "NegativeVeryThinSpace;": 8203,
    "NestedGreaterGreater;": 8811,
    "NestedLessLess;": 8810,
    "NewLine;": 10,
    "Nfr;": [55349, 56593],
    "NoBreak;": 8288,
    "NonBreakingSpace;": 160,
    "Nopf;": 8469,
    "Not;": 10988,
    "NotCongruent;": 8802,
    "NotCupCap;": 8813,
    "NotDoubleVerticalBar;": 8742,
    "NotElement;": 8713,
    "NotEqual;": 8800,
    "NotEqualTilde;": [8770, 824],
    "NotExists;": 8708,
    "NotGreater;": 8815,
    "NotGreaterEqual;": 8817,
    "NotGreaterFullEqual;": [8807, 824],
    "NotGreaterGreater;": [8811, 824],
    "NotGreaterLess;": 8825,
    "NotGreaterSlantEqual;": [10878, 824],
    "NotGreaterTilde;": 8821,
    "NotHumpDownHump;": [8782, 824],
    "NotHumpEqual;": [8783, 824],
    "NotLeftTriangle;": 8938,
    "NotLeftTriangleBar;": [10703, 824],
    "NotLeftTriangleEqual;": 8940,
    "NotLess;": 8814,
    "NotLessEqual;": 8816,
    "NotLessGreater;": 8824,
    "NotLessLess;": [8810, 824],
    "NotLessSlantEqual;": [10877, 824],
    "NotLessTilde;": 8820,
    "NotNestedGreaterGreater;": [10914, 824],
    "NotNestedLessLess;": [10913, 824],
    "NotPrecedes;": 8832,
    "NotPrecedesEqual;": [10927, 824],
    "NotPrecedesSlantEqual;": 8928,
    "NotReverseElement;": 8716,
    "NotRightTriangle;": 8939,
    "NotRightTriangleBar;": [10704, 824],
    "NotRightTriangleEqual;": 8941,
    "NotSquareSubset;": [8847, 824],
    "NotSquareSubsetEqual;": 8930,
    "NotSquareSuperset;": [8848, 824],
    "NotSquareSupersetEqual;": 8931,
    "NotSubset;": [8834, 8402],
    "NotSubsetEqual;": 8840,
    "NotSucceeds;": 8833,
    "NotSucceedsEqual;": [10928, 824],
    "NotSucceedsSlantEqual;": 8929,
    "NotSucceedsTilde;": [8831, 824],
    "NotSuperset;": [8835, 8402],
    "NotSupersetEqual;": 8841,
    "NotTilde;": 8769,
    "NotTildeEqual;": 8772,
    "NotTildeFullEqual;": 8775,
    "NotTildeTilde;": 8777,
    "NotVerticalBar;": 8740,
    "Nscr;": [55349, 56489],
    Ntilde: 209,
    "Ntilde;": 209,
    "Nu;": 925,
    "OElig;": 338,
    Oacute: 211,
    "Oacute;": 211,
    Ocirc: 212,
    "Ocirc;": 212,
    "Ocy;": 1054,
    "Odblac;": 336,
    "Ofr;": [55349, 56594],
    Ograve: 210,
    "Ograve;": 210,
    "Omacr;": 332,
    "Omega;": 937,
    "Omicron;": 927,
    "Oopf;": [55349, 56646],
    "OpenCurlyDoubleQuote;": 8220,
    "OpenCurlyQuote;": 8216,
    "Or;": 10836,
    "Oscr;": [55349, 56490],
    Oslash: 216,
    "Oslash;": 216,
    Otilde: 213,
    "Otilde;": 213,
    "Otimes;": 10807,
    Ouml: 214,
    "Ouml;": 214,
    "OverBar;": 8254,
    "OverBrace;": 9182,
    "OverBracket;": 9140,
    "OverParenthesis;": 9180,
    "PartialD;": 8706,
    "Pcy;": 1055,
    "Pfr;": [55349, 56595],
    "Phi;": 934,
    "Pi;": 928,
    "PlusMinus;": 177,
    "Poincareplane;": 8460,
    "Popf;": 8473,
    "Pr;": 10939,
    "Precedes;": 8826,
    "PrecedesEqual;": 10927,
    "PrecedesSlantEqual;": 8828,
    "PrecedesTilde;": 8830,
    "Prime;": 8243,
    "Product;": 8719,
    "Proportion;": 8759,
    "Proportional;": 8733,
    "Pscr;": [55349, 56491],
    "Psi;": 936,
    QUOT: 34,
    "QUOT;": 34,
    "Qfr;": [55349, 56596],
    "Qopf;": 8474,
    "Qscr;": [55349, 56492],
    "RBarr;": 10512,
    REG: 174,
    "REG;": 174,
    "Racute;": 340,
    "Rang;": 10219,
    "Rarr;": 8608,
    "Rarrtl;": 10518,
    "Rcaron;": 344,
    "Rcedil;": 342,
    "Rcy;": 1056,
    "Re;": 8476,
    "ReverseElement;": 8715,
    "ReverseEquilibrium;": 8651,
    "ReverseUpEquilibrium;": 10607,
    "Rfr;": 8476,
    "Rho;": 929,
    "RightAngleBracket;": 10217,
    "RightArrow;": 8594,
    "RightArrowBar;": 8677,
    "RightArrowLeftArrow;": 8644,
    "RightCeiling;": 8969,
    "RightDoubleBracket;": 10215,
    "RightDownTeeVector;": 10589,
    "RightDownVector;": 8642,
    "RightDownVectorBar;": 10581,
    "RightFloor;": 8971,
    "RightTee;": 8866,
    "RightTeeArrow;": 8614,
    "RightTeeVector;": 10587,
    "RightTriangle;": 8883,
    "RightTriangleBar;": 10704,
    "RightTriangleEqual;": 8885,
    "RightUpDownVector;": 10575,
    "RightUpTeeVector;": 10588,
    "RightUpVector;": 8638,
    "RightUpVectorBar;": 10580,
    "RightVector;": 8640,
    "RightVectorBar;": 10579,
    "Rightarrow;": 8658,
    "Ropf;": 8477,
    "RoundImplies;": 10608,
    "Rrightarrow;": 8667,
    "Rscr;": 8475,
    "Rsh;": 8625,
    "RuleDelayed;": 10740,
    "SHCHcy;": 1065,
    "SHcy;": 1064,
    "SOFTcy;": 1068,
    "Sacute;": 346,
    "Sc;": 10940,
    "Scaron;": 352,
    "Scedil;": 350,
    "Scirc;": 348,
    "Scy;": 1057,
    "Sfr;": [55349, 56598],
    "ShortDownArrow;": 8595,
    "ShortLeftArrow;": 8592,
    "ShortRightArrow;": 8594,
    "ShortUpArrow;": 8593,
    "Sigma;": 931,
    "SmallCircle;": 8728,
    "Sopf;": [55349, 56650],
    "Sqrt;": 8730,
    "Square;": 9633,
    "SquareIntersection;": 8851,
    "SquareSubset;": 8847,
    "SquareSubsetEqual;": 8849,
    "SquareSuperset;": 8848,
    "SquareSupersetEqual;": 8850,
    "SquareUnion;": 8852,
    "Sscr;": [55349, 56494],
    "Star;": 8902,
    "Sub;": 8912,
    "Subset;": 8912,
    "SubsetEqual;": 8838,
    "Succeeds;": 8827,
    "SucceedsEqual;": 10928,
    "SucceedsSlantEqual;": 8829,
    "SucceedsTilde;": 8831,
    "SuchThat;": 8715,
    "Sum;": 8721,
    "Sup;": 8913,
    "Superset;": 8835,
    "SupersetEqual;": 8839,
    "Supset;": 8913,
    THORN: 222,
    "THORN;": 222,
    "TRADE;": 8482,
    "TSHcy;": 1035,
    "TScy;": 1062,
    "Tab;": 9,
    "Tau;": 932,
    "Tcaron;": 356,
    "Tcedil;": 354,
    "Tcy;": 1058,
    "Tfr;": [55349, 56599],
    "Therefore;": 8756,
    "Theta;": 920,
    "ThickSpace;": [8287, 8202],
    "ThinSpace;": 8201,
    "Tilde;": 8764,
    "TildeEqual;": 8771,
    "TildeFullEqual;": 8773,
    "TildeTilde;": 8776,
    "Topf;": [55349, 56651],
    "TripleDot;": 8411,
    "Tscr;": [55349, 56495],
    "Tstrok;": 358,
    Uacute: 218,
    "Uacute;": 218,
    "Uarr;": 8607,
    "Uarrocir;": 10569,
    "Ubrcy;": 1038,
    "Ubreve;": 364,
    Ucirc: 219,
    "Ucirc;": 219,
    "Ucy;": 1059,
    "Udblac;": 368,
    "Ufr;": [55349, 56600],
    Ugrave: 217,
    "Ugrave;": 217,
    "Umacr;": 362,
    "UnderBar;": 95,
    "UnderBrace;": 9183,
    "UnderBracket;": 9141,
    "UnderParenthesis;": 9181,
    "Union;": 8899,
    "UnionPlus;": 8846,
    "Uogon;": 370,
    "Uopf;": [55349, 56652],
    "UpArrow;": 8593,
    "UpArrowBar;": 10514,
    "UpArrowDownArrow;": 8645,
    "UpDownArrow;": 8597,
    "UpEquilibrium;": 10606,
    "UpTee;": 8869,
    "UpTeeArrow;": 8613,
    "Uparrow;": 8657,
    "Updownarrow;": 8661,
    "UpperLeftArrow;": 8598,
    "UpperRightArrow;": 8599,
    "Upsi;": 978,
    "Upsilon;": 933,
    "Uring;": 366,
    "Uscr;": [55349, 56496],
    "Utilde;": 360,
    Uuml: 220,
    "Uuml;": 220,
    "VDash;": 8875,
    "Vbar;": 10987,
    "Vcy;": 1042,
    "Vdash;": 8873,
    "Vdashl;": 10982,
    "Vee;": 8897,
    "Verbar;": 8214,
    "Vert;": 8214,
    "VerticalBar;": 8739,
    "VerticalLine;": 124,
    "VerticalSeparator;": 10072,
    "VerticalTilde;": 8768,
    "VeryThinSpace;": 8202,
    "Vfr;": [55349, 56601],
    "Vopf;": [55349, 56653],
    "Vscr;": [55349, 56497],
    "Vvdash;": 8874,
    "Wcirc;": 372,
    "Wedge;": 8896,
    "Wfr;": [55349, 56602],
    "Wopf;": [55349, 56654],
    "Wscr;": [55349, 56498],
    "Xfr;": [55349, 56603],
    "Xi;": 926,
    "Xopf;": [55349, 56655],
    "Xscr;": [55349, 56499],
    "YAcy;": 1071,
    "YIcy;": 1031,
    "YUcy;": 1070,
    Yacute: 221,
    "Yacute;": 221,
    "Ycirc;": 374,
    "Ycy;": 1067,
    "Yfr;": [55349, 56604],
    "Yopf;": [55349, 56656],
    "Yscr;": [55349, 56500],
    "Yuml;": 376,
    "ZHcy;": 1046,
    "Zacute;": 377,
    "Zcaron;": 381,
    "Zcy;": 1047,
    "Zdot;": 379,
    "ZeroWidthSpace;": 8203,
    "Zeta;": 918,
    "Zfr;": 8488,
    "Zopf;": 8484,
    "Zscr;": [55349, 56501],
    aacute: 225,
    "aacute;": 225,
    "abreve;": 259,
    "ac;": 8766,
    "acE;": [8766, 819],
    "acd;": 8767,
    acirc: 226,
    "acirc;": 226,
    acute: 180,
    "acute;": 180,
    "acy;": 1072,
    aelig: 230,
    "aelig;": 230,
    "af;": 8289,
    "afr;": [55349, 56606],
    agrave: 224,
    "agrave;": 224,
    "alefsym;": 8501,
    "aleph;": 8501,
    "alpha;": 945,
    "amacr;": 257,
    "amalg;": 10815,
    amp: 38,
    "amp;": 38,
    "and;": 8743,
    "andand;": 10837,
    "andd;": 10844,
    "andslope;": 10840,
    "andv;": 10842,
    "ang;": 8736,
    "ange;": 10660,
    "angle;": 8736,
    "angmsd;": 8737,
    "angmsdaa;": 10664,
    "angmsdab;": 10665,
    "angmsdac;": 10666,
    "angmsdad;": 10667,
    "angmsdae;": 10668,
    "angmsdaf;": 10669,
    "angmsdag;": 10670,
    "angmsdah;": 10671,
    "angrt;": 8735,
    "angrtvb;": 8894,
    "angrtvbd;": 10653,
    "angsph;": 8738,
    "angst;": 197,
    "angzarr;": 9084,
    "aogon;": 261,
    "aopf;": [55349, 56658],
    "ap;": 8776,
    "apE;": 10864,
    "apacir;": 10863,
    "ape;": 8778,
    "apid;": 8779,
    "apos;": 39,
    "approx;": 8776,
    "approxeq;": 8778,
    aring: 229,
    "aring;": 229,
    "ascr;": [55349, 56502],
    "ast;": 42,
    "asymp;": 8776,
    "asympeq;": 8781,
    atilde: 227,
    "atilde;": 227,
    auml: 228,
    "auml;": 228,
    "awconint;": 8755,
    "awint;": 10769,
    "bNot;": 10989,
    "backcong;": 8780,
    "backepsilon;": 1014,
    "backprime;": 8245,
    "backsim;": 8765,
    "backsimeq;": 8909,
    "barvee;": 8893,
    "barwed;": 8965,
    "barwedge;": 8965,
    "bbrk;": 9141,
    "bbrktbrk;": 9142,
    "bcong;": 8780,
    "bcy;": 1073,
    "bdquo;": 8222,
    "becaus;": 8757,
    "because;": 8757,
    "bemptyv;": 10672,
    "bepsi;": 1014,
    "bernou;": 8492,
    "beta;": 946,
    "beth;": 8502,
    "between;": 8812,
    "bfr;": [55349, 56607],
    "bigcap;": 8898,
    "bigcirc;": 9711,
    "bigcup;": 8899,
    "bigodot;": 10752,
    "bigoplus;": 10753,
    "bigotimes;": 10754,
    "bigsqcup;": 10758,
    "bigstar;": 9733,
    "bigtriangledown;": 9661,
    "bigtriangleup;": 9651,
    "biguplus;": 10756,
    "bigvee;": 8897,
    "bigwedge;": 8896,
    "bkarow;": 10509,
    "blacklozenge;": 10731,
    "blacksquare;": 9642,
    "blacktriangle;": 9652,
    "blacktriangledown;": 9662,
    "blacktriangleleft;": 9666,
    "blacktriangleright;": 9656,
    "blank;": 9251,
    "blk12;": 9618,
    "blk14;": 9617,
    "blk34;": 9619,
    "block;": 9608,
    "bne;": [61, 8421],
    "bnequiv;": [8801, 8421],
    "bnot;": 8976,
    "bopf;": [55349, 56659],
    "bot;": 8869,
    "bottom;": 8869,
    "bowtie;": 8904,
    "boxDL;": 9559,
    "boxDR;": 9556,
    "boxDl;": 9558,
    "boxDr;": 9555,
    "boxH;": 9552,
    "boxHD;": 9574,
    "boxHU;": 9577,
    "boxHd;": 9572,
    "boxHu;": 9575,
    "boxUL;": 9565,
    "boxUR;": 9562,
    "boxUl;": 9564,
    "boxUr;": 9561,
    "boxV;": 9553,
    "boxVH;": 9580,
    "boxVL;": 9571,
    "boxVR;": 9568,
    "boxVh;": 9579,
    "boxVl;": 9570,
    "boxVr;": 9567,
    "boxbox;": 10697,
    "boxdL;": 9557,
    "boxdR;": 9554,
    "boxdl;": 9488,
    "boxdr;": 9484,
    "boxh;": 9472,
    "boxhD;": 9573,
    "boxhU;": 9576,
    "boxhd;": 9516,
    "boxhu;": 9524,
    "boxminus;": 8863,
    "boxplus;": 8862,
    "boxtimes;": 8864,
    "boxuL;": 9563,
    "boxuR;": 9560,
    "boxul;": 9496,
    "boxur;": 9492,
    "boxv;": 9474,
    "boxvH;": 9578,
    "boxvL;": 9569,
    "boxvR;": 9566,
    "boxvh;": 9532,
    "boxvl;": 9508,
    "boxvr;": 9500,
    "bprime;": 8245,
    "breve;": 728,
    brvbar: 166,
    "brvbar;": 166,
    "bscr;": [55349, 56503],
    "bsemi;": 8271,
    "bsim;": 8765,
    "bsime;": 8909,
    "bsol;": 92,
    "bsolb;": 10693,
    "bsolhsub;": 10184,
    "bull;": 8226,
    "bullet;": 8226,
    "bump;": 8782,
    "bumpE;": 10926,
    "bumpe;": 8783,
    "bumpeq;": 8783,
    "cacute;": 263,
    "cap;": 8745,
    "capand;": 10820,
    "capbrcup;": 10825,
    "capcap;": 10827,
    "capcup;": 10823,
    "capdot;": 10816,
    "caps;": [8745, 65024],
    "caret;": 8257,
    "caron;": 711,
    "ccaps;": 10829,
    "ccaron;": 269,
    ccedil: 231,
    "ccedil;": 231,
    "ccirc;": 265,
    "ccups;": 10828,
    "ccupssm;": 10832,
    "cdot;": 267,
    cedil: 184,
    "cedil;": 184,
    "cemptyv;": 10674,
    cent: 162,
    "cent;": 162,
    "centerdot;": 183,
    "cfr;": [55349, 56608],
    "chcy;": 1095,
    "check;": 10003,
    "checkmark;": 10003,
    "chi;": 967,
    "cir;": 9675,
    "cirE;": 10691,
    "circ;": 710,
    "circeq;": 8791,
    "circlearrowleft;": 8634,
    "circlearrowright;": 8635,
    "circledR;": 174,
    "circledS;": 9416,
    "circledast;": 8859,
    "circledcirc;": 8858,
    "circleddash;": 8861,
    "cire;": 8791,
    "cirfnint;": 10768,
    "cirmid;": 10991,
    "cirscir;": 10690,
    "clubs;": 9827,
    "clubsuit;": 9827,
    "colon;": 58,
    "colone;": 8788,
    "coloneq;": 8788,
    "comma;": 44,
    "commat;": 64,
    "comp;": 8705,
    "compfn;": 8728,
    "complement;": 8705,
    "complexes;": 8450,
    "cong;": 8773,
    "congdot;": 10861,
    "conint;": 8750,
    "copf;": [55349, 56660],
    "coprod;": 8720,
    copy: 169,
    "copy;": 169,
    "copysr;": 8471,
    "crarr;": 8629,
    "cross;": 10007,
    "cscr;": [55349, 56504],
    "csub;": 10959,
    "csube;": 10961,
    "csup;": 10960,
    "csupe;": 10962,
    "ctdot;": 8943,
    "cudarrl;": 10552,
    "cudarrr;": 10549,
    "cuepr;": 8926,
    "cuesc;": 8927,
    "cularr;": 8630,
    "cularrp;": 10557,
    "cup;": 8746,
    "cupbrcap;": 10824,
    "cupcap;": 10822,
    "cupcup;": 10826,
    "cupdot;": 8845,
    "cupor;": 10821,
    "cups;": [8746, 65024],
    "curarr;": 8631,
    "curarrm;": 10556,
    "curlyeqprec;": 8926,
    "curlyeqsucc;": 8927,
    "curlyvee;": 8910,
    "curlywedge;": 8911,
    curren: 164,
    "curren;": 164,
    "curvearrowleft;": 8630,
    "curvearrowright;": 8631,
    "cuvee;": 8910,
    "cuwed;": 8911,
    "cwconint;": 8754,
    "cwint;": 8753,
    "cylcty;": 9005,
    "dArr;": 8659,
    "dHar;": 10597,
    "dagger;": 8224,
    "daleth;": 8504,
    "darr;": 8595,
    "dash;": 8208,
    "dashv;": 8867,
    "dbkarow;": 10511,
    "dblac;": 733,
    "dcaron;": 271,
    "dcy;": 1076,
    "dd;": 8518,
    "ddagger;": 8225,
    "ddarr;": 8650,
    "ddotseq;": 10871,
    deg: 176,
    "deg;": 176,
    "delta;": 948,
    "demptyv;": 10673,
    "dfisht;": 10623,
    "dfr;": [55349, 56609],
    "dharl;": 8643,
    "dharr;": 8642,
    "diam;": 8900,
    "diamond;": 8900,
    "diamondsuit;": 9830,
    "diams;": 9830,
    "die;": 168,
    "digamma;": 989,
    "disin;": 8946,
    "div;": 247,
    divide: 247,
    "divide;": 247,
    "divideontimes;": 8903,
    "divonx;": 8903,
    "djcy;": 1106,
    "dlcorn;": 8990,
    "dlcrop;": 8973,
    "dollar;": 36,
    "dopf;": [55349, 56661],
    "dot;": 729,
    "doteq;": 8784,
    "doteqdot;": 8785,
    "dotminus;": 8760,
    "dotplus;": 8724,
    "dotsquare;": 8865,
    "doublebarwedge;": 8966,
    "downarrow;": 8595,
    "downdownarrows;": 8650,
    "downharpoonleft;": 8643,
    "downharpoonright;": 8642,
    "drbkarow;": 10512,
    "drcorn;": 8991,
    "drcrop;": 8972,
    "dscr;": [55349, 56505],
    "dscy;": 1109,
    "dsol;": 10742,
    "dstrok;": 273,
    "dtdot;": 8945,
    "dtri;": 9663,
    "dtrif;": 9662,
    "duarr;": 8693,
    "duhar;": 10607,
    "dwangle;": 10662,
    "dzcy;": 1119,
    "dzigrarr;": 10239,
    "eDDot;": 10871,
    "eDot;": 8785,
    eacute: 233,
    "eacute;": 233,
    "easter;": 10862,
    "ecaron;": 283,
    "ecir;": 8790,
    ecirc: 234,
    "ecirc;": 234,
    "ecolon;": 8789,
    "ecy;": 1101,
    "edot;": 279,
    "ee;": 8519,
    "efDot;": 8786,
    "efr;": [55349, 56610],
    "eg;": 10906,
    egrave: 232,
    "egrave;": 232,
    "egs;": 10902,
    "egsdot;": 10904,
    "el;": 10905,
    "elinters;": 9191,
    "ell;": 8467,
    "els;": 10901,
    "elsdot;": 10903,
    "emacr;": 275,
    "empty;": 8709,
    "emptyset;": 8709,
    "emptyv;": 8709,
    "emsp13;": 8196,
    "emsp14;": 8197,
    "emsp;": 8195,
    "eng;": 331,
    "ensp;": 8194,
    "eogon;": 281,
    "eopf;": [55349, 56662],
    "epar;": 8917,
    "eparsl;": 10723,
    "eplus;": 10865,
    "epsi;": 949,
    "epsilon;": 949,
    "epsiv;": 1013,
    "eqcirc;": 8790,
    "eqcolon;": 8789,
    "eqsim;": 8770,
    "eqslantgtr;": 10902,
    "eqslantless;": 10901,
    "equals;": 61,
    "equest;": 8799,
    "equiv;": 8801,
    "equivDD;": 10872,
    "eqvparsl;": 10725,
    "erDot;": 8787,
    "erarr;": 10609,
    "escr;": 8495,
    "esdot;": 8784,
    "esim;": 8770,
    "eta;": 951,
    eth: 240,
    "eth;": 240,
    euml: 235,
    "euml;": 235,
    "euro;": 8364,
    "excl;": 33,
    "exist;": 8707,
    "expectation;": 8496,
    "exponentiale;": 8519,
    "fallingdotseq;": 8786,
    "fcy;": 1092,
    "female;": 9792,
    "ffilig;": 64259,
    "fflig;": 64256,
    "ffllig;": 64260,
    "ffr;": [55349, 56611],
    "filig;": 64257,
    "fjlig;": [102, 106],
    "flat;": 9837,
    "fllig;": 64258,
    "fltns;": 9649,
    "fnof;": 402,
    "fopf;": [55349, 56663],
    "forall;": 8704,
    "fork;": 8916,
    "forkv;": 10969,
    "fpartint;": 10765,
    frac12: 189,
    "frac12;": 189,
    "frac13;": 8531,
    frac14: 188,
    "frac14;": 188,
    "frac15;": 8533,
    "frac16;": 8537,
    "frac18;": 8539,
    "frac23;": 8532,
    "frac25;": 8534,
    frac34: 190,
    "frac34;": 190,
    "frac35;": 8535,
    "frac38;": 8540,
    "frac45;": 8536,
    "frac56;": 8538,
    "frac58;": 8541,
    "frac78;": 8542,
    "frasl;": 8260,
    "frown;": 8994,
    "fscr;": [55349, 56507],
    "gE;": 8807,
    "gEl;": 10892,
    "gacute;": 501,
    "gamma;": 947,
    "gammad;": 989,
    "gap;": 10886,
    "gbreve;": 287,
    "gcirc;": 285,
    "gcy;": 1075,
    "gdot;": 289,
    "ge;": 8805,
    "gel;": 8923,
    "geq;": 8805,
    "geqq;": 8807,
    "geqslant;": 10878,
    "ges;": 10878,
    "gescc;": 10921,
    "gesdot;": 10880,
    "gesdoto;": 10882,
    "gesdotol;": 10884,
    "gesl;": [8923, 65024],
    "gesles;": 10900,
    "gfr;": [55349, 56612],
    "gg;": 8811,
    "ggg;": 8921,
    "gimel;": 8503,
    "gjcy;": 1107,
    "gl;": 8823,
    "glE;": 10898,
    "gla;": 10917,
    "glj;": 10916,
    "gnE;": 8809,
    "gnap;": 10890,
    "gnapprox;": 10890,
    "gne;": 10888,
    "gneq;": 10888,
    "gneqq;": 8809,
    "gnsim;": 8935,
    "gopf;": [55349, 56664],
    "grave;": 96,
    "gscr;": 8458,
    "gsim;": 8819,
    "gsime;": 10894,
    "gsiml;": 10896,
    gt: 62,
    "gt;": 62,
    "gtcc;": 10919,
    "gtcir;": 10874,
    "gtdot;": 8919,
    "gtlPar;": 10645,
    "gtquest;": 10876,
    "gtrapprox;": 10886,
    "gtrarr;": 10616,
    "gtrdot;": 8919,
    "gtreqless;": 8923,
    "gtreqqless;": 10892,
    "gtrless;": 8823,
    "gtrsim;": 8819,
    "gvertneqq;": [8809, 65024],
    "gvnE;": [8809, 65024],
    "hArr;": 8660,
    "hairsp;": 8202,
    "half;": 189,
    "hamilt;": 8459,
    "hardcy;": 1098,
    "harr;": 8596,
    "harrcir;": 10568,
    "harrw;": 8621,
    "hbar;": 8463,
    "hcirc;": 293,
    "hearts;": 9829,
    "heartsuit;": 9829,
    "hellip;": 8230,
    "hercon;": 8889,
    "hfr;": [55349, 56613],
    "hksearow;": 10533,
    "hkswarow;": 10534,
    "hoarr;": 8703,
    "homtht;": 8763,
    "hookleftarrow;": 8617,
    "hookrightarrow;": 8618,
    "hopf;": [55349, 56665],
    "horbar;": 8213,
    "hscr;": [55349, 56509],
    "hslash;": 8463,
    "hstrok;": 295,
    "hybull;": 8259,
    "hyphen;": 8208,
    iacute: 237,
    "iacute;": 237,
    "ic;": 8291,
    icirc: 238,
    "icirc;": 238,
    "icy;": 1080,
    "iecy;": 1077,
    iexcl: 161,
    "iexcl;": 161,
    "iff;": 8660,
    "ifr;": [55349, 56614],
    igrave: 236,
    "igrave;": 236,
    "ii;": 8520,
    "iiiint;": 10764,
    "iiint;": 8749,
    "iinfin;": 10716,
    "iiota;": 8489,
    "ijlig;": 307,
    "imacr;": 299,
    "image;": 8465,
    "imagline;": 8464,
    "imagpart;": 8465,
    "imath;": 305,
    "imof;": 8887,
    "imped;": 437,
    "in;": 8712,
    "incare;": 8453,
    "infin;": 8734,
    "infintie;": 10717,
    "inodot;": 305,
    "int;": 8747,
    "intcal;": 8890,
    "integers;": 8484,
    "intercal;": 8890,
    "intlarhk;": 10775,
    "intprod;": 10812,
    "iocy;": 1105,
    "iogon;": 303,
    "iopf;": [55349, 56666],
    "iota;": 953,
    "iprod;": 10812,
    iquest: 191,
    "iquest;": 191,
    "iscr;": [55349, 56510],
    "isin;": 8712,
    "isinE;": 8953,
    "isindot;": 8949,
    "isins;": 8948,
    "isinsv;": 8947,
    "isinv;": 8712,
    "it;": 8290,
    "itilde;": 297,
    "iukcy;": 1110,
    iuml: 239,
    "iuml;": 239,
    "jcirc;": 309,
    "jcy;": 1081,
    "jfr;": [55349, 56615],
    "jmath;": 567,
    "jopf;": [55349, 56667],
    "jscr;": [55349, 56511],
    "jsercy;": 1112,
    "jukcy;": 1108,
    "kappa;": 954,
    "kappav;": 1008,
    "kcedil;": 311,
    "kcy;": 1082,
    "kfr;": [55349, 56616],
    "kgreen;": 312,
    "khcy;": 1093,
    "kjcy;": 1116,
    "kopf;": [55349, 56668],
    "kscr;": [55349, 56512],
    "lAarr;": 8666,
    "lArr;": 8656,
    "lAtail;": 10523,
    "lBarr;": 10510,
    "lE;": 8806,
    "lEg;": 10891,
    "lHar;": 10594,
    "lacute;": 314,
    "laemptyv;": 10676,
    "lagran;": 8466,
    "lambda;": 955,
    "lang;": 10216,
    "langd;": 10641,
    "langle;": 10216,
    "lap;": 10885,
    laquo: 171,
    "laquo;": 171,
    "larr;": 8592,
    "larrb;": 8676,
    "larrbfs;": 10527,
    "larrfs;": 10525,
    "larrhk;": 8617,
    "larrlp;": 8619,
    "larrpl;": 10553,
    "larrsim;": 10611,
    "larrtl;": 8610,
    "lat;": 10923,
    "latail;": 10521,
    "late;": 10925,
    "lates;": [10925, 65024],
    "lbarr;": 10508,
    "lbbrk;": 10098,
    "lbrace;": 123,
    "lbrack;": 91,
    "lbrke;": 10635,
    "lbrksld;": 10639,
    "lbrkslu;": 10637,
    "lcaron;": 318,
    "lcedil;": 316,
    "lceil;": 8968,
    "lcub;": 123,
    "lcy;": 1083,
    "ldca;": 10550,
    "ldquo;": 8220,
    "ldquor;": 8222,
    "ldrdhar;": 10599,
    "ldrushar;": 10571,
    "ldsh;": 8626,
    "le;": 8804,
    "leftarrow;": 8592,
    "leftarrowtail;": 8610,
    "leftharpoondown;": 8637,
    "leftharpoonup;": 8636,
    "leftleftarrows;": 8647,
    "leftrightarrow;": 8596,
    "leftrightarrows;": 8646,
    "leftrightharpoons;": 8651,
    "leftrightsquigarrow;": 8621,
    "leftthreetimes;": 8907,
    "leg;": 8922,
    "leq;": 8804,
    "leqq;": 8806,
    "leqslant;": 10877,
    "les;": 10877,
    "lescc;": 10920,
    "lesdot;": 10879,
    "lesdoto;": 10881,
    "lesdotor;": 10883,
    "lesg;": [8922, 65024],
    "lesges;": 10899,
    "lessapprox;": 10885,
    "lessdot;": 8918,
    "lesseqgtr;": 8922,
    "lesseqqgtr;": 10891,
    "lessgtr;": 8822,
    "lesssim;": 8818,
    "lfisht;": 10620,
    "lfloor;": 8970,
    "lfr;": [55349, 56617],
    "lg;": 8822,
    "lgE;": 10897,
    "lhard;": 8637,
    "lharu;": 8636,
    "lharul;": 10602,
    "lhblk;": 9604,
    "ljcy;": 1113,
    "ll;": 8810,
    "llarr;": 8647,
    "llcorner;": 8990,
    "llhard;": 10603,
    "lltri;": 9722,
    "lmidot;": 320,
    "lmoust;": 9136,
    "lmoustache;": 9136,
    "lnE;": 8808,
    "lnap;": 10889,
    "lnapprox;": 10889,
    "lne;": 10887,
    "lneq;": 10887,
    "lneqq;": 8808,
    "lnsim;": 8934,
    "loang;": 10220,
    "loarr;": 8701,
    "lobrk;": 10214,
    "longleftarrow;": 10229,
    "longleftrightarrow;": 10231,
    "longmapsto;": 10236,
    "longrightarrow;": 10230,
    "looparrowleft;": 8619,
    "looparrowright;": 8620,
    "lopar;": 10629,
    "lopf;": [55349, 56669],
    "loplus;": 10797,
    "lotimes;": 10804,
    "lowast;": 8727,
    "lowbar;": 95,
    "loz;": 9674,
    "lozenge;": 9674,
    "lozf;": 10731,
    "lpar;": 40,
    "lparlt;": 10643,
    "lrarr;": 8646,
    "lrcorner;": 8991,
    "lrhar;": 8651,
    "lrhard;": 10605,
    "lrm;": 8206,
    "lrtri;": 8895,
    "lsaquo;": 8249,
    "lscr;": [55349, 56513],
    "lsh;": 8624,
    "lsim;": 8818,
    "lsime;": 10893,
    "lsimg;": 10895,
    "lsqb;": 91,
    "lsquo;": 8216,
    "lsquor;": 8218,
    "lstrok;": 322,
    lt: 60,
    "lt;": 60,
    "ltcc;": 10918,
    "ltcir;": 10873,
    "ltdot;": 8918,
    "lthree;": 8907,
    "ltimes;": 8905,
    "ltlarr;": 10614,
    "ltquest;": 10875,
    "ltrPar;": 10646,
    "ltri;": 9667,
    "ltrie;": 8884,
    "ltrif;": 9666,
    "lurdshar;": 10570,
    "luruhar;": 10598,
    "lvertneqq;": [8808, 65024],
    "lvnE;": [8808, 65024],
    "mDDot;": 8762,
    macr: 175,
    "macr;": 175,
    "male;": 9794,
    "malt;": 10016,
    "maltese;": 10016,
    "map;": 8614,
    "mapsto;": 8614,
    "mapstodown;": 8615,
    "mapstoleft;": 8612,
    "mapstoup;": 8613,
    "marker;": 9646,
    "mcomma;": 10793,
    "mcy;": 1084,
    "mdash;": 8212,
    "measuredangle;": 8737,
    "mfr;": [55349, 56618],
    "mho;": 8487,
    micro: 181,
    "micro;": 181,
    "mid;": 8739,
    "midast;": 42,
    "midcir;": 10992,
    middot: 183,
    "middot;": 183,
    "minus;": 8722,
    "minusb;": 8863,
    "minusd;": 8760,
    "minusdu;": 10794,
    "mlcp;": 10971,
    "mldr;": 8230,
    "mnplus;": 8723,
    "models;": 8871,
    "mopf;": [55349, 56670],
    "mp;": 8723,
    "mscr;": [55349, 56514],
    "mstpos;": 8766,
    "mu;": 956,
    "multimap;": 8888,
    "mumap;": 8888,
    "nGg;": [8921, 824],
    "nGt;": [8811, 8402],
    "nGtv;": [8811, 824],
    "nLeftarrow;": 8653,
    "nLeftrightarrow;": 8654,
    "nLl;": [8920, 824],
    "nLt;": [8810, 8402],
    "nLtv;": [8810, 824],
    "nRightarrow;": 8655,
    "nVDash;": 8879,
    "nVdash;": 8878,
    "nabla;": 8711,
    "nacute;": 324,
    "nang;": [8736, 8402],
    "nap;": 8777,
    "napE;": [10864, 824],
    "napid;": [8779, 824],
    "napos;": 329,
    "napprox;": 8777,
    "natur;": 9838,
    "natural;": 9838,
    "naturals;": 8469,
    nbsp: 160,
    "nbsp;": 160,
    "nbump;": [8782, 824],
    "nbumpe;": [8783, 824],
    "ncap;": 10819,
    "ncaron;": 328,
    "ncedil;": 326,
    "ncong;": 8775,
    "ncongdot;": [10861, 824],
    "ncup;": 10818,
    "ncy;": 1085,
    "ndash;": 8211,
    "ne;": 8800,
    "neArr;": 8663,
    "nearhk;": 10532,
    "nearr;": 8599,
    "nearrow;": 8599,
    "nedot;": [8784, 824],
    "nequiv;": 8802,
    "nesear;": 10536,
    "nesim;": [8770, 824],
    "nexist;": 8708,
    "nexists;": 8708,
    "nfr;": [55349, 56619],
    "ngE;": [8807, 824],
    "nge;": 8817,
    "ngeq;": 8817,
    "ngeqq;": [8807, 824],
    "ngeqslant;": [10878, 824],
    "nges;": [10878, 824],
    "ngsim;": 8821,
    "ngt;": 8815,
    "ngtr;": 8815,
    "nhArr;": 8654,
    "nharr;": 8622,
    "nhpar;": 10994,
    "ni;": 8715,
    "nis;": 8956,
    "nisd;": 8954,
    "niv;": 8715,
    "njcy;": 1114,
    "nlArr;": 8653,
    "nlE;": [8806, 824],
    "nlarr;": 8602,
    "nldr;": 8229,
    "nle;": 8816,
    "nleftarrow;": 8602,
    "nleftrightarrow;": 8622,
    "nleq;": 8816,
    "nleqq;": [8806, 824],
    "nleqslant;": [10877, 824],
    "nles;": [10877, 824],
    "nless;": 8814,
    "nlsim;": 8820,
    "nlt;": 8814,
    "nltri;": 8938,
    "nltrie;": 8940,
    "nmid;": 8740,
    "nopf;": [55349, 56671],
    not: 172,
    "not;": 172,
    "notin;": 8713,
    "notinE;": [8953, 824],
    "notindot;": [8949, 824],
    "notinva;": 8713,
    "notinvb;": 8951,
    "notinvc;": 8950,
    "notni;": 8716,
    "notniva;": 8716,
    "notnivb;": 8958,
    "notnivc;": 8957,
    "npar;": 8742,
    "nparallel;": 8742,
    "nparsl;": [11005, 8421],
    "npart;": [8706, 824],
    "npolint;": 10772,
    "npr;": 8832,
    "nprcue;": 8928,
    "npre;": [10927, 824],
    "nprec;": 8832,
    "npreceq;": [10927, 824],
    "nrArr;": 8655,
    "nrarr;": 8603,
    "nrarrc;": [10547, 824],
    "nrarrw;": [8605, 824],
    "nrightarrow;": 8603,
    "nrtri;": 8939,
    "nrtrie;": 8941,
    "nsc;": 8833,
    "nsccue;": 8929,
    "nsce;": [10928, 824],
    "nscr;": [55349, 56515],
    "nshortmid;": 8740,
    "nshortparallel;": 8742,
    "nsim;": 8769,
    "nsime;": 8772,
    "nsimeq;": 8772,
    "nsmid;": 8740,
    "nspar;": 8742,
    "nsqsube;": 8930,
    "nsqsupe;": 8931,
    "nsub;": 8836,
    "nsubE;": [10949, 824],
    "nsube;": 8840,
    "nsubset;": [8834, 8402],
    "nsubseteq;": 8840,
    "nsubseteqq;": [10949, 824],
    "nsucc;": 8833,
    "nsucceq;": [10928, 824],
    "nsup;": 8837,
    "nsupE;": [10950, 824],
    "nsupe;": 8841,
    "nsupset;": [8835, 8402],
    "nsupseteq;": 8841,
    "nsupseteqq;": [10950, 824],
    "ntgl;": 8825,
    ntilde: 241,
    "ntilde;": 241,
    "ntlg;": 8824,
    "ntriangleleft;": 8938,
    "ntrianglelefteq;": 8940,
    "ntriangleright;": 8939,
    "ntrianglerighteq;": 8941,
    "nu;": 957,
    "num;": 35,
    "numero;": 8470,
    "numsp;": 8199,
    "nvDash;": 8877,
    "nvHarr;": 10500,
    "nvap;": [8781, 8402],
    "nvdash;": 8876,
    "nvge;": [8805, 8402],
    "nvgt;": [62, 8402],
    "nvinfin;": 10718,
    "nvlArr;": 10498,
    "nvle;": [8804, 8402],
    "nvlt;": [60, 8402],
    "nvltrie;": [8884, 8402],
    "nvrArr;": 10499,
    "nvrtrie;": [8885, 8402],
    "nvsim;": [8764, 8402],
    "nwArr;": 8662,
    "nwarhk;": 10531,
    "nwarr;": 8598,
    "nwarrow;": 8598,
    "nwnear;": 10535,
    "oS;": 9416,
    oacute: 243,
    "oacute;": 243,
    "oast;": 8859,
    "ocir;": 8858,
    ocirc: 244,
    "ocirc;": 244,
    "ocy;": 1086,
    "odash;": 8861,
    "odblac;": 337,
    "odiv;": 10808,
    "odot;": 8857,
    "odsold;": 10684,
    "oelig;": 339,
    "ofcir;": 10687,
    "ofr;": [55349, 56620],
    "ogon;": 731,
    ograve: 242,
    "ograve;": 242,
    "ogt;": 10689,
    "ohbar;": 10677,
    "ohm;": 937,
    "oint;": 8750,
    "olarr;": 8634,
    "olcir;": 10686,
    "olcross;": 10683,
    "oline;": 8254,
    "olt;": 10688,
    "omacr;": 333,
    "omega;": 969,
    "omicron;": 959,
    "omid;": 10678,
    "ominus;": 8854,
    "oopf;": [55349, 56672],
    "opar;": 10679,
    "operp;": 10681,
    "oplus;": 8853,
    "or;": 8744,
    "orarr;": 8635,
    "ord;": 10845,
    "order;": 8500,
    "orderof;": 8500,
    ordf: 170,
    "ordf;": 170,
    ordm: 186,
    "ordm;": 186,
    "origof;": 8886,
    "oror;": 10838,
    "orslope;": 10839,
    "orv;": 10843,
    "oscr;": 8500,
    oslash: 248,
    "oslash;": 248,
    "osol;": 8856,
    otilde: 245,
    "otilde;": 245,
    "otimes;": 8855,
    "otimesas;": 10806,
    ouml: 246,
    "ouml;": 246,
    "ovbar;": 9021,
    "par;": 8741,
    para: 182,
    "para;": 182,
    "parallel;": 8741,
    "parsim;": 10995,
    "parsl;": 11005,
    "part;": 8706,
    "pcy;": 1087,
    "percnt;": 37,
    "period;": 46,
    "permil;": 8240,
    "perp;": 8869,
    "pertenk;": 8241,
    "pfr;": [55349, 56621],
    "phi;": 966,
    "phiv;": 981,
    "phmmat;": 8499,
    "phone;": 9742,
    "pi;": 960,
    "pitchfork;": 8916,
    "piv;": 982,
    "planck;": 8463,
    "planckh;": 8462,
    "plankv;": 8463,
    "plus;": 43,
    "plusacir;": 10787,
    "plusb;": 8862,
    "pluscir;": 10786,
    "plusdo;": 8724,
    "plusdu;": 10789,
    "pluse;": 10866,
    plusmn: 177,
    "plusmn;": 177,
    "plussim;": 10790,
    "plustwo;": 10791,
    "pm;": 177,
    "pointint;": 10773,
    "popf;": [55349, 56673],
    pound: 163,
    "pound;": 163,
    "pr;": 8826,
    "prE;": 10931,
    "prap;": 10935,
    "prcue;": 8828,
    "pre;": 10927,
    "prec;": 8826,
    "precapprox;": 10935,
    "preccurlyeq;": 8828,
    "preceq;": 10927,
    "precnapprox;": 10937,
    "precneqq;": 10933,
    "precnsim;": 8936,
    "precsim;": 8830,
    "prime;": 8242,
    "primes;": 8473,
    "prnE;": 10933,
    "prnap;": 10937,
    "prnsim;": 8936,
    "prod;": 8719,
    "profalar;": 9006,
    "profline;": 8978,
    "profsurf;": 8979,
    "prop;": 8733,
    "propto;": 8733,
    "prsim;": 8830,
    "prurel;": 8880,
    "pscr;": [55349, 56517],
    "psi;": 968,
    "puncsp;": 8200,
    "qfr;": [55349, 56622],
    "qint;": 10764,
    "qopf;": [55349, 56674],
    "qprime;": 8279,
    "qscr;": [55349, 56518],
    "quaternions;": 8461,
    "quatint;": 10774,
    "quest;": 63,
    "questeq;": 8799,
    quot: 34,
    "quot;": 34,
    "rAarr;": 8667,
    "rArr;": 8658,
    "rAtail;": 10524,
    "rBarr;": 10511,
    "rHar;": 10596,
    "race;": [8765, 817],
    "racute;": 341,
    "radic;": 8730,
    "raemptyv;": 10675,
    "rang;": 10217,
    "rangd;": 10642,
    "range;": 10661,
    "rangle;": 10217,
    raquo: 187,
    "raquo;": 187,
    "rarr;": 8594,
    "rarrap;": 10613,
    "rarrb;": 8677,
    "rarrbfs;": 10528,
    "rarrc;": 10547,
    "rarrfs;": 10526,
    "rarrhk;": 8618,
    "rarrlp;": 8620,
    "rarrpl;": 10565,
    "rarrsim;": 10612,
    "rarrtl;": 8611,
    "rarrw;": 8605,
    "ratail;": 10522,
    "ratio;": 8758,
    "rationals;": 8474,
    "rbarr;": 10509,
    "rbbrk;": 10099,
    "rbrace;": 125,
    "rbrack;": 93,
    "rbrke;": 10636,
    "rbrksld;": 10638,
    "rbrkslu;": 10640,
    "rcaron;": 345,
    "rcedil;": 343,
    "rceil;": 8969,
    "rcub;": 125,
    "rcy;": 1088,
    "rdca;": 10551,
    "rdldhar;": 10601,
    "rdquo;": 8221,
    "rdquor;": 8221,
    "rdsh;": 8627,
    "real;": 8476,
    "realine;": 8475,
    "realpart;": 8476,
    "reals;": 8477,
    "rect;": 9645,
    reg: 174,
    "reg;": 174,
    "rfisht;": 10621,
    "rfloor;": 8971,
    "rfr;": [55349, 56623],
    "rhard;": 8641,
    "rharu;": 8640,
    "rharul;": 10604,
    "rho;": 961,
    "rhov;": 1009,
    "rightarrow;": 8594,
    "rightarrowtail;": 8611,
    "rightharpoondown;": 8641,
    "rightharpoonup;": 8640,
    "rightleftarrows;": 8644,
    "rightleftharpoons;": 8652,
    "rightrightarrows;": 8649,
    "rightsquigarrow;": 8605,
    "rightthreetimes;": 8908,
    "ring;": 730,
    "risingdotseq;": 8787,
    "rlarr;": 8644,
    "rlhar;": 8652,
    "rlm;": 8207,
    "rmoust;": 9137,
    "rmoustache;": 9137,
    "rnmid;": 10990,
    "roang;": 10221,
    "roarr;": 8702,
    "robrk;": 10215,
    "ropar;": 10630,
    "ropf;": [55349, 56675],
    "roplus;": 10798,
    "rotimes;": 10805,
    "rpar;": 41,
    "rpargt;": 10644,
    "rppolint;": 10770,
    "rrarr;": 8649,
    "rsaquo;": 8250,
    "rscr;": [55349, 56519],
    "rsh;": 8625,
    "rsqb;": 93,
    "rsquo;": 8217,
    "rsquor;": 8217,
    "rthree;": 8908,
    "rtimes;": 8906,
    "rtri;": 9657,
    "rtrie;": 8885,
    "rtrif;": 9656,
    "rtriltri;": 10702,
    "ruluhar;": 10600,
    "rx;": 8478,
    "sacute;": 347,
    "sbquo;": 8218,
    "sc;": 8827,
    "scE;": 10932,
    "scap;": 10936,
    "scaron;": 353,
    "sccue;": 8829,
    "sce;": 10928,
    "scedil;": 351,
    "scirc;": 349,
    "scnE;": 10934,
    "scnap;": 10938,
    "scnsim;": 8937,
    "scpolint;": 10771,
    "scsim;": 8831,
    "scy;": 1089,
    "sdot;": 8901,
    "sdotb;": 8865,
    "sdote;": 10854,
    "seArr;": 8664,
    "searhk;": 10533,
    "searr;": 8600,
    "searrow;": 8600,
    sect: 167,
    "sect;": 167,
    "semi;": 59,
    "seswar;": 10537,
    "setminus;": 8726,
    "setmn;": 8726,
    "sext;": 10038,
    "sfr;": [55349, 56624],
    "sfrown;": 8994,
    "sharp;": 9839,
    "shchcy;": 1097,
    "shcy;": 1096,
    "shortmid;": 8739,
    "shortparallel;": 8741,
    shy: 173,
    "shy;": 173,
    "sigma;": 963,
    "sigmaf;": 962,
    "sigmav;": 962,
    "sim;": 8764,
    "simdot;": 10858,
    "sime;": 8771,
    "simeq;": 8771,
    "simg;": 10910,
    "simgE;": 10912,
    "siml;": 10909,
    "simlE;": 10911,
    "simne;": 8774,
    "simplus;": 10788,
    "simrarr;": 10610,
    "slarr;": 8592,
    "smallsetminus;": 8726,
    "smashp;": 10803,
    "smeparsl;": 10724,
    "smid;": 8739,
    "smile;": 8995,
    "smt;": 10922,
    "smte;": 10924,
    "smtes;": [10924, 65024],
    "softcy;": 1100,
    "sol;": 47,
    "solb;": 10692,
    "solbar;": 9023,
    "sopf;": [55349, 56676],
    "spades;": 9824,
    "spadesuit;": 9824,
    "spar;": 8741,
    "sqcap;": 8851,
    "sqcaps;": [8851, 65024],
    "sqcup;": 8852,
    "sqcups;": [8852, 65024],
    "sqsub;": 8847,
    "sqsube;": 8849,
    "sqsubset;": 8847,
    "sqsubseteq;": 8849,
    "sqsup;": 8848,
    "sqsupe;": 8850,
    "sqsupset;": 8848,
    "sqsupseteq;": 8850,
    "squ;": 9633,
    "square;": 9633,
    "squarf;": 9642,
    "squf;": 9642,
    "srarr;": 8594,
    "sscr;": [55349, 56520],
    "ssetmn;": 8726,
    "ssmile;": 8995,
    "sstarf;": 8902,
    "star;": 9734,
    "starf;": 9733,
    "straightepsilon;": 1013,
    "straightphi;": 981,
    "strns;": 175,
    "sub;": 8834,
    "subE;": 10949,
    "subdot;": 10941,
    "sube;": 8838,
    "subedot;": 10947,
    "submult;": 10945,
    "subnE;": 10955,
    "subne;": 8842,
    "subplus;": 10943,
    "subrarr;": 10617,
    "subset;": 8834,
    "subseteq;": 8838,
    "subseteqq;": 10949,
    "subsetneq;": 8842,
    "subsetneqq;": 10955,
    "subsim;": 10951,
    "subsub;": 10965,
    "subsup;": 10963,
    "succ;": 8827,
    "succapprox;": 10936,
    "succcurlyeq;": 8829,
    "succeq;": 10928,
    "succnapprox;": 10938,
    "succneqq;": 10934,
    "succnsim;": 8937,
    "succsim;": 8831,
    "sum;": 8721,
    "sung;": 9834,
    sup1: 185,
    "sup1;": 185,
    sup2: 178,
    "sup2;": 178,
    sup3: 179,
    "sup3;": 179,
    "sup;": 8835,
    "supE;": 10950,
    "supdot;": 10942,
    "supdsub;": 10968,
    "supe;": 8839,
    "supedot;": 10948,
    "suphsol;": 10185,
    "suphsub;": 10967,
    "suplarr;": 10619,
    "supmult;": 10946,
    "supnE;": 10956,
    "supne;": 8843,
    "supplus;": 10944,
    "supset;": 8835,
    "supseteq;": 8839,
    "supseteqq;": 10950,
    "supsetneq;": 8843,
    "supsetneqq;": 10956,
    "supsim;": 10952,
    "supsub;": 10964,
    "supsup;": 10966,
    "swArr;": 8665,
    "swarhk;": 10534,
    "swarr;": 8601,
    "swarrow;": 8601,
    "swnwar;": 10538,
    szlig: 223,
    "szlig;": 223,
    "target;": 8982,
    "tau;": 964,
    "tbrk;": 9140,
    "tcaron;": 357,
    "tcedil;": 355,
    "tcy;": 1090,
    "tdot;": 8411,
    "telrec;": 8981,
    "tfr;": [55349, 56625],
    "there4;": 8756,
    "therefore;": 8756,
    "theta;": 952,
    "thetasym;": 977,
    "thetav;": 977,
    "thickapprox;": 8776,
    "thicksim;": 8764,
    "thinsp;": 8201,
    "thkap;": 8776,
    "thksim;": 8764,
    thorn: 254,
    "thorn;": 254,
    "tilde;": 732,
    times: 215,
    "times;": 215,
    "timesb;": 8864,
    "timesbar;": 10801,
    "timesd;": 10800,
    "tint;": 8749,
    "toea;": 10536,
    "top;": 8868,
    "topbot;": 9014,
    "topcir;": 10993,
    "topf;": [55349, 56677],
    "topfork;": 10970,
    "tosa;": 10537,
    "tprime;": 8244,
    "trade;": 8482,
    "triangle;": 9653,
    "triangledown;": 9663,
    "triangleleft;": 9667,
    "trianglelefteq;": 8884,
    "triangleq;": 8796,
    "triangleright;": 9657,
    "trianglerighteq;": 8885,
    "tridot;": 9708,
    "trie;": 8796,
    "triminus;": 10810,
    "triplus;": 10809,
    "trisb;": 10701,
    "tritime;": 10811,
    "trpezium;": 9186,
    "tscr;": [55349, 56521],
    "tscy;": 1094,
    "tshcy;": 1115,
    "tstrok;": 359,
    "twixt;": 8812,
    "twoheadleftarrow;": 8606,
    "twoheadrightarrow;": 8608,
    "uArr;": 8657,
    "uHar;": 10595,
    uacute: 250,
    "uacute;": 250,
    "uarr;": 8593,
    "ubrcy;": 1118,
    "ubreve;": 365,
    ucirc: 251,
    "ucirc;": 251,
    "ucy;": 1091,
    "udarr;": 8645,
    "udblac;": 369,
    "udhar;": 10606,
    "ufisht;": 10622,
    "ufr;": [55349, 56626],
    ugrave: 249,
    "ugrave;": 249,
    "uharl;": 8639,
    "uharr;": 8638,
    "uhblk;": 9600,
    "ulcorn;": 8988,
    "ulcorner;": 8988,
    "ulcrop;": 8975,
    "ultri;": 9720,
    "umacr;": 363,
    uml: 168,
    "uml;": 168,
    "uogon;": 371,
    "uopf;": [55349, 56678],
    "uparrow;": 8593,
    "updownarrow;": 8597,
    "upharpoonleft;": 8639,
    "upharpoonright;": 8638,
    "uplus;": 8846,
    "upsi;": 965,
    "upsih;": 978,
    "upsilon;": 965,
    "upuparrows;": 8648,
    "urcorn;": 8989,
    "urcorner;": 8989,
    "urcrop;": 8974,
    "uring;": 367,
    "urtri;": 9721,
    "uscr;": [55349, 56522],
    "utdot;": 8944,
    "utilde;": 361,
    "utri;": 9653,
    "utrif;": 9652,
    "uuarr;": 8648,
    uuml: 252,
    "uuml;": 252,
    "uwangle;": 10663,
    "vArr;": 8661,
    "vBar;": 10984,
    "vBarv;": 10985,
    "vDash;": 8872,
    "vangrt;": 10652,
    "varepsilon;": 1013,
    "varkappa;": 1008,
    "varnothing;": 8709,
    "varphi;": 981,
    "varpi;": 982,
    "varpropto;": 8733,
    "varr;": 8597,
    "varrho;": 1009,
    "varsigma;": 962,
    "varsubsetneq;": [8842, 65024],
    "varsubsetneqq;": [10955, 65024],
    "varsupsetneq;": [8843, 65024],
    "varsupsetneqq;": [10956, 65024],
    "vartheta;": 977,
    "vartriangleleft;": 8882,
    "vartriangleright;": 8883,
    "vcy;": 1074,
    "vdash;": 8866,
    "vee;": 8744,
    "veebar;": 8891,
    "veeeq;": 8794,
    "vellip;": 8942,
    "verbar;": 124,
    "vert;": 124,
    "vfr;": [55349, 56627],
    "vltri;": 8882,
    "vnsub;": [8834, 8402],
    "vnsup;": [8835, 8402],
    "vopf;": [55349, 56679],
    "vprop;": 8733,
    "vrtri;": 8883,
    "vscr;": [55349, 56523],
    "vsubnE;": [10955, 65024],
    "vsubne;": [8842, 65024],
    "vsupnE;": [10956, 65024],
    "vsupne;": [8843, 65024],
    "vzigzag;": 10650,
    "wcirc;": 373,
    "wedbar;": 10847,
    "wedge;": 8743,
    "wedgeq;": 8793,
    "weierp;": 8472,
    "wfr;": [55349, 56628],
    "wopf;": [55349, 56680],
    "wp;": 8472,
    "wr;": 8768,
    "wreath;": 8768,
    "wscr;": [55349, 56524],
    "xcap;": 8898,
    "xcirc;": 9711,
    "xcup;": 8899,
    "xdtri;": 9661,
    "xfr;": [55349, 56629],
    "xhArr;": 10234,
    "xharr;": 10231,
    "xi;": 958,
    "xlArr;": 10232,
    "xlarr;": 10229,
    "xmap;": 10236,
    "xnis;": 8955,
    "xodot;": 10752,
    "xopf;": [55349, 56681],
    "xoplus;": 10753,
    "xotime;": 10754,
    "xrArr;": 10233,
    "xrarr;": 10230,
    "xscr;": [55349, 56525],
    "xsqcup;": 10758,
    "xuplus;": 10756,
    "xutri;": 9651,
    "xvee;": 8897,
    "xwedge;": 8896,
    yacute: 253,
    "yacute;": 253,
    "yacy;": 1103,
    "ycirc;": 375,
    "ycy;": 1099,
    yen: 165,
    "yen;": 165,
    "yfr;": [55349, 56630],
    "yicy;": 1111,
    "yopf;": [55349, 56682],
    "yscr;": [55349, 56526],
    "yucy;": 1102,
    yuml: 255,
    "yuml;": 255,
    "zacute;": 378,
    "zcaron;": 382,
    "zcy;": 1079,
    "zdot;": 380,
    "zeetrf;": 8488,
    "zeta;": 950,
    "zfr;": [55349, 56631],
    "zhcy;": 1078,
    "zigrarr;": 8669,
    "zopf;": [55349, 56683],
    "zscr;": [55349, 56527],
    "zwj;": 8205,
    "zwnj;": 8204
  }, NAMEDCHARREF = /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g, NAMEDCHARREF_MAXLEN = 32, DBLQUOTEATTRVAL = /[^\r"&\u0000]+/g, SINGLEQUOTEATTRVAL = /[^\r'&\u0000]+/g, UNQUOTEDATTRVAL = /[^\r\t\n\f &>\u0000]+/g, TAGNAME = /[^\r\t\n\f \/>A-Z\u0000]+/g, ATTRNAME = /[^\r\t\n\f \/=>A-Z\u0000]+/g, CDATATEXT = /[^\]\r\u0000\uffff]*/g, DATATEXT = /[^&<\r\u0000\uffff]*/g, RAWTEXT = /[^<\r\u0000\uffff]*/g, PLAINTEXT = /[^\r\u0000\uffff]*/g, SIMPLETAG = /(?:(\/)?([a-z]+)>)|[\s\S]/g, SIMPLEATTR = /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g, NONWS = /[^\x09\x0A\x0C\x0D\x20]/, ALLNONWS = /[^\x09\x0A\x0C\x0D\x20]/g, NONWSNONNUL = /[^\x00\x09\x0A\x0C\x0D\x20]/, LEADINGWS = /^[\x09\x0A\x0C\x0D\x20]+/, NULCHARS = /\x00/g;
  function buf2str(buf) {
    var CHUNKSIZE = 16384;
    if (buf.length < CHUNKSIZE)
      return String.fromCharCode.apply(String, buf);
    var result = "";
    for (var i5 = 0;i5 < buf.length; i5 += CHUNKSIZE)
      result += String.fromCharCode.apply(String, buf.slice(i5, i5 + CHUNKSIZE));
    return result;
  }
  function str2buf(s2) {
    var result = [];
    for (var i5 = 0;i5 < s2.length; i5++)
      result[i5] = s2.charCodeAt(i5);
    return result;
  }
  function isA(elt, set3) {
    if (typeof set3 === "string")
      return elt.namespaceURI === NAMESPACE.HTML && elt.localName === set3;
    var tagnames = set3[elt.namespaceURI];
    return tagnames && tagnames[elt.localName];
  }
  function isMathmlTextIntegrationPoint(n5) {
    return isA(n5, mathmlTextIntegrationPointSet);
  }
  function isHTMLIntegrationPoint(n5) {
    if (isA(n5, htmlIntegrationPointSet))
      return !0;
    if (n5.namespaceURI === NAMESPACE.MATHML && n5.localName === "annotation-xml") {
      var encoding = n5.getAttribute("encoding");
      if (encoding)
        encoding = encoding.toLowerCase();
      if (encoding === "text/html" || encoding === "application/xhtml+xml")
        return !0;
    }
    return !1;
  }
  function adjustSVGTagName(name3) {
    if (name3 in svgTagNameAdjustments)
      return svgTagNameAdjustments[name3];
    else
      return name3;
  }
  function adjustSVGAttributes(attrs) {
    for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++)
      if (attrs[i5][0] in svgAttrAdjustments)
        attrs[i5][0] = svgAttrAdjustments[attrs[i5][0]];
  }
  function adjustMathMLAttributes(attrs) {
    for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++)
      if (attrs[i5][0] === "definitionurl") {
        attrs[i5][0] = "definitionURL";
        break;
      }
  }
  function adjustForeignAttributes(attrs) {
    for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++)
      if (attrs[i5][0] in foreignAttributes)
        attrs[i5].push(foreignAttributes[attrs[i5][0]]);
  }
  function transferAttributes(attrs, elt) {
    for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++) {
      var name3 = attrs[i5][0], value = attrs[i5][1];
      if (elt.hasAttribute(name3))
        continue;
      elt._setAttribute(name3, value);
    }
  }
  HTMLParser.ElementStack = function() {
    this.elements = [], this.top = null;
  };
  HTMLParser.ElementStack.prototype.push = function(e) {
    this.elements.push(e), this.top = e;
  };
  HTMLParser.ElementStack.prototype.pop = function(e) {
    this.elements.pop(), this.top = this.elements[this.elements.length - 1];
  };
  HTMLParser.ElementStack.prototype.popTag = function(tag2) {
    for (var i5 = this.elements.length - 1;i5 > 0; i5--) {
      var e = this.elements[i5];
      if (isA(e, tag2))
        break;
    }
    this.elements.length = i5, this.top = this.elements[i5 - 1];
  };
  HTMLParser.ElementStack.prototype.popElementType = function(type) {
    for (var i5 = this.elements.length - 1;i5 > 0; i5--)
      if (this.elements[i5] instanceof type)
        break;
    this.elements.length = i5, this.top = this.elements[i5 - 1];
  };
  HTMLParser.ElementStack.prototype.popElement = function(e) {
    for (var i5 = this.elements.length - 1;i5 > 0; i5--)
      if (this.elements[i5] === e)
        break;
    this.elements.length = i5, this.top = this.elements[i5 - 1];
  };
  HTMLParser.ElementStack.prototype.removeElement = function(e) {
    if (this.top === e)
      this.pop();
    else {
      var idx = this.elements.lastIndexOf(e);
      if (idx !== -1)
        this.elements.splice(idx, 1);
    }
  };
  HTMLParser.ElementStack.prototype.clearToContext = function(set3) {
    for (var i5 = this.elements.length - 1;i5 > 0; i5--)
      if (isA(this.elements[i5], set3))
        break;
    this.elements.length = i5 + 1, this.top = this.elements[i5];
  };
  HTMLParser.ElementStack.prototype.contains = function(tag2) {
    return this.inSpecificScope(tag2, Object.create(null));
  };
  HTMLParser.ElementStack.prototype.inSpecificScope = function(tag2, set3) {
    for (var i5 = this.elements.length - 1;i5 >= 0; i5--) {
      var elt = this.elements[i5];
      if (isA(elt, tag2))
        return !0;
      if (isA(elt, set3))
        return !1;
    }
    return !1;
  };
  HTMLParser.ElementStack.prototype.elementInSpecificScope = function(target, set3) {
    for (var i5 = this.elements.length - 1;i5 >= 0; i5--) {
      var elt = this.elements[i5];
      if (elt === target)
        return !0;
      if (isA(elt, set3))
        return !1;
    }
    return !1;
  };
  HTMLParser.ElementStack.prototype.elementTypeInSpecificScope = function(target, set3) {
    for (var i5 = this.elements.length - 1;i5 >= 0; i5--) {
      var elt = this.elements[i5];
      if (elt instanceof target)
        return !0;
      if (isA(elt, set3))
        return !1;
    }
    return !1;
  };
  HTMLParser.ElementStack.prototype.inScope = function(tag2) {
    return this.inSpecificScope(tag2, inScopeSet);
  };
  HTMLParser.ElementStack.prototype.elementInScope = function(e) {
    return this.elementInSpecificScope(e, inScopeSet);
  };
  HTMLParser.ElementStack.prototype.elementTypeInScope = function(type) {
    return this.elementTypeInSpecificScope(type, inScopeSet);
  };
  HTMLParser.ElementStack.prototype.inButtonScope = function(tag2) {
    return this.inSpecificScope(tag2, inButtonScopeSet);
  };
  HTMLParser.ElementStack.prototype.inListItemScope = function(tag2) {
    return this.inSpecificScope(tag2, inListItemScopeSet);
  };
  HTMLParser.ElementStack.prototype.inTableScope = function(tag2) {
    return this.inSpecificScope(tag2, inTableScopeSet);
  };
  HTMLParser.ElementStack.prototype.inSelectScope = function(tag2) {
    for (var i5 = this.elements.length - 1;i5 >= 0; i5--) {
      var elt = this.elements[i5];
      if (elt.namespaceURI !== NAMESPACE.HTML)
        return !1;
      var localname = elt.localName;
      if (localname === tag2)
        return !0;
      if (localname !== "optgroup" && localname !== "option")
        return !1;
    }
    return !1;
  };
  HTMLParser.ElementStack.prototype.generateImpliedEndTags = function(butnot, thorough) {
    var endTagSet = thorough ? thoroughImpliedEndTagsSet : impliedEndTagsSet;
    for (var i5 = this.elements.length - 1;i5 >= 0; i5--) {
      var e = this.elements[i5];
      if (butnot && isA(e, butnot))
        break;
      if (!isA(this.elements[i5], endTagSet))
        break;
    }
    this.elements.length = i5 + 1, this.top = this.elements[i5];
  };
  HTMLParser.ActiveFormattingElements = function() {
    this.list = [], this.attrs = [];
  };
  HTMLParser.ActiveFormattingElements.prototype.MARKER = { localName: "|" };
  HTMLParser.ActiveFormattingElements.prototype.insertMarker = function() {
    this.list.push(this.MARKER), this.attrs.push(this.MARKER);
  };
  HTMLParser.ActiveFormattingElements.prototype.push = function(elt, attrs) {
    var count3 = 0;
    for (var i5 = this.list.length - 1;i5 >= 0; i5--) {
      if (this.list[i5] === this.MARKER)
        break;
      if (equal(elt, this.list[i5], this.attrs[i5])) {
        if (count3++, count3 === 3) {
          this.list.splice(i5, 1), this.attrs.splice(i5, 1);
          break;
        }
      }
    }
    this.list.push(elt);
    var attrcopy = [];
    for (var ii = 0;ii < attrs.length; ii++)
      attrcopy[ii] = attrs[ii];
    this.attrs.push(attrcopy);
    function equal(newelt, oldelt, oldattrs) {
      if (newelt.localName !== oldelt.localName)
        return !1;
      if (newelt._numattrs !== oldattrs.length)
        return !1;
      for (var i6 = 0, n5 = oldattrs.length;i6 < n5; i6++) {
        var oldname = oldattrs[i6][0], oldval = oldattrs[i6][1];
        if (!newelt.hasAttribute(oldname))
          return !1;
        if (newelt.getAttribute(oldname) !== oldval)
          return !1;
      }
      return !0;
    }
  };
  HTMLParser.ActiveFormattingElements.prototype.clearToMarker = function() {
    for (var i5 = this.list.length - 1;i5 >= 0; i5--)
      if (this.list[i5] === this.MARKER)
        break;
    if (i5 < 0)
      i5 = 0;
    this.list.length = i5, this.attrs.length = i5;
  };
  HTMLParser.ActiveFormattingElements.prototype.findElementByTag = function(tag2) {
    for (var i5 = this.list.length - 1;i5 >= 0; i5--) {
      var elt = this.list[i5];
      if (elt === this.MARKER)
        break;
      if (elt.localName === tag2)
        return elt;
    }
    return null;
  };
  HTMLParser.ActiveFormattingElements.prototype.indexOf = function(e) {
    return this.list.lastIndexOf(e);
  };
  HTMLParser.ActiveFormattingElements.prototype.remove = function(e) {
    var idx = this.list.lastIndexOf(e);
    if (idx !== -1)
      this.list.splice(idx, 1), this.attrs.splice(idx, 1);
  };
  HTMLParser.ActiveFormattingElements.prototype.replace = function(a2, b, attrs) {
    var idx = this.list.lastIndexOf(a2);
    if (idx !== -1)
      this.list[idx] = b, this.attrs[idx] = attrs;
  };
  HTMLParser.ActiveFormattingElements.prototype.insertAfter = function(a2, b) {
    var idx = this.list.lastIndexOf(a2);
    if (idx !== -1)
      this.list.splice(idx, 0, b), this.attrs.splice(idx, 0, b);
  };
  function HTMLParser(address, fragmentContext, options2) {
    var chars = null, numchars = 0, nextchar = 0, input_complete = !1, scanner_skip_newline = !1, reentrant_invocations = 0, saved_scanner_state = [], leftovers = "", first_batch = !0, paused = 0, tokenizer = data_state, return_state, character_reference_code, tagnamebuf = "", lasttagname = "", tempbuf = [], attrnamebuf = "", attrvaluebuf = "", commentbuf = [], doctypenamebuf = [], doctypepublicbuf = [], doctypesystembuf = [], attributes2 = [], is_end_tag = !1, parser2 = initial_mode, originalInsertionMode = null, templateInsertionModes = [], stack = new HTMLParser.ElementStack, afe = new HTMLParser.ActiveFormattingElements, fragment = fragmentContext !== void 0, head_element_pointer = null, form_element_pointer = null, scripting_enabled = !0;
    if (fragmentContext)
      scripting_enabled = fragmentContext.ownerDocument._scripting_enabled;
    if (options2 && options2.scripting_enabled === !1)
      scripting_enabled = !1;
    var frameset_ok = !0, force_quirks = !1, pending_table_text, text_integration_mode, textrun = [], textIncludesNUL = !1, ignore_linefeed = !1, htmlparser = {
      document: function() {
        return doc2;
      },
      _asDocumentFragment: function() {
        var frag = doc2.createDocumentFragment(), root3 = doc2.firstChild;
        while (root3.hasChildNodes())
          frag.appendChild(root3.firstChild);
        return frag;
      },
      pause: function() {
        paused++;
      },
      resume: function() {
        paused--, this.parse("");
      },
      parse: function(s2, end, shouldPauseFunc) {
        var moreToDo;
        if (paused > 0)
          return leftovers += s2, !0;
        if (reentrant_invocations === 0) {
          if (leftovers)
            s2 = leftovers + s2, leftovers = "";
          if (end)
            s2 += "\uFFFF", input_complete = !0;
          if (chars = s2, numchars = s2.length, nextchar = 0, first_batch) {
            if (first_batch = !1, chars.charCodeAt(0) === 65279)
              nextchar = 1;
          }
          reentrant_invocations++, moreToDo = scanChars(shouldPauseFunc), leftovers = chars.substring(nextchar, numchars), reentrant_invocations--;
        } else {
          if (reentrant_invocations++, saved_scanner_state.push(chars, numchars, nextchar), chars = s2, numchars = s2.length, nextchar = 0, scanChars(), moreToDo = !1, leftovers = chars.substring(nextchar, numchars), nextchar = saved_scanner_state.pop(), numchars = saved_scanner_state.pop(), chars = saved_scanner_state.pop(), leftovers)
            chars = leftovers + chars.substring(nextchar), numchars = chars.length, nextchar = 0, leftovers = "";
          reentrant_invocations--;
        }
        return moreToDo;
      }
    }, doc2 = new Document5(!0, address);
    if (doc2._parser = htmlparser, doc2._scripting_enabled = scripting_enabled, fragmentContext) {
      if (fragmentContext.ownerDocument._quirks)
        doc2._quirks = !0;
      if (fragmentContext.ownerDocument._limitedQuirks)
        doc2._limitedQuirks = !0;
      if (fragmentContext.namespaceURI === NAMESPACE.HTML)
        switch (fragmentContext.localName) {
          case "title":
          case "textarea":
            tokenizer = rcdata_state;
            break;
          case "style":
          case "xmp":
          case "iframe":
          case "noembed":
          case "noframes":
          case "script":
          case "plaintext":
            tokenizer = plaintext_state;
            break;
        }
      var root2 = doc2.createElement("html");
      if (doc2._appendChild(root2), stack.push(root2), fragmentContext instanceof impl.HTMLTemplateElement)
        templateInsertionModes.push(in_template_mode);
      resetInsertionMode();
      for (var e = fragmentContext;e !== null; e = e.parentElement)
        if (e instanceof impl.HTMLFormElement) {
          form_element_pointer = e;
          break;
        }
    }
    function scanChars(shouldPauseFunc) {
      var codepoint, s2, pattern, eof;
      while (nextchar < numchars) {
        if (paused > 0 || shouldPauseFunc && shouldPauseFunc())
          return !0;
        switch (typeof tokenizer.lookahead) {
          case "undefined":
            if (codepoint = chars.charCodeAt(nextchar++), scanner_skip_newline) {
              if (scanner_skip_newline = !1, codepoint === 10) {
                nextchar++;
                continue;
              }
            }
            switch (codepoint) {
              case 13:
                if (nextchar < numchars) {
                  if (chars.charCodeAt(nextchar) === 10)
                    nextchar++;
                } else
                  scanner_skip_newline = !0;
                tokenizer(10);
                break;
              case 65535:
                if (input_complete && nextchar === numchars) {
                  tokenizer(EOF);
                  break;
                }
              default:
                tokenizer(codepoint);
                break;
            }
            break;
          case "number":
            codepoint = chars.charCodeAt(nextchar);
            var n5 = tokenizer.lookahead, needsString = !0;
            if (n5 < 0)
              needsString = !1, n5 = -n5;
            if (n5 < numchars - nextchar)
              s2 = needsString ? chars.substring(nextchar, nextchar + n5) : null, eof = !1;
            else if (input_complete) {
              if (s2 = needsString ? chars.substring(nextchar, numchars) : null, eof = !0, codepoint === 65535 && nextchar === numchars - 1)
                codepoint = EOF;
            } else
              return !0;
            tokenizer(codepoint, s2, eof);
            break;
          case "string":
            codepoint = chars.charCodeAt(nextchar), pattern = tokenizer.lookahead;
            var pos = chars.indexOf(pattern, nextchar);
            if (pos !== -1)
              s2 = chars.substring(nextchar, pos + pattern.length), eof = !1;
            else {
              if (!input_complete)
                return !0;
              if (s2 = chars.substring(nextchar, numchars), codepoint === 65535 && nextchar === numchars - 1)
                codepoint = EOF;
              eof = !0;
            }
            tokenizer(codepoint, s2, eof);
            break;
        }
      }
      return !1;
    }
    function addAttribute(name3, value) {
      for (var i5 = 0;i5 < attributes2.length; i5++)
        if (attributes2[i5][0] === name3)
          return;
      if (value !== void 0)
        attributes2.push([name3, value]);
      else
        attributes2.push([name3]);
    }
    function handleSimpleAttribute() {
      SIMPLEATTR.lastIndex = nextchar - 1;
      var matched = SIMPLEATTR.exec(chars);
      if (!matched)
        throw Error("should never happen");
      var name3 = matched[1];
      if (!name3)
        return !1;
      var value = matched[2], len = value.length;
      switch (value[0]) {
        case '"':
        case "'":
          value = value.substring(1, len - 1), nextchar += matched[0].length - 1, tokenizer = after_attribute_value_quoted_state;
          break;
        default:
          tokenizer = before_attribute_name_state, nextchar += matched[0].length - 1, value = value.substring(0, len - 1);
          break;
      }
      for (var i5 = 0;i5 < attributes2.length; i5++)
        if (attributes2[i5][0] === name3)
          return !0;
      return attributes2.push([name3, value]), !0;
    }
    function beginTagName() {
      is_end_tag = !1, tagnamebuf = "", attributes2.length = 0;
    }
    function beginEndTagName() {
      is_end_tag = !0, tagnamebuf = "", attributes2.length = 0;
    }
    function beginTempBuf() {
      tempbuf.length = 0;
    }
    function beginAttrName() {
      attrnamebuf = "";
    }
    function beginAttrValue() {
      attrvaluebuf = "";
    }
    function beginComment() {
      commentbuf.length = 0;
    }
    function beginDoctype() {
      doctypenamebuf.length = 0, doctypepublicbuf = null, doctypesystembuf = null;
    }
    function beginDoctypePublicId() {
      doctypepublicbuf = [];
    }
    function beginDoctypeSystemId() {
      doctypesystembuf = [];
    }
    function forcequirks() {
      force_quirks = !0;
    }
    function cdataAllowed() {
      return stack.top && stack.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
    }
    function appropriateEndTag(buf) {
      return lasttagname === buf;
    }
    function flushText() {
      if (textrun.length > 0) {
        var s2 = buf2str(textrun);
        if (textrun.length = 0, ignore_linefeed) {
          if (ignore_linefeed = !1, s2[0] === `
`)
            s2 = s2.substring(1);
          if (s2.length === 0)
            return;
        }
        insertToken(TEXT, s2), textIncludesNUL = !1;
      }
      ignore_linefeed = !1;
    }
    function getMatchingChars(pattern) {
      pattern.lastIndex = nextchar - 1;
      var match = pattern.exec(chars);
      if (match && match.index === nextchar - 1) {
        if (match = match[0], nextchar += match.length - 1, input_complete && nextchar === numchars)
          match = match.slice(0, -1), nextchar--;
        return match;
      } else
        throw Error("should never happen");
    }
    function emitCharsWhile(pattern) {
      pattern.lastIndex = nextchar - 1;
      var match = pattern.exec(chars)[0];
      if (!match)
        return !1;
      return emitCharString(match), nextchar += match.length - 1, !0;
    }
    function emitCharString(s2) {
      if (textrun.length > 0)
        flushText();
      if (ignore_linefeed) {
        if (ignore_linefeed = !1, s2[0] === `
`)
          s2 = s2.substring(1);
        if (s2.length === 0)
          return;
      }
      insertToken(TEXT, s2);
    }
    function emitTag() {
      if (is_end_tag)
        insertToken(ENDTAG, tagnamebuf);
      else {
        var tagname = tagnamebuf;
        tagnamebuf = "", lasttagname = tagname, insertToken(TAG, tagname, attributes2);
      }
    }
    function emitSimpleTag() {
      if (nextchar === numchars)
        return !1;
      SIMPLETAG.lastIndex = nextchar;
      var matched = SIMPLETAG.exec(chars);
      if (!matched)
        throw Error("should never happen");
      var tagname = matched[2];
      if (!tagname)
        return !1;
      var endtag = matched[1];
      if (endtag)
        nextchar += tagname.length + 2, insertToken(ENDTAG, tagname);
      else
        nextchar += tagname.length + 1, lasttagname = tagname, insertToken(TAG, tagname, NOATTRS);
      return !0;
    }
    function emitSelfClosingTag() {
      if (is_end_tag)
        insertToken(ENDTAG, tagnamebuf, null, !0);
      else
        insertToken(TAG, tagnamebuf, attributes2, !0);
    }
    function emitDoctype() {
      insertToken(DOCTYPE2, buf2str(doctypenamebuf), doctypepublicbuf ? buf2str(doctypepublicbuf) : void 0, doctypesystembuf ? buf2str(doctypesystembuf) : void 0);
    }
    function emitEOF() {
      flushText(), parser2(EOF), doc2.modclock = 1;
    }
    var insertToken = htmlparser.insertToken = function(t2, value, arg3, arg4) {
      flushText();
      var current = stack.top;
      if (!current || current.namespaceURI === NAMESPACE.HTML)
        parser2(t2, value, arg3, arg4);
      else if (t2 !== TAG && t2 !== TEXT)
        insertForeignToken(t2, value, arg3, arg4);
      else if (isMathmlTextIntegrationPoint(current) && (t2 === TEXT || t2 === TAG && value !== "mglyph" && value !== "malignmark") || t2 === TAG && value === "svg" && current.namespaceURI === NAMESPACE.MATHML && current.localName === "annotation-xml" || isHTMLIntegrationPoint(current))
        text_integration_mode = !0, parser2(t2, value, arg3, arg4), text_integration_mode = !1;
      else
        insertForeignToken(t2, value, arg3, arg4);
    };
    function insertComment(data) {
      var parent2 = stack.top;
      if (foster_parent_mode && isA(parent2, tablesectionrowSet))
        fosterParent(function(doc3) {
          return doc3.createComment(data);
        });
      else {
        if (parent2 instanceof impl.HTMLTemplateElement)
          parent2 = parent2.content;
        parent2._appendChild(parent2.ownerDocument.createComment(data));
      }
    }
    function insertText(s2) {
      var parent2 = stack.top;
      if (foster_parent_mode && isA(parent2, tablesectionrowSet))
        fosterParent(function(doc3) {
          return doc3.createTextNode(s2);
        });
      else {
        if (parent2 instanceof impl.HTMLTemplateElement)
          parent2 = parent2.content;
        var lastChild = parent2.lastChild;
        if (lastChild && lastChild.nodeType === Node5.TEXT_NODE)
          lastChild.appendData(s2);
        else
          parent2._appendChild(parent2.ownerDocument.createTextNode(s2));
      }
    }
    function createHTMLElt(doc3, name3, attrs) {
      var elt = html2.createElement(doc3, name3, null);
      if (attrs)
        for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++)
          elt._setAttribute(attrs[i5][0], attrs[i5][1]);
      return elt;
    }
    var foster_parent_mode = !1;
    function insertHTMLElement(name3, attrs) {
      var elt = insertElement(function(doc3) {
        return createHTMLElt(doc3, name3, attrs);
      });
      if (isA(elt, formassociatedSet))
        elt._form = form_element_pointer;
      return elt;
    }
    function insertElement(eltFunc) {
      var elt;
      if (foster_parent_mode && isA(stack.top, tablesectionrowSet))
        elt = fosterParent(eltFunc);
      else if (stack.top instanceof impl.HTMLTemplateElement)
        elt = eltFunc(stack.top.content.ownerDocument), stack.top.content._appendChild(elt);
      else
        elt = eltFunc(stack.top.ownerDocument), stack.top._appendChild(elt);
      return stack.push(elt), elt;
    }
    function insertForeignElement(name3, attrs, ns) {
      return insertElement(function(doc3) {
        var elt = doc3._createElementNS(name3, ns, null);
        if (attrs)
          for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++) {
            var attr = attrs[i5];
            if (attr.length === 2)
              elt._setAttribute(attr[0], attr[1]);
            else
              elt._setAttributeNS(attr[2], attr[0], attr[1]);
          }
        return elt;
      });
    }
    function lastElementOfType(type) {
      for (var i5 = stack.elements.length - 1;i5 >= 0; i5--)
        if (stack.elements[i5] instanceof type)
          return i5;
      return -1;
    }
    function fosterParent(eltFunc) {
      var parent2, before2, lastTable = -1, lastTemplate = -1, elt;
      if (lastTable = lastElementOfType(impl.HTMLTableElement), lastTemplate = lastElementOfType(impl.HTMLTemplateElement), lastTemplate >= 0 && (lastTable < 0 || lastTemplate > lastTable))
        parent2 = stack.elements[lastTemplate];
      else if (lastTable >= 0)
        if (parent2 = stack.elements[lastTable].parentNode, parent2)
          before2 = stack.elements[lastTable];
        else
          parent2 = stack.elements[lastTable - 1];
      if (!parent2)
        parent2 = stack.elements[0];
      if (parent2 instanceof impl.HTMLTemplateElement)
        parent2 = parent2.content;
      if (elt = eltFunc(parent2.ownerDocument), elt.nodeType === Node5.TEXT_NODE) {
        var prev;
        if (before2)
          prev = before2.previousSibling;
        else
          prev = parent2.lastChild;
        if (prev && prev.nodeType === Node5.TEXT_NODE)
          return prev.appendData(elt.data), elt;
      }
      if (before2)
        parent2.insertBefore(elt, before2);
      else
        parent2._appendChild(elt);
      return elt;
    }
    function resetInsertionMode() {
      var last2 = !1;
      for (var i5 = stack.elements.length - 1;i5 >= 0; i5--) {
        var node2 = stack.elements[i5];
        if (i5 === 0) {
          if (last2 = !0, fragment)
            node2 = fragmentContext;
        }
        if (node2.namespaceURI === NAMESPACE.HTML) {
          var tag2 = node2.localName;
          switch (tag2) {
            case "select":
              for (var j4 = i5;j4 > 0; ) {
                var ancestor = stack.elements[--j4];
                if (ancestor instanceof impl.HTMLTemplateElement)
                  break;
                else if (ancestor instanceof impl.HTMLTableElement) {
                  parser2 = in_select_in_table_mode;
                  return;
                }
              }
              parser2 = in_select_mode;
              return;
            case "tr":
              parser2 = in_row_mode;
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              parser2 = in_table_body_mode;
              return;
            case "caption":
              parser2 = in_caption_mode;
              return;
            case "colgroup":
              parser2 = in_column_group_mode;
              return;
            case "table":
              parser2 = in_table_mode;
              return;
            case "template":
              parser2 = templateInsertionModes[templateInsertionModes.length - 1];
              return;
            case "body":
              parser2 = in_body_mode;
              return;
            case "frameset":
              parser2 = in_frameset_mode;
              return;
            case "html":
              if (head_element_pointer === null)
                parser2 = before_head_mode;
              else
                parser2 = after_head_mode;
              return;
            default:
              if (!last2) {
                if (tag2 === "head") {
                  parser2 = in_head_mode;
                  return;
                }
                if (tag2 === "td" || tag2 === "th") {
                  parser2 = in_cell_mode;
                  return;
                }
              }
          }
        }
        if (last2) {
          parser2 = in_body_mode;
          return;
        }
      }
    }
    function parseRawText(name3, attrs) {
      insertHTMLElement(name3, attrs), tokenizer = rawtext_state, originalInsertionMode = parser2, parser2 = text_mode;
    }
    function parseRCDATA(name3, attrs) {
      insertHTMLElement(name3, attrs), tokenizer = rcdata_state, originalInsertionMode = parser2, parser2 = text_mode;
    }
    function afeclone(doc3, i5) {
      return {
        elt: createHTMLElt(doc3, afe.list[i5].localName, afe.attrs[i5]),
        attrs: afe.attrs[i5]
      };
    }
    function afereconstruct() {
      if (afe.list.length === 0)
        return;
      var entry = afe.list[afe.list.length - 1];
      if (entry === afe.MARKER)
        return;
      if (stack.elements.lastIndexOf(entry) !== -1)
        return;
      for (var i5 = afe.list.length - 2;i5 >= 0; i5--) {
        if (entry = afe.list[i5], entry === afe.MARKER)
          break;
        if (stack.elements.lastIndexOf(entry) !== -1)
          break;
      }
      for (i5 = i5 + 1;i5 < afe.list.length; i5++) {
        var newelt = insertElement(function(doc3) {
          return afeclone(doc3, i5).elt;
        });
        afe.list[i5] = newelt;
      }
    }
    var BOOKMARK = { localName: "BM" };
    function adoptionAgency(tag2) {
      if (isA(stack.top, tag2) && afe.indexOf(stack.top) === -1)
        return stack.pop(), !0;
      var outer = 0;
      while (outer < 8) {
        outer++;
        var fmtelt = afe.findElementByTag(tag2);
        if (!fmtelt)
          return !1;
        var index = stack.elements.lastIndexOf(fmtelt);
        if (index === -1)
          return afe.remove(fmtelt), !0;
        if (!stack.elementInScope(fmtelt))
          return !0;
        var furthestblock = null, furthestblockindex;
        for (var i5 = index + 1;i5 < stack.elements.length; i5++)
          if (isA(stack.elements[i5], specialSet)) {
            furthestblock = stack.elements[i5], furthestblockindex = i5;
            break;
          }
        if (!furthestblock)
          return stack.popElement(fmtelt), afe.remove(fmtelt), !0;
        else {
          var ancestor = stack.elements[index - 1];
          afe.insertAfter(fmtelt, BOOKMARK);
          var node2 = furthestblock, lastnode = furthestblock, nodeindex = furthestblockindex, nodeafeindex, inner = 0;
          while (!0) {
            if (inner++, node2 = stack.elements[--nodeindex], node2 === fmtelt)
              break;
            if (nodeafeindex = afe.indexOf(node2), inner > 3 && nodeafeindex !== -1)
              afe.remove(node2), nodeafeindex = -1;
            if (nodeafeindex === -1) {
              stack.removeElement(node2);
              continue;
            }
            var newelt = afeclone(ancestor.ownerDocument, nodeafeindex);
            if (afe.replace(node2, newelt.elt, newelt.attrs), stack.elements[nodeindex] = newelt.elt, node2 = newelt.elt, lastnode === furthestblock)
              afe.remove(BOOKMARK), afe.insertAfter(newelt.elt, BOOKMARK);
            node2._appendChild(lastnode), lastnode = node2;
          }
          if (foster_parent_mode && isA(ancestor, tablesectionrowSet))
            fosterParent(function() {
              return lastnode;
            });
          else if (ancestor instanceof impl.HTMLTemplateElement)
            ancestor.content._appendChild(lastnode);
          else
            ancestor._appendChild(lastnode);
          var newelt2 = afeclone(furthestblock.ownerDocument, afe.indexOf(fmtelt));
          while (furthestblock.hasChildNodes())
            newelt2.elt._appendChild(furthestblock.firstChild);
          furthestblock._appendChild(newelt2.elt), afe.remove(fmtelt), afe.replace(BOOKMARK, newelt2.elt, newelt2.attrs), stack.removeElement(fmtelt);
          var pos = stack.elements.lastIndexOf(furthestblock);
          stack.elements.splice(pos + 1, 0, newelt2.elt);
        }
      }
      return !0;
    }
    function handleScriptEnd() {
      stack.pop(), parser2 = originalInsertionMode;
      return;
    }
    function stopParsing() {
      if (delete doc2._parser, stack.elements.length = 0, doc2.defaultView)
        doc2.defaultView.dispatchEvent(new impl.Event("load", {}));
    }
    function reconsume(c3, new_state) {
      tokenizer = new_state, nextchar--;
    }
    function data_state(c3) {
      switch (c3) {
        case 38:
          return_state = data_state, tokenizer = character_reference_state;
          break;
        case 60:
          if (emitSimpleTag())
            break;
          tokenizer = tag_open_state;
          break;
        case 0:
          textrun.push(c3), textIncludesNUL = !0;
          break;
        case -1:
          emitEOF();
          break;
        default:
          emitCharsWhile(DATATEXT) || textrun.push(c3);
          break;
      }
    }
    function rcdata_state(c3) {
      switch (c3) {
        case 38:
          return_state = rcdata_state, tokenizer = character_reference_state;
          break;
        case 60:
          tokenizer = rcdata_less_than_sign_state;
          break;
        case 0:
          textrun.push(65533), textIncludesNUL = !0;
          break;
        case -1:
          emitEOF();
          break;
        default:
          textrun.push(c3);
          break;
      }
    }
    function rawtext_state(c3) {
      switch (c3) {
        case 60:
          tokenizer = rawtext_less_than_sign_state;
          break;
        case 0:
          textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          emitCharsWhile(RAWTEXT) || textrun.push(c3);
          break;
      }
    }
    function script_data_state(c3) {
      switch (c3) {
        case 60:
          tokenizer = script_data_less_than_sign_state;
          break;
        case 0:
          textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          emitCharsWhile(RAWTEXT) || textrun.push(c3);
          break;
      }
    }
    function plaintext_state(c3) {
      switch (c3) {
        case 0:
          textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          emitCharsWhile(PLAINTEXT) || textrun.push(c3);
          break;
      }
    }
    function tag_open_state(c3) {
      switch (c3) {
        case 33:
          tokenizer = markup_declaration_open_state;
          break;
        case 47:
          tokenizer = end_tag_open_state;
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginTagName(), reconsume(c3, tag_name_state);
          break;
        case 63:
          reconsume(c3, bogus_comment_state);
          break;
        default:
          textrun.push(60), reconsume(c3, data_state);
          break;
      }
    }
    function end_tag_open_state(c3) {
      switch (c3) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginEndTagName(), reconsume(c3, tag_name_state);
          break;
        case 62:
          tokenizer = data_state;
          break;
        case -1:
          textrun.push(60), textrun.push(47), emitEOF();
          break;
        default:
          reconsume(c3, bogus_comment_state);
          break;
      }
    }
    function tag_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = before_attribute_name_state;
          break;
        case 47:
          tokenizer = self_closing_start_tag_state;
          break;
        case 62:
          tokenizer = data_state, emitTag();
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tagnamebuf += String.fromCharCode(c3 + 32);
          break;
        case 0:
          tagnamebuf += String.fromCharCode(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          tagnamebuf += getMatchingChars(TAGNAME);
          break;
      }
    }
    function rcdata_less_than_sign_state(c3) {
      if (c3 === 47)
        beginTempBuf(), tokenizer = rcdata_end_tag_open_state;
      else
        textrun.push(60), reconsume(c3, rcdata_state);
    }
    function rcdata_end_tag_open_state(c3) {
      switch (c3) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginEndTagName(), reconsume(c3, rcdata_end_tag_name_state);
          break;
        default:
          textrun.push(60), textrun.push(47), reconsume(c3, rcdata_state);
          break;
      }
    }
    function rcdata_end_tag_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = before_attribute_name_state;
            return;
          }
          break;
        case 47:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = self_closing_start_tag_state;
            return;
          }
          break;
        case 62:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = data_state, emitTag();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tagnamebuf += String.fromCharCode(c3 + 32), tempbuf.push(c3);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          tagnamebuf += String.fromCharCode(c3), tempbuf.push(c3);
          return;
        default:
          break;
      }
      textrun.push(60), textrun.push(47), pushAll(textrun, tempbuf), reconsume(c3, rcdata_state);
    }
    function rawtext_less_than_sign_state(c3) {
      if (c3 === 47)
        beginTempBuf(), tokenizer = rawtext_end_tag_open_state;
      else
        textrun.push(60), reconsume(c3, rawtext_state);
    }
    function rawtext_end_tag_open_state(c3) {
      switch (c3) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginEndTagName(), reconsume(c3, rawtext_end_tag_name_state);
          break;
        default:
          textrun.push(60), textrun.push(47), reconsume(c3, rawtext_state);
          break;
      }
    }
    function rawtext_end_tag_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = before_attribute_name_state;
            return;
          }
          break;
        case 47:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = self_closing_start_tag_state;
            return;
          }
          break;
        case 62:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = data_state, emitTag();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tagnamebuf += String.fromCharCode(c3 + 32), tempbuf.push(c3);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          tagnamebuf += String.fromCharCode(c3), tempbuf.push(c3);
          return;
        default:
          break;
      }
      textrun.push(60), textrun.push(47), pushAll(textrun, tempbuf), reconsume(c3, rawtext_state);
    }
    function script_data_less_than_sign_state(c3) {
      switch (c3) {
        case 47:
          beginTempBuf(), tokenizer = script_data_end_tag_open_state;
          break;
        case 33:
          tokenizer = script_data_escape_start_state, textrun.push(60), textrun.push(33);
          break;
        default:
          textrun.push(60), reconsume(c3, script_data_state);
          break;
      }
    }
    function script_data_end_tag_open_state(c3) {
      switch (c3) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginEndTagName(), reconsume(c3, script_data_end_tag_name_state);
          break;
        default:
          textrun.push(60), textrun.push(47), reconsume(c3, script_data_state);
          break;
      }
    }
    function script_data_end_tag_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = before_attribute_name_state;
            return;
          }
          break;
        case 47:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = self_closing_start_tag_state;
            return;
          }
          break;
        case 62:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = data_state, emitTag();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tagnamebuf += String.fromCharCode(c3 + 32), tempbuf.push(c3);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          tagnamebuf += String.fromCharCode(c3), tempbuf.push(c3);
          return;
        default:
          break;
      }
      textrun.push(60), textrun.push(47), pushAll(textrun, tempbuf), reconsume(c3, script_data_state);
    }
    function script_data_escape_start_state(c3) {
      if (c3 === 45)
        tokenizer = script_data_escape_start_dash_state, textrun.push(45);
      else
        reconsume(c3, script_data_state);
    }
    function script_data_escape_start_dash_state(c3) {
      if (c3 === 45)
        tokenizer = script_data_escaped_dash_dash_state, textrun.push(45);
      else
        reconsume(c3, script_data_state);
    }
    function script_data_escaped_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = script_data_escaped_dash_state, textrun.push(45);
          break;
        case 60:
          tokenizer = script_data_escaped_less_than_sign_state;
          break;
        case 0:
          textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          textrun.push(c3);
          break;
      }
    }
    function script_data_escaped_dash_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = script_data_escaped_dash_dash_state, textrun.push(45);
          break;
        case 60:
          tokenizer = script_data_escaped_less_than_sign_state;
          break;
        case 0:
          tokenizer = script_data_escaped_state, textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          tokenizer = script_data_escaped_state, textrun.push(c3);
          break;
      }
    }
    function script_data_escaped_dash_dash_state(c3) {
      switch (c3) {
        case 45:
          textrun.push(45);
          break;
        case 60:
          tokenizer = script_data_escaped_less_than_sign_state;
          break;
        case 62:
          tokenizer = script_data_state, textrun.push(62);
          break;
        case 0:
          tokenizer = script_data_escaped_state, textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          tokenizer = script_data_escaped_state, textrun.push(c3);
          break;
      }
    }
    function script_data_escaped_less_than_sign_state(c3) {
      switch (c3) {
        case 47:
          beginTempBuf(), tokenizer = script_data_escaped_end_tag_open_state;
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginTempBuf(), textrun.push(60), reconsume(c3, script_data_double_escape_start_state);
          break;
        default:
          textrun.push(60), reconsume(c3, script_data_escaped_state);
          break;
      }
    }
    function script_data_escaped_end_tag_open_state(c3) {
      switch (c3) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          beginEndTagName(), reconsume(c3, script_data_escaped_end_tag_name_state);
          break;
        default:
          textrun.push(60), textrun.push(47), reconsume(c3, script_data_escaped_state);
          break;
      }
    }
    function script_data_escaped_end_tag_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = before_attribute_name_state;
            return;
          }
          break;
        case 47:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = self_closing_start_tag_state;
            return;
          }
          break;
        case 62:
          if (appropriateEndTag(tagnamebuf)) {
            tokenizer = data_state, emitTag();
            return;
          }
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tagnamebuf += String.fromCharCode(c3 + 32), tempbuf.push(c3);
          return;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          tagnamebuf += String.fromCharCode(c3), tempbuf.push(c3);
          return;
        default:
          break;
      }
      textrun.push(60), textrun.push(47), pushAll(textrun, tempbuf), reconsume(c3, script_data_escaped_state);
    }
    function script_data_double_escape_start_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 47:
        case 62:
          if (buf2str(tempbuf) === "script")
            tokenizer = script_data_double_escaped_state;
          else
            tokenizer = script_data_escaped_state;
          textrun.push(c3);
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tempbuf.push(c3 + 32), textrun.push(c3);
          break;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          tempbuf.push(c3), textrun.push(c3);
          break;
        default:
          reconsume(c3, script_data_escaped_state);
          break;
      }
    }
    function script_data_double_escaped_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = script_data_double_escaped_dash_state, textrun.push(45);
          break;
        case 60:
          tokenizer = script_data_double_escaped_less_than_sign_state, textrun.push(60);
          break;
        case 0:
          textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          textrun.push(c3);
          break;
      }
    }
    function script_data_double_escaped_dash_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = script_data_double_escaped_dash_dash_state, textrun.push(45);
          break;
        case 60:
          tokenizer = script_data_double_escaped_less_than_sign_state, textrun.push(60);
          break;
        case 0:
          tokenizer = script_data_double_escaped_state, textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          tokenizer = script_data_double_escaped_state, textrun.push(c3);
          break;
      }
    }
    function script_data_double_escaped_dash_dash_state(c3) {
      switch (c3) {
        case 45:
          textrun.push(45);
          break;
        case 60:
          tokenizer = script_data_double_escaped_less_than_sign_state, textrun.push(60);
          break;
        case 62:
          tokenizer = script_data_state, textrun.push(62);
          break;
        case 0:
          tokenizer = script_data_double_escaped_state, textrun.push(65533);
          break;
        case -1:
          emitEOF();
          break;
        default:
          tokenizer = script_data_double_escaped_state, textrun.push(c3);
          break;
      }
    }
    function script_data_double_escaped_less_than_sign_state(c3) {
      if (c3 === 47)
        beginTempBuf(), tokenizer = script_data_double_escape_end_state, textrun.push(47);
      else
        reconsume(c3, script_data_double_escaped_state);
    }
    function script_data_double_escape_end_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 47:
        case 62:
          if (buf2str(tempbuf) === "script")
            tokenizer = script_data_escaped_state;
          else
            tokenizer = script_data_double_escaped_state;
          textrun.push(c3);
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          tempbuf.push(c3 + 32), textrun.push(c3);
          break;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
        case 108:
        case 109:
        case 110:
        case 111:
        case 112:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
          tempbuf.push(c3), textrun.push(c3);
          break;
        default:
          reconsume(c3, script_data_double_escaped_state);
          break;
      }
    }
    function before_attribute_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 47:
          tokenizer = self_closing_start_tag_state;
          break;
        case 62:
          tokenizer = data_state, emitTag();
          break;
        case -1:
          emitEOF();
          break;
        case 61:
          beginAttrName(), attrnamebuf += String.fromCharCode(c3), tokenizer = attribute_name_state;
          break;
        default:
          if (handleSimpleAttribute())
            break;
          beginAttrName(), reconsume(c3, attribute_name_state);
          break;
      }
    }
    function attribute_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 47:
        case 62:
        case -1:
          reconsume(c3, after_attribute_name_state);
          break;
        case 61:
          tokenizer = before_attribute_value_state;
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          attrnamebuf += String.fromCharCode(c3 + 32);
          break;
        case 0:
          attrnamebuf += String.fromCharCode(65533);
          break;
        case 34:
        case 39:
        case 60:
        default:
          attrnamebuf += getMatchingChars(ATTRNAME);
          break;
      }
    }
    function after_attribute_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 47:
          addAttribute(attrnamebuf), tokenizer = self_closing_start_tag_state;
          break;
        case 61:
          tokenizer = before_attribute_value_state;
          break;
        case 62:
          tokenizer = data_state, addAttribute(attrnamebuf), emitTag();
          break;
        case -1:
          addAttribute(attrnamebuf), emitEOF();
          break;
        default:
          addAttribute(attrnamebuf), beginAttrName(), reconsume(c3, attribute_name_state);
          break;
      }
    }
    function before_attribute_value_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 34:
          beginAttrValue(), tokenizer = attribute_value_double_quoted_state;
          break;
        case 39:
          beginAttrValue(), tokenizer = attribute_value_single_quoted_state;
          break;
        case 62:
        default:
          beginAttrValue(), reconsume(c3, attribute_value_unquoted_state);
          break;
      }
    }
    function attribute_value_double_quoted_state(c3) {
      switch (c3) {
        case 34:
          addAttribute(attrnamebuf, attrvaluebuf), tokenizer = after_attribute_value_quoted_state;
          break;
        case 38:
          return_state = attribute_value_double_quoted_state, tokenizer = character_reference_state;
          break;
        case 0:
          attrvaluebuf += String.fromCharCode(65533);
          break;
        case -1:
          emitEOF();
          break;
        case 10:
          attrvaluebuf += String.fromCharCode(c3);
          break;
        default:
          attrvaluebuf += getMatchingChars(DBLQUOTEATTRVAL);
          break;
      }
    }
    function attribute_value_single_quoted_state(c3) {
      switch (c3) {
        case 39:
          addAttribute(attrnamebuf, attrvaluebuf), tokenizer = after_attribute_value_quoted_state;
          break;
        case 38:
          return_state = attribute_value_single_quoted_state, tokenizer = character_reference_state;
          break;
        case 0:
          attrvaluebuf += String.fromCharCode(65533);
          break;
        case -1:
          emitEOF();
          break;
        case 10:
          attrvaluebuf += String.fromCharCode(c3);
          break;
        default:
          attrvaluebuf += getMatchingChars(SINGLEQUOTEATTRVAL);
          break;
      }
    }
    function attribute_value_unquoted_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          addAttribute(attrnamebuf, attrvaluebuf), tokenizer = before_attribute_name_state;
          break;
        case 38:
          return_state = attribute_value_unquoted_state, tokenizer = character_reference_state;
          break;
        case 62:
          addAttribute(attrnamebuf, attrvaluebuf), tokenizer = data_state, emitTag();
          break;
        case 0:
          attrvaluebuf += String.fromCharCode(65533);
          break;
        case -1:
          nextchar--, tokenizer = data_state;
          break;
        case 34:
        case 39:
        case 60:
        case 61:
        case 96:
        default:
          attrvaluebuf += getMatchingChars(UNQUOTEDATTRVAL);
          break;
      }
    }
    function after_attribute_value_quoted_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = before_attribute_name_state;
          break;
        case 47:
          tokenizer = self_closing_start_tag_state;
          break;
        case 62:
          tokenizer = data_state, emitTag();
          break;
        case -1:
          emitEOF();
          break;
        default:
          reconsume(c3, before_attribute_name_state);
          break;
      }
    }
    function self_closing_start_tag_state(c3) {
      switch (c3) {
        case 62:
          tokenizer = data_state, emitSelfClosingTag(!0);
          break;
        case -1:
          emitEOF();
          break;
        default:
          reconsume(c3, before_attribute_name_state);
          break;
      }
    }
    function bogus_comment_state(c3, lookahead, eof) {
      var len = lookahead.length;
      if (eof)
        nextchar += len - 1;
      else
        nextchar += len;
      var comment = lookahead.substring(0, len - 1);
      comment = comment.replace(/\u0000/g, "\uFFFD"), comment = comment.replace(/\u000D\u000A/g, `
`), comment = comment.replace(/\u000D/g, `
`), insertToken(COMMENT, comment), tokenizer = data_state;
    }
    bogus_comment_state.lookahead = ">";
    function markup_declaration_open_state(c3, lookahead, eof) {
      if (lookahead[0] === "-" && lookahead[1] === "-") {
        nextchar += 2, beginComment(), tokenizer = comment_start_state;
        return;
      }
      if (lookahead.toUpperCase() === "DOCTYPE")
        nextchar += 7, tokenizer = doctype_state;
      else if (lookahead === "[CDATA[" && cdataAllowed())
        nextchar += 7, tokenizer = cdata_section_state;
      else
        tokenizer = bogus_comment_state;
    }
    markup_declaration_open_state.lookahead = 7;
    function comment_start_state(c3) {
      switch (beginComment(), c3) {
        case 45:
          tokenizer = comment_start_dash_state;
          break;
        case 62:
          tokenizer = data_state, insertToken(COMMENT, buf2str(commentbuf));
          break;
        default:
          reconsume(c3, comment_state);
          break;
      }
    }
    function comment_start_dash_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = comment_end_state;
          break;
        case 62:
          tokenizer = data_state, insertToken(COMMENT, buf2str(commentbuf));
          break;
        case -1:
          insertToken(COMMENT, buf2str(commentbuf)), emitEOF();
          break;
        default:
          commentbuf.push(45), reconsume(c3, comment_state);
          break;
      }
    }
    function comment_state(c3) {
      switch (c3) {
        case 60:
          commentbuf.push(c3), tokenizer = comment_less_than_sign_state;
          break;
        case 45:
          tokenizer = comment_end_dash_state;
          break;
        case 0:
          commentbuf.push(65533);
          break;
        case -1:
          insertToken(COMMENT, buf2str(commentbuf)), emitEOF();
          break;
        default:
          commentbuf.push(c3);
          break;
      }
    }
    function comment_less_than_sign_state(c3) {
      switch (c3) {
        case 33:
          commentbuf.push(c3), tokenizer = comment_less_than_sign_bang_state;
          break;
        case 60:
          commentbuf.push(c3);
          break;
        default:
          reconsume(c3, comment_state);
          break;
      }
    }
    function comment_less_than_sign_bang_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = comment_less_than_sign_bang_dash_state;
          break;
        default:
          reconsume(c3, comment_state);
          break;
      }
    }
    function comment_less_than_sign_bang_dash_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = comment_less_than_sign_bang_dash_dash_state;
          break;
        default:
          reconsume(c3, comment_end_dash_state);
          break;
      }
    }
    function comment_less_than_sign_bang_dash_dash_state(c3) {
      switch (c3) {
        case 62:
        case -1:
          reconsume(c3, comment_end_state);
          break;
        default:
          reconsume(c3, comment_end_state);
          break;
      }
    }
    function comment_end_dash_state(c3) {
      switch (c3) {
        case 45:
          tokenizer = comment_end_state;
          break;
        case -1:
          insertToken(COMMENT, buf2str(commentbuf)), emitEOF();
          break;
        default:
          commentbuf.push(45), reconsume(c3, comment_state);
          break;
      }
    }
    function comment_end_state(c3) {
      switch (c3) {
        case 62:
          tokenizer = data_state, insertToken(COMMENT, buf2str(commentbuf));
          break;
        case 33:
          tokenizer = comment_end_bang_state;
          break;
        case 45:
          commentbuf.push(45);
          break;
        case -1:
          insertToken(COMMENT, buf2str(commentbuf)), emitEOF();
          break;
        default:
          commentbuf.push(45), commentbuf.push(45), reconsume(c3, comment_state);
          break;
      }
    }
    function comment_end_bang_state(c3) {
      switch (c3) {
        case 45:
          commentbuf.push(45), commentbuf.push(45), commentbuf.push(33), tokenizer = comment_end_dash_state;
          break;
        case 62:
          tokenizer = data_state, insertToken(COMMENT, buf2str(commentbuf));
          break;
        case -1:
          insertToken(COMMENT, buf2str(commentbuf)), emitEOF();
          break;
        default:
          commentbuf.push(45), commentbuf.push(45), commentbuf.push(33), reconsume(c3, comment_state);
          break;
      }
    }
    function doctype_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = before_doctype_name_state;
          break;
        case -1:
          beginDoctype(), forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          reconsume(c3, before_doctype_name_state);
          break;
      }
    }
    function before_doctype_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          beginDoctype(), doctypenamebuf.push(c3 + 32), tokenizer = doctype_name_state;
          break;
        case 0:
          beginDoctype(), doctypenamebuf.push(65533), tokenizer = doctype_name_state;
          break;
        case 62:
          beginDoctype(), forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          beginDoctype(), forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          beginDoctype(), doctypenamebuf.push(c3), tokenizer = doctype_name_state;
          break;
      }
    }
    function doctype_name_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = after_doctype_name_state;
          break;
        case 62:
          tokenizer = data_state, emitDoctype();
          break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
          doctypenamebuf.push(c3 + 32);
          break;
        case 0:
          doctypenamebuf.push(65533);
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          doctypenamebuf.push(c3);
          break;
      }
    }
    function after_doctype_name_state(c3, lookahead, eof) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          nextchar += 1;
          break;
        case 62:
          tokenizer = data_state, nextchar += 1, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          if (lookahead = lookahead.toUpperCase(), lookahead === "PUBLIC")
            nextchar += 6, tokenizer = after_doctype_public_keyword_state;
          else if (lookahead === "SYSTEM")
            nextchar += 6, tokenizer = after_doctype_system_keyword_state;
          else
            forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    after_doctype_name_state.lookahead = 6;
    function after_doctype_public_keyword_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = before_doctype_public_identifier_state;
          break;
        case 34:
          beginDoctypePublicId(), tokenizer = doctype_public_identifier_double_quoted_state;
          break;
        case 39:
          beginDoctypePublicId(), tokenizer = doctype_public_identifier_single_quoted_state;
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    function before_doctype_public_identifier_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 34:
          beginDoctypePublicId(), tokenizer = doctype_public_identifier_double_quoted_state;
          break;
        case 39:
          beginDoctypePublicId(), tokenizer = doctype_public_identifier_single_quoted_state;
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    function doctype_public_identifier_double_quoted_state(c3) {
      switch (c3) {
        case 34:
          tokenizer = after_doctype_public_identifier_state;
          break;
        case 0:
          doctypepublicbuf.push(65533);
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          doctypepublicbuf.push(c3);
          break;
      }
    }
    function doctype_public_identifier_single_quoted_state(c3) {
      switch (c3) {
        case 39:
          tokenizer = after_doctype_public_identifier_state;
          break;
        case 0:
          doctypepublicbuf.push(65533);
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          doctypepublicbuf.push(c3);
          break;
      }
    }
    function after_doctype_public_identifier_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = between_doctype_public_and_system_identifiers_state;
          break;
        case 62:
          tokenizer = data_state, emitDoctype();
          break;
        case 34:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_double_quoted_state;
          break;
        case 39:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_single_quoted_state;
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    function between_doctype_public_and_system_identifiers_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 62:
          tokenizer = data_state, emitDoctype();
          break;
        case 34:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_double_quoted_state;
          break;
        case 39:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_single_quoted_state;
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    function after_doctype_system_keyword_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          tokenizer = before_doctype_system_identifier_state;
          break;
        case 34:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_double_quoted_state;
          break;
        case 39:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_single_quoted_state;
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    function before_doctype_system_identifier_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 34:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_double_quoted_state;
          break;
        case 39:
          beginDoctypeSystemId(), tokenizer = doctype_system_identifier_single_quoted_state;
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          forcequirks(), tokenizer = bogus_doctype_state;
          break;
      }
    }
    function doctype_system_identifier_double_quoted_state(c3) {
      switch (c3) {
        case 34:
          tokenizer = after_doctype_system_identifier_state;
          break;
        case 0:
          doctypesystembuf.push(65533);
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          doctypesystembuf.push(c3);
          break;
      }
    }
    function doctype_system_identifier_single_quoted_state(c3) {
      switch (c3) {
        case 39:
          tokenizer = after_doctype_system_identifier_state;
          break;
        case 0:
          doctypesystembuf.push(65533);
          break;
        case 62:
          forcequirks(), tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          doctypesystembuf.push(c3);
          break;
      }
    }
    function after_doctype_system_identifier_state(c3) {
      switch (c3) {
        case 9:
        case 10:
        case 12:
        case 32:
          break;
        case 62:
          tokenizer = data_state, emitDoctype();
          break;
        case -1:
          forcequirks(), emitDoctype(), emitEOF();
          break;
        default:
          tokenizer = bogus_doctype_state;
          break;
      }
    }
    function bogus_doctype_state(c3) {
      switch (c3) {
        case 62:
          tokenizer = data_state, emitDoctype();
          break;
        case -1:
          emitDoctype(), emitEOF();
          break;
        default:
          break;
      }
    }
    function cdata_section_state(c3) {
      switch (c3) {
        case 93:
          tokenizer = cdata_section_bracket_state;
          break;
        case -1:
          emitEOF();
          break;
        case 0:
          textIncludesNUL = !0;
        default:
          emitCharsWhile(CDATATEXT) || textrun.push(c3);
          break;
      }
    }
    function cdata_section_bracket_state(c3) {
      switch (c3) {
        case 93:
          tokenizer = cdata_section_end_state;
          break;
        default:
          textrun.push(93), reconsume(c3, cdata_section_state);
          break;
      }
    }
    function cdata_section_end_state(c3) {
      switch (c3) {
        case 93:
          textrun.push(93);
          break;
        case 62:
          flushText(), tokenizer = data_state;
          break;
        default:
          textrun.push(93), textrun.push(93), reconsume(c3, cdata_section_state);
          break;
      }
    }
    function character_reference_state(c3) {
      switch (beginTempBuf(), tempbuf.push(38), c3) {
        case 9:
        case 10:
        case 12:
        case 32:
        case 60:
        case 38:
        case -1:
          reconsume(c3, character_reference_end_state);
          break;
        case 35:
          tempbuf.push(c3), tokenizer = numeric_character_reference_state;
          break;
        default:
          reconsume(c3, named_character_reference_state);
          break;
      }
    }
    function named_character_reference_state(c3) {
      NAMEDCHARREF.lastIndex = nextchar;
      var matched = NAMEDCHARREF.exec(chars);
      if (!matched)
        throw Error("should never happen");
      var name3 = matched[1];
      if (!name3) {
        tokenizer = character_reference_end_state;
        return;
      }
      switch (nextchar += name3.length, pushAll(tempbuf, str2buf(name3)), return_state) {
        case attribute_value_double_quoted_state:
        case attribute_value_single_quoted_state:
        case attribute_value_unquoted_state:
          if (name3[name3.length - 1] !== ";") {
            if (/[=A-Za-z0-9]/.test(chars[nextchar])) {
              tokenizer = character_reference_end_state;
              return;
            }
          }
          break;
        default:
          break;
      }
      beginTempBuf();
      var rv = namedCharRefs[name3];
      if (typeof rv === "number")
        tempbuf.push(rv);
      else
        pushAll(tempbuf, rv);
      tokenizer = character_reference_end_state;
    }
    named_character_reference_state.lookahead = -NAMEDCHARREF_MAXLEN;
    function numeric_character_reference_state(c3) {
      switch (character_reference_code = 0, c3) {
        case 120:
        case 88:
          tempbuf.push(c3), tokenizer = hexadecimal_character_reference_start_state;
          break;
        default:
          reconsume(c3, decimal_character_reference_start_state);
          break;
      }
    }
    function hexadecimal_character_reference_start_state(c3) {
      switch (c3) {
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
          reconsume(c3, hexadecimal_character_reference_state);
          break;
        default:
          reconsume(c3, character_reference_end_state);
          break;
      }
    }
    function decimal_character_reference_start_state(c3) {
      switch (c3) {
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          reconsume(c3, decimal_character_reference_state);
          break;
        default:
          reconsume(c3, character_reference_end_state);
          break;
      }
    }
    function hexadecimal_character_reference_state(c3) {
      switch (c3) {
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
          character_reference_code *= 16, character_reference_code += c3 - 55;
          break;
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
          character_reference_code *= 16, character_reference_code += c3 - 87;
          break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          character_reference_code *= 16, character_reference_code += c3 - 48;
          break;
        case 59:
          tokenizer = numeric_character_reference_end_state;
          break;
        default:
          reconsume(c3, numeric_character_reference_end_state);
          break;
      }
    }
    function decimal_character_reference_state(c3) {
      switch (c3) {
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          character_reference_code *= 10, character_reference_code += c3 - 48;
          break;
        case 59:
          tokenizer = numeric_character_reference_end_state;
          break;
        default:
          reconsume(c3, numeric_character_reference_end_state);
          break;
      }
    }
    function numeric_character_reference_end_state(c3) {
      if (character_reference_code in numericCharRefReplacements)
        character_reference_code = numericCharRefReplacements[character_reference_code];
      else if (character_reference_code > 1114111 || character_reference_code >= 55296 && character_reference_code < 57344)
        character_reference_code = 65533;
      if (beginTempBuf(), character_reference_code <= 65535)
        tempbuf.push(character_reference_code);
      else
        character_reference_code = character_reference_code - 65536, tempbuf.push(55296 + (character_reference_code >> 10)), tempbuf.push(56320 + (character_reference_code & 1023));
      reconsume(c3, character_reference_end_state);
    }
    function character_reference_end_state(c3) {
      switch (return_state) {
        case attribute_value_double_quoted_state:
        case attribute_value_single_quoted_state:
        case attribute_value_unquoted_state:
          attrvaluebuf += buf2str(tempbuf);
          break;
        default:
          pushAll(textrun, tempbuf);
          break;
      }
      reconsume(c3, return_state);
    }
    function initial_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (value = value.replace(LEADINGWS, ""), value.length === 0)
            return;
          break;
        case 4:
          doc2._appendChild(doc2.createComment(value));
          return;
        case 5:
          var name3 = value, publicid = arg3, systemid = arg4;
          if (doc2.appendChild(new DocumentType3(doc2, name3, publicid, systemid)), force_quirks || name3.toLowerCase() !== "html" || quirkyPublicIds.test(publicid) || systemid && systemid.toLowerCase() === quirkySystemId || systemid === void 0 && conditionallyQuirkyPublicIds.test(publicid))
            doc2._quirks = !0;
          else if (limitedQuirkyPublicIds.test(publicid) || systemid !== void 0 && conditionallyQuirkyPublicIds.test(publicid))
            doc2._limitedQuirks = !0;
          parser2 = before_html_mode;
          return;
      }
      doc2._quirks = !0, parser2 = before_html_mode, parser2(t2, value, arg3, arg4);
    }
    function before_html_mode(t2, value, arg3, arg4) {
      var elt;
      switch (t2) {
        case 1:
          if (value = value.replace(LEADINGWS, ""), value.length === 0)
            return;
          break;
        case 5:
          return;
        case 4:
          doc2._appendChild(doc2.createComment(value));
          return;
        case 2:
          if (value === "html") {
            elt = createHTMLElt(doc2, value, arg3), stack.push(elt), doc2.appendChild(elt), parser2 = before_head_mode;
            return;
          }
          break;
        case 3:
          switch (value) {
            case "html":
            case "head":
            case "body":
            case "br":
              break;
            default:
              return;
          }
      }
      elt = createHTMLElt(doc2, "html", null), stack.push(elt), doc2.appendChild(elt), parser2 = before_head_mode, parser2(t2, value, arg3, arg4);
    }
    function before_head_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (value = value.replace(LEADINGWS, ""), value.length === 0)
            return;
          break;
        case 5:
          return;
        case 4:
          insertComment(value);
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "head":
              var elt = insertHTMLElement(value, arg3);
              head_element_pointer = elt, parser2 = in_head_mode;
              return;
          }
          break;
        case 3:
          switch (value) {
            case "html":
            case "head":
            case "body":
            case "br":
              break;
            default:
              return;
          }
      }
      before_head_mode(TAG, "head", null), parser2(t2, value, arg3, arg4);
    }
    function in_head_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          var ws = value.match(LEADINGWS);
          if (ws)
            insertText(ws[0]), value = value.substring(ws[0].length);
          if (value.length === 0)
            return;
          break;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "meta":
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
              insertHTMLElement(value, arg3), stack.pop();
              return;
            case "title":
              parseRCDATA(value, arg3);
              return;
            case "noscript":
              if (!scripting_enabled) {
                insertHTMLElement(value, arg3), parser2 = in_head_noscript_mode;
                return;
              }
            case "noframes":
            case "style":
              parseRawText(value, arg3);
              return;
            case "script":
              insertElement(function(doc3) {
                var elt = createHTMLElt(doc3, value, arg3);
                if (elt._parser_inserted = !0, elt._force_async = !1, fragment)
                  elt._already_started = !0;
                return flushText(), elt;
              }), tokenizer = script_data_state, originalInsertionMode = parser2, parser2 = text_mode;
              return;
            case "template":
              insertHTMLElement(value, arg3), afe.insertMarker(), frameset_ok = !1, parser2 = in_template_mode, templateInsertionModes.push(parser2);
              return;
            case "head":
              return;
          }
          break;
        case 3:
          switch (value) {
            case "head":
              stack.pop(), parser2 = after_head_mode;
              return;
            case "body":
            case "html":
            case "br":
              break;
            case "template":
              if (!stack.contains("template"))
                return;
              stack.generateImpliedEndTags(null, "thorough"), stack.popTag("template"), afe.clearToMarker(), templateInsertionModes.pop(), resetInsertionMode();
              return;
            default:
              return;
          }
          break;
      }
      in_head_mode(ENDTAG, "head", null), parser2(t2, value, arg3, arg4);
    }
    function in_head_noscript_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 5:
          return;
        case 4:
          in_head_mode(t2, value);
          return;
        case 1:
          var ws = value.match(LEADINGWS);
          if (ws)
            in_head_mode(t2, ws[0]), value = value.substring(ws[0].length);
          if (value.length === 0)
            return;
          break;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "style":
              in_head_mode(t2, value, arg3);
              return;
            case "head":
            case "noscript":
              return;
          }
          break;
        case 3:
          switch (value) {
            case "noscript":
              stack.pop(), parser2 = in_head_mode;
              return;
            case "br":
              break;
            default:
              return;
          }
          break;
      }
      in_head_noscript_mode(ENDTAG, "noscript", null), parser2(t2, value, arg3, arg4);
    }
    function after_head_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          var ws = value.match(LEADINGWS);
          if (ws)
            insertText(ws[0]), value = value.substring(ws[0].length);
          if (value.length === 0)
            return;
          break;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "body":
              insertHTMLElement(value, arg3), frameset_ok = !1, parser2 = in_body_mode;
              return;
            case "frameset":
              insertHTMLElement(value, arg3), parser2 = in_frameset_mode;
              return;
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "script":
            case "style":
            case "template":
            case "title":
              stack.push(head_element_pointer), in_head_mode(TAG, value, arg3), stack.removeElement(head_element_pointer);
              return;
            case "head":
              return;
          }
          break;
        case 3:
          switch (value) {
            case "template":
              return in_head_mode(t2, value, arg3, arg4);
            case "body":
            case "html":
            case "br":
              break;
            default:
              return;
          }
          break;
      }
      after_head_mode(TAG, "body", null), frameset_ok = !0, parser2(t2, value, arg3, arg4);
    }
    function in_body_mode(t2, value, arg3, arg4) {
      var body, i5, node2, elt;
      switch (t2) {
        case 1:
          if (textIncludesNUL) {
            if (value = value.replace(NULCHARS, ""), value.length === 0)
              return;
          }
          if (frameset_ok && NONWS.test(value))
            frameset_ok = !1;
          afereconstruct(), insertText(value);
          return;
        case 5:
          return;
        case 4:
          insertComment(value);
          return;
        case -1:
          if (templateInsertionModes.length)
            return in_template_mode(t2);
          stopParsing();
          return;
        case 2:
          switch (value) {
            case "html":
              if (stack.contains("template"))
                return;
              transferAttributes(arg3, stack.elements[0]);
              return;
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "script":
            case "style":
            case "template":
            case "title":
              in_head_mode(TAG, value, arg3);
              return;
            case "body":
              if (body = stack.elements[1], !body || !(body instanceof impl.HTMLBodyElement) || stack.contains("template"))
                return;
              frameset_ok = !1, transferAttributes(arg3, body);
              return;
            case "frameset":
              if (!frameset_ok)
                return;
              if (body = stack.elements[1], !body || !(body instanceof impl.HTMLBodyElement))
                return;
              if (body.parentNode)
                body.parentNode.removeChild(body);
              while (!(stack.top instanceof impl.HTMLHtmlElement))
                stack.pop();
              insertHTMLElement(value, arg3), parser2 = in_frameset_mode;
              return;
            case "address":
            case "article":
            case "aside":
            case "blockquote":
            case "center":
            case "details":
            case "dialog":
            case "dir":
            case "div":
            case "dl":
            case "fieldset":
            case "figcaption":
            case "figure":
            case "footer":
            case "header":
            case "hgroup":
            case "main":
            case "nav":
            case "ol":
            case "p":
            case "section":
            case "summary":
            case "ul":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              insertHTMLElement(value, arg3);
              return;
            case "menu":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              if (isA(stack.top, "menuitem"))
                stack.pop();
              insertHTMLElement(value, arg3);
              return;
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              if (stack.top instanceof impl.HTMLHeadingElement)
                stack.pop();
              insertHTMLElement(value, arg3);
              return;
            case "pre":
            case "listing":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              insertHTMLElement(value, arg3), ignore_linefeed = !0, frameset_ok = !1;
              return;
            case "form":
              if (form_element_pointer && !stack.contains("template"))
                return;
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              if (elt = insertHTMLElement(value, arg3), !stack.contains("template"))
                form_element_pointer = elt;
              return;
            case "li":
              frameset_ok = !1;
              for (i5 = stack.elements.length - 1;i5 >= 0; i5--) {
                if (node2 = stack.elements[i5], node2 instanceof impl.HTMLLIElement) {
                  in_body_mode(ENDTAG, "li");
                  break;
                }
                if (isA(node2, specialSet) && !isA(node2, addressdivpSet))
                  break;
              }
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              insertHTMLElement(value, arg3);
              return;
            case "dd":
            case "dt":
              frameset_ok = !1;
              for (i5 = stack.elements.length - 1;i5 >= 0; i5--) {
                if (node2 = stack.elements[i5], isA(node2, dddtSet)) {
                  in_body_mode(ENDTAG, node2.localName);
                  break;
                }
                if (isA(node2, specialSet) && !isA(node2, addressdivpSet))
                  break;
              }
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              insertHTMLElement(value, arg3);
              return;
            case "plaintext":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              insertHTMLElement(value, arg3), tokenizer = plaintext_state;
              return;
            case "button":
              if (stack.inScope("button"))
                in_body_mode(ENDTAG, "button"), parser2(t2, value, arg3, arg4);
              else
                afereconstruct(), insertHTMLElement(value, arg3), frameset_ok = !1;
              return;
            case "a":
              var activeElement = afe.findElementByTag("a");
              if (activeElement)
                in_body_mode(ENDTAG, value), afe.remove(activeElement), stack.removeElement(activeElement);
            case "b":
            case "big":
            case "code":
            case "em":
            case "font":
            case "i":
            case "s":
            case "small":
            case "strike":
            case "strong":
            case "tt":
            case "u":
              afereconstruct(), afe.push(insertHTMLElement(value, arg3), arg3);
              return;
            case "nobr":
              if (afereconstruct(), stack.inScope(value))
                in_body_mode(ENDTAG, value), afereconstruct();
              afe.push(insertHTMLElement(value, arg3), arg3);
              return;
            case "applet":
            case "marquee":
            case "object":
              afereconstruct(), insertHTMLElement(value, arg3), afe.insertMarker(), frameset_ok = !1;
              return;
            case "table":
              if (!doc2._quirks && stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              insertHTMLElement(value, arg3), frameset_ok = !1, parser2 = in_table_mode;
              return;
            case "area":
            case "br":
            case "embed":
            case "img":
            case "keygen":
            case "wbr":
              afereconstruct(), insertHTMLElement(value, arg3), stack.pop(), frameset_ok = !1;
              return;
            case "input":
              afereconstruct(), elt = insertHTMLElement(value, arg3), stack.pop();
              var type = elt.getAttribute("type");
              if (!type || type.toLowerCase() !== "hidden")
                frameset_ok = !1;
              return;
            case "param":
            case "source":
            case "track":
              insertHTMLElement(value, arg3), stack.pop();
              return;
            case "hr":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              if (isA(stack.top, "menuitem"))
                stack.pop();
              insertHTMLElement(value, arg3), stack.pop(), frameset_ok = !1;
              return;
            case "image":
              in_body_mode(TAG, "img", arg3, arg4);
              return;
            case "textarea":
              insertHTMLElement(value, arg3), ignore_linefeed = !0, frameset_ok = !1, tokenizer = rcdata_state, originalInsertionMode = parser2, parser2 = text_mode;
              return;
            case "xmp":
              if (stack.inButtonScope("p"))
                in_body_mode(ENDTAG, "p");
              afereconstruct(), frameset_ok = !1, parseRawText(value, arg3);
              return;
            case "iframe":
              frameset_ok = !1, parseRawText(value, arg3);
              return;
            case "noembed":
              parseRawText(value, arg3);
              return;
            case "select":
              if (afereconstruct(), insertHTMLElement(value, arg3), frameset_ok = !1, parser2 === in_table_mode || parser2 === in_caption_mode || parser2 === in_table_body_mode || parser2 === in_row_mode || parser2 === in_cell_mode)
                parser2 = in_select_in_table_mode;
              else
                parser2 = in_select_mode;
              return;
            case "optgroup":
            case "option":
              if (stack.top instanceof impl.HTMLOptionElement)
                in_body_mode(ENDTAG, "option");
              afereconstruct(), insertHTMLElement(value, arg3);
              return;
            case "menuitem":
              if (isA(stack.top, "menuitem"))
                stack.pop();
              afereconstruct(), insertHTMLElement(value, arg3);
              return;
            case "rb":
            case "rtc":
              if (stack.inScope("ruby"))
                stack.generateImpliedEndTags();
              insertHTMLElement(value, arg3);
              return;
            case "rp":
            case "rt":
              if (stack.inScope("ruby"))
                stack.generateImpliedEndTags("rtc");
              insertHTMLElement(value, arg3);
              return;
            case "math":
              if (afereconstruct(), adjustMathMLAttributes(arg3), adjustForeignAttributes(arg3), insertForeignElement(value, arg3, NAMESPACE.MATHML), arg4)
                stack.pop();
              return;
            case "svg":
              if (afereconstruct(), adjustSVGAttributes(arg3), adjustForeignAttributes(arg3), insertForeignElement(value, arg3, NAMESPACE.SVG), arg4)
                stack.pop();
              return;
            case "caption":
            case "col":
            case "colgroup":
            case "frame":
            case "head":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              return;
          }
          afereconstruct(), insertHTMLElement(value, arg3);
          return;
        case 3:
          switch (value) {
            case "template":
              in_head_mode(ENDTAG, value, arg3);
              return;
            case "body":
              if (!stack.inScope("body"))
                return;
              parser2 = after_body_mode;
              return;
            case "html":
              if (!stack.inScope("body"))
                return;
              parser2 = after_body_mode, parser2(t2, value, arg3);
              return;
            case "address":
            case "article":
            case "aside":
            case "blockquote":
            case "button":
            case "center":
            case "details":
            case "dialog":
            case "dir":
            case "div":
            case "dl":
            case "fieldset":
            case "figcaption":
            case "figure":
            case "footer":
            case "header":
            case "hgroup":
            case "listing":
            case "main":
            case "menu":
            case "nav":
            case "ol":
            case "pre":
            case "section":
            case "summary":
            case "ul":
              if (!stack.inScope(value))
                return;
              stack.generateImpliedEndTags(), stack.popTag(value);
              return;
            case "form":
              if (!stack.contains("template")) {
                var openform = form_element_pointer;
                if (form_element_pointer = null, !openform || !stack.elementInScope(openform))
                  return;
                stack.generateImpliedEndTags(), stack.removeElement(openform);
              } else {
                if (!stack.inScope("form"))
                  return;
                stack.generateImpliedEndTags(), stack.popTag("form");
              }
              return;
            case "p":
              if (!stack.inButtonScope(value))
                in_body_mode(TAG, value, null), parser2(t2, value, arg3, arg4);
              else
                stack.generateImpliedEndTags(value), stack.popTag(value);
              return;
            case "li":
              if (!stack.inListItemScope(value))
                return;
              stack.generateImpliedEndTags(value), stack.popTag(value);
              return;
            case "dd":
            case "dt":
              if (!stack.inScope(value))
                return;
              stack.generateImpliedEndTags(value), stack.popTag(value);
              return;
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              if (!stack.elementTypeInScope(impl.HTMLHeadingElement))
                return;
              stack.generateImpliedEndTags(), stack.popElementType(impl.HTMLHeadingElement);
              return;
            case "sarcasm":
              break;
            case "a":
            case "b":
            case "big":
            case "code":
            case "em":
            case "font":
            case "i":
            case "nobr":
            case "s":
            case "small":
            case "strike":
            case "strong":
            case "tt":
            case "u":
              var result = adoptionAgency(value);
              if (result)
                return;
              break;
            case "applet":
            case "marquee":
            case "object":
              if (!stack.inScope(value))
                return;
              stack.generateImpliedEndTags(), stack.popTag(value), afe.clearToMarker();
              return;
            case "br":
              in_body_mode(TAG, value, null);
              return;
          }
          for (i5 = stack.elements.length - 1;i5 >= 0; i5--)
            if (node2 = stack.elements[i5], isA(node2, value)) {
              stack.generateImpliedEndTags(value), stack.popElement(node2);
              break;
            } else if (isA(node2, specialSet))
              return;
          return;
      }
    }
    function text_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          insertText(value);
          return;
        case -1:
          if (stack.top instanceof impl.HTMLScriptElement)
            stack.top._already_started = !0;
          stack.pop(), parser2 = originalInsertionMode, parser2(t2);
          return;
        case 3:
          if (value === "script")
            handleScriptEnd();
          else
            stack.pop(), parser2 = originalInsertionMode;
          return;
        default:
          return;
      }
    }
    function in_table_mode(t2, value, arg3, arg4) {
      function getTypeAttr(attrs) {
        for (var i5 = 0, n5 = attrs.length;i5 < n5; i5++)
          if (attrs[i5][0] === "type")
            return attrs[i5][1].toLowerCase();
        return null;
      }
      switch (t2) {
        case 1:
          if (text_integration_mode) {
            in_body_mode(t2, value, arg3, arg4);
            return;
          } else if (isA(stack.top, tablesectionrowSet)) {
            pending_table_text = [], originalInsertionMode = parser2, parser2 = in_table_text_mode, parser2(t2, value, arg3, arg4);
            return;
          }
          break;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case 2:
          switch (value) {
            case "caption":
              stack.clearToContext(tableContextSet), afe.insertMarker(), insertHTMLElement(value, arg3), parser2 = in_caption_mode;
              return;
            case "colgroup":
              stack.clearToContext(tableContextSet), insertHTMLElement(value, arg3), parser2 = in_column_group_mode;
              return;
            case "col":
              in_table_mode(TAG, "colgroup", null), parser2(t2, value, arg3, arg4);
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              stack.clearToContext(tableContextSet), insertHTMLElement(value, arg3), parser2 = in_table_body_mode;
              return;
            case "td":
            case "th":
            case "tr":
              in_table_mode(TAG, "tbody", null), parser2(t2, value, arg3, arg4);
              return;
            case "table":
              if (!stack.inTableScope(value))
                return;
              in_table_mode(ENDTAG, value), parser2(t2, value, arg3, arg4);
              return;
            case "style":
            case "script":
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
            case "input":
              var type = getTypeAttr(arg3);
              if (type !== "hidden")
                break;
              insertHTMLElement(value, arg3), stack.pop();
              return;
            case "form":
              if (form_element_pointer || stack.contains("template"))
                return;
              form_element_pointer = insertHTMLElement(value, arg3), stack.popElement(form_element_pointer);
              return;
          }
          break;
        case 3:
          switch (value) {
            case "table":
              if (!stack.inTableScope(value))
                return;
              stack.popTag(value), resetInsertionMode();
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              return;
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
        case -1:
          in_body_mode(t2, value, arg3, arg4);
          return;
      }
      foster_parent_mode = !0, in_body_mode(t2, value, arg3, arg4), foster_parent_mode = !1;
    }
    function in_table_text_mode(t2, value, arg3, arg4) {
      if (t2 === TEXT) {
        if (textIncludesNUL) {
          if (value = value.replace(NULCHARS, ""), value.length === 0)
            return;
        }
        pending_table_text.push(value);
      } else {
        var s2 = pending_table_text.join("");
        if (pending_table_text.length = 0, NONWS.test(s2))
          foster_parent_mode = !0, in_body_mode(TEXT, s2), foster_parent_mode = !1;
        else
          insertText(s2);
        parser2 = originalInsertionMode, parser2(t2, value, arg3, arg4);
      }
    }
    function in_caption_mode(t2, value, arg3, arg4) {
      function end_caption() {
        if (!stack.inTableScope("caption"))
          return !1;
        return stack.generateImpliedEndTags(), stack.popTag("caption"), afe.clearToMarker(), parser2 = in_table_mode, !0;
      }
      switch (t2) {
        case 2:
          switch (value) {
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              if (end_caption())
                parser2(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          switch (value) {
            case "caption":
              end_caption();
              return;
            case "table":
              if (end_caption())
                parser2(t2, value, arg3, arg4);
              return;
            case "body":
            case "col":
            case "colgroup":
            case "html":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              return;
          }
          break;
      }
      in_body_mode(t2, value, arg3, arg4);
    }
    function in_column_group_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          var ws = value.match(LEADINGWS);
          if (ws)
            insertText(ws[0]), value = value.substring(ws[0].length);
          if (value.length === 0)
            return;
          break;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "col":
              insertHTMLElement(value, arg3), stack.pop();
              return;
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          switch (value) {
            case "colgroup":
              if (!isA(stack.top, "colgroup"))
                return;
              stack.pop(), parser2 = in_table_mode;
              return;
            case "col":
              return;
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
        case -1:
          in_body_mode(t2, value, arg3, arg4);
          return;
      }
      if (!isA(stack.top, "colgroup"))
        return;
      in_column_group_mode(ENDTAG, "colgroup"), parser2(t2, value, arg3, arg4);
    }
    function in_table_body_mode(t2, value, arg3, arg4) {
      function endsect() {
        if (!stack.inTableScope("tbody") && !stack.inTableScope("thead") && !stack.inTableScope("tfoot"))
          return;
        stack.clearToContext(tableBodyContextSet), in_table_body_mode(ENDTAG, stack.top.localName, null), parser2(t2, value, arg3, arg4);
      }
      switch (t2) {
        case 2:
          switch (value) {
            case "tr":
              stack.clearToContext(tableBodyContextSet), insertHTMLElement(value, arg3), parser2 = in_row_mode;
              return;
            case "th":
            case "td":
              in_table_body_mode(TAG, "tr", null), parser2(t2, value, arg3, arg4);
              return;
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "tfoot":
            case "thead":
              endsect();
              return;
          }
          break;
        case 3:
          switch (value) {
            case "table":
              endsect();
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              if (stack.inTableScope(value))
                stack.clearToContext(tableBodyContextSet), stack.pop(), parser2 = in_table_mode;
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
            case "td":
            case "th":
            case "tr":
              return;
          }
          break;
      }
      in_table_mode(t2, value, arg3, arg4);
    }
    function in_row_mode(t2, value, arg3, arg4) {
      function endrow() {
        if (!stack.inTableScope("tr"))
          return !1;
        return stack.clearToContext(tableRowContextSet), stack.pop(), parser2 = in_table_body_mode, !0;
      }
      switch (t2) {
        case 2:
          switch (value) {
            case "th":
            case "td":
              stack.clearToContext(tableRowContextSet), insertHTMLElement(value, arg3), parser2 = in_cell_mode, afe.insertMarker();
              return;
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
              if (endrow())
                parser2(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          switch (value) {
            case "tr":
              endrow();
              return;
            case "table":
              if (endrow())
                parser2(t2, value, arg3, arg4);
              return;
            case "tbody":
            case "tfoot":
            case "thead":
              if (stack.inTableScope(value)) {
                if (endrow())
                  parser2(t2, value, arg3, arg4);
              }
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
            case "td":
            case "th":
              return;
          }
          break;
      }
      in_table_mode(t2, value, arg3, arg4);
    }
    function in_cell_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 2:
          switch (value) {
            case "caption":
            case "col":
            case "colgroup":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
              if (stack.inTableScope("td"))
                in_cell_mode(ENDTAG, "td"), parser2(t2, value, arg3, arg4);
              else if (stack.inTableScope("th"))
                in_cell_mode(ENDTAG, "th"), parser2(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          switch (value) {
            case "td":
            case "th":
              if (!stack.inTableScope(value))
                return;
              stack.generateImpliedEndTags(), stack.popTag(value), afe.clearToMarker(), parser2 = in_row_mode;
              return;
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "html":
              return;
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
              if (!stack.inTableScope(value))
                return;
              in_cell_mode(ENDTAG, stack.inTableScope("td") ? "td" : "th"), parser2(t2, value, arg3, arg4);
              return;
          }
          break;
      }
      in_body_mode(t2, value, arg3, arg4);
    }
    function in_select_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (textIncludesNUL) {
            if (value = value.replace(NULCHARS, ""), value.length === 0)
              return;
          }
          insertText(value);
          return;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case -1:
          in_body_mode(t2, value, arg3, arg4);
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "option":
              if (stack.top instanceof impl.HTMLOptionElement)
                in_select_mode(ENDTAG, value);
              insertHTMLElement(value, arg3);
              return;
            case "optgroup":
              if (stack.top instanceof impl.HTMLOptionElement)
                in_select_mode(ENDTAG, "option");
              if (stack.top instanceof impl.HTMLOptGroupElement)
                in_select_mode(ENDTAG, value);
              insertHTMLElement(value, arg3);
              return;
            case "select":
              in_select_mode(ENDTAG, value);
              return;
            case "input":
            case "keygen":
            case "textarea":
              if (!stack.inSelectScope("select"))
                return;
              in_select_mode(ENDTAG, "select"), parser2(t2, value, arg3, arg4);
              return;
            case "script":
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          switch (value) {
            case "optgroup":
              if (stack.top instanceof impl.HTMLOptionElement && stack.elements[stack.elements.length - 2] instanceof impl.HTMLOptGroupElement)
                in_select_mode(ENDTAG, "option");
              if (stack.top instanceof impl.HTMLOptGroupElement)
                stack.pop();
              return;
            case "option":
              if (stack.top instanceof impl.HTMLOptionElement)
                stack.pop();
              return;
            case "select":
              if (!stack.inSelectScope(value))
                return;
              stack.popTag(value), resetInsertionMode();
              return;
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
      }
    }
    function in_select_in_table_mode(t2, value, arg3, arg4) {
      switch (value) {
        case "caption":
        case "table":
        case "tbody":
        case "tfoot":
        case "thead":
        case "tr":
        case "td":
        case "th":
          switch (t2) {
            case 2:
              in_select_in_table_mode(ENDTAG, "select"), parser2(t2, value, arg3, arg4);
              return;
            case 3:
              if (stack.inTableScope(value))
                in_select_in_table_mode(ENDTAG, "select"), parser2(t2, value, arg3, arg4);
              return;
          }
      }
      in_select_mode(t2, value, arg3, arg4);
    }
    function in_template_mode(t2, value, arg3, arg4) {
      function switchModeAndReprocess(mode) {
        parser2 = mode, templateInsertionModes[templateInsertionModes.length - 1] = parser2, parser2(t2, value, arg3, arg4);
      }
      switch (t2) {
        case 1:
        case 4:
        case 5:
          in_body_mode(t2, value, arg3, arg4);
          return;
        case -1:
          if (!stack.contains("template"))
            stopParsing();
          else
            stack.popTag("template"), afe.clearToMarker(), templateInsertionModes.pop(), resetInsertionMode(), parser2(t2, value, arg3, arg4);
          return;
        case 2:
          switch (value) {
            case "base":
            case "basefont":
            case "bgsound":
            case "link":
            case "meta":
            case "noframes":
            case "script":
            case "style":
            case "template":
            case "title":
              in_head_mode(t2, value, arg3, arg4);
              return;
            case "caption":
            case "colgroup":
            case "tbody":
            case "tfoot":
            case "thead":
              switchModeAndReprocess(in_table_mode);
              return;
            case "col":
              switchModeAndReprocess(in_column_group_mode);
              return;
            case "tr":
              switchModeAndReprocess(in_table_body_mode);
              return;
            case "td":
            case "th":
              switchModeAndReprocess(in_row_mode);
              return;
          }
          switchModeAndReprocess(in_body_mode);
          return;
        case 3:
          switch (value) {
            case "template":
              in_head_mode(t2, value, arg3, arg4);
              return;
            default:
              return;
          }
      }
    }
    function after_body_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (NONWS.test(value))
            break;
          in_body_mode(t2, value);
          return;
        case 4:
          stack.elements[0]._appendChild(doc2.createComment(value));
          return;
        case 5:
          return;
        case -1:
          stopParsing();
          return;
        case 2:
          if (value === "html") {
            in_body_mode(t2, value, arg3, arg4);
            return;
          }
          break;
        case 3:
          if (value === "html") {
            if (fragment)
              return;
            parser2 = after_after_body_mode;
            return;
          }
          break;
      }
      parser2 = in_body_mode, parser2(t2, value, arg3, arg4);
    }
    function in_frameset_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (value = value.replace(ALLNONWS, ""), value.length > 0)
            insertText(value);
          return;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case -1:
          stopParsing();
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "frameset":
              insertHTMLElement(value, arg3);
              return;
            case "frame":
              insertHTMLElement(value, arg3), stack.pop();
              return;
            case "noframes":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          if (value === "frameset") {
            if (fragment && stack.top instanceof impl.HTMLHtmlElement)
              return;
            if (stack.pop(), !fragment && !(stack.top instanceof impl.HTMLFrameSetElement))
              parser2 = after_frameset_mode;
            return;
          }
          break;
      }
    }
    function after_frameset_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (value = value.replace(ALLNONWS, ""), value.length > 0)
            insertText(value);
          return;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case -1:
          stopParsing();
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "noframes":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
        case 3:
          if (value === "html") {
            parser2 = after_after_frameset_mode;
            return;
          }
          break;
      }
    }
    function after_after_body_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (NONWS.test(value))
            break;
          in_body_mode(t2, value, arg3, arg4);
          return;
        case 4:
          doc2._appendChild(doc2.createComment(value));
          return;
        case 5:
          in_body_mode(t2, value, arg3, arg4);
          return;
        case -1:
          stopParsing();
          return;
        case 2:
          if (value === "html") {
            in_body_mode(t2, value, arg3, arg4);
            return;
          }
          break;
      }
      parser2 = in_body_mode, parser2(t2, value, arg3, arg4);
    }
    function after_after_frameset_mode(t2, value, arg3, arg4) {
      switch (t2) {
        case 1:
          if (value = value.replace(ALLNONWS, ""), value.length > 0)
            in_body_mode(t2, value, arg3, arg4);
          return;
        case 4:
          doc2._appendChild(doc2.createComment(value));
          return;
        case 5:
          in_body_mode(t2, value, arg3, arg4);
          return;
        case -1:
          stopParsing();
          return;
        case 2:
          switch (value) {
            case "html":
              in_body_mode(t2, value, arg3, arg4);
              return;
            case "noframes":
              in_head_mode(t2, value, arg3, arg4);
              return;
          }
          break;
      }
    }
    function insertForeignToken(t2, value, arg3, arg4) {
      function isHTMLFont(attrs) {
        for (var i6 = 0, n5 = attrs.length;i6 < n5; i6++)
          switch (attrs[i6][0]) {
            case "color":
            case "face":
            case "size":
              return !0;
          }
        return !1;
      }
      var current;
      switch (t2) {
        case 1:
          if (frameset_ok && NONWSNONNUL.test(value))
            frameset_ok = !1;
          if (textIncludesNUL)
            value = value.replace(NULCHARS, "\uFFFD");
          insertText(value);
          return;
        case 4:
          insertComment(value);
          return;
        case 5:
          return;
        case 2:
          switch (value) {
            case "font":
              if (!isHTMLFont(arg3))
                break;
            case "b":
            case "big":
            case "blockquote":
            case "body":
            case "br":
            case "center":
            case "code":
            case "dd":
            case "div":
            case "dl":
            case "dt":
            case "em":
            case "embed":
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
            case "head":
            case "hr":
            case "i":
            case "img":
            case "li":
            case "listing":
            case "menu":
            case "meta":
            case "nobr":
            case "ol":
            case "p":
            case "pre":
            case "ruby":
            case "s":
            case "small":
            case "span":
            case "strong":
            case "strike":
            case "sub":
            case "sup":
            case "table":
            case "tt":
            case "u":
            case "ul":
            case "var":
              if (fragment)
                break;
              do
                stack.pop(), current = stack.top;
              while (current.namespaceURI !== NAMESPACE.HTML && !isMathmlTextIntegrationPoint(current) && !isHTMLIntegrationPoint(current));
              insertToken(t2, value, arg3, arg4);
              return;
          }
          if (current = stack.elements.length === 1 && fragment ? fragmentContext : stack.top, current.namespaceURI === NAMESPACE.MATHML)
            adjustMathMLAttributes(arg3);
          else if (current.namespaceURI === NAMESPACE.SVG)
            value = adjustSVGTagName(value), adjustSVGAttributes(arg3);
          if (adjustForeignAttributes(arg3), insertForeignElement(value, arg3, current.namespaceURI), arg4) {
            if (value === "script" && current.namespaceURI === NAMESPACE.SVG)
              ;
            stack.pop();
          }
          return;
        case 3:
          if (current = stack.top, value === "script" && current.namespaceURI === NAMESPACE.SVG && current.localName === "script")
            stack.pop();
          else {
            var i5 = stack.elements.length - 1, node2 = stack.elements[i5];
            for (;; ) {
              if (node2.localName.toLowerCase() === value) {
                stack.popElement(node2);
                break;
              }
              if (node2 = stack.elements[--i5], node2.namespaceURI !== NAMESPACE.HTML)
                continue;
              parser2(t2, value, arg3, arg4);
              break;
            }
          }
          return;
      }
    }
    return htmlparser.testTokenizer = function(input, initialState, lastStartTag, charbychar) {
      var tokens = [];
      switch (initialState) {
        case "PCDATA state":
          tokenizer = data_state;
          break;
        case "RCDATA state":
          tokenizer = rcdata_state;
          break;
        case "RAWTEXT state":
          tokenizer = rawtext_state;
          break;
        case "PLAINTEXT state":
          tokenizer = plaintext_state;
          break;
      }
      if (lastStartTag)
        lasttagname = lastStartTag;
      if (insertToken = function(t2, value, arg3, arg4) {
        switch (flushText(), t2) {
          case 1:
            if (tokens.length > 0 && tokens[tokens.length - 1][0] === "Character")
              tokens[tokens.length - 1][1] += value;
            else
              tokens.push(["Character", value]);
            break;
          case 4:
            tokens.push(["Comment", value]);
            break;
          case 5:
            tokens.push([
              "DOCTYPE",
              value,
              arg3 === void 0 ? null : arg3,
              arg4 === void 0 ? null : arg4,
              !force_quirks
            ]);
            break;
          case 2:
            var attrs = Object.create(null);
            for (var i6 = 0;i6 < arg3.length; i6++) {
              var a2 = arg3[i6];
              if (a2.length === 1)
                attrs[a2[0]] = "";
              else
                attrs[a2[0]] = a2[1];
            }
            var token = ["StartTag", value, attrs];
            if (arg4)
              token.push(!0);
            tokens.push(token);
            break;
          case 3:
            tokens.push(["EndTag", value]);
            break;
          case -1:
            break;
        }
      }, !charbychar)
        this.parse(input, !0);
      else {
        for (var i5 = 0;i5 < input.length; i5++)
          this.parse(input[i5]);
        this.parse("", !0);
      }
      return tokens;
    }, htmlparser;
  }
});
