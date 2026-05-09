// var: require_svg
var require_svg = __commonJS((exports) => {
  var Element4 = require_Element(), defineElement = require_defineElement(), utils = require_utils12(), CSSStyleDeclaration2 = require_CSSStyleDeclaration2(), svgElements = exports.elements = {}, svgNameToImpl = Object.create(null);
  exports.createElement = function(doc2, localName, prefix) {
    var impl = svgNameToImpl[localName] || SVGElement3;
    return new impl(doc2, localName, prefix);
  };
  function define2(spec) {
    return defineElement(spec, SVGElement3, svgElements, svgNameToImpl);
  }
  var SVGElement3 = define2({
    superclass: Element4,
    name: "SVGElement",
    ctor: function(doc2, localName, prefix) {
      Element4.call(this, doc2, localName, utils.NAMESPACE.SVG, prefix);
    },
    props: {
      style: { get: function() {
        if (!this._style)
          this._style = new CSSStyleDeclaration2(this);
        return this._style;
      } }
    }
  });
  define2({
    name: "SVGSVGElement",
    ctor: function(doc2, localName, prefix) {
      SVGElement3.call(this, doc2, localName, prefix);
    },
    tag: "svg",
    props: {
      createSVGRect: { value: function() {
        return exports.createElement(this.ownerDocument, "rect", null);
      } }
    }
  });
  define2({
    tags: [
      "a",
      "altGlyph",
      "altGlyphDef",
      "altGlyphItem",
      "animate",
      "animateColor",
      "animateMotion",
      "animateTransform",
      "circle",
      "clipPath",
      "color-profile",
      "cursor",
      "defs",
      "desc",
      "ellipse",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "filter",
      "font",
      "font-face",
      "font-face-format",
      "font-face-name",
      "font-face-src",
      "font-face-uri",
      "foreignObject",
      "g",
      "glyph",
      "glyphRef",
      "hkern",
      "image",
      "line",
      "linearGradient",
      "marker",
      "mask",
      "metadata",
      "missing-glyph",
      "mpath",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialGradient",
      "rect",
      "script",
      "set",
      "stop",
      "style",
      "switch",
      "symbol",
      "text",
      "textPath",
      "title",
      "tref",
      "tspan",
      "use",
      "view",
      "vkern"
    ]
  });
});
