// var: require_htmlelts
var require_htmlelts = __commonJS((exports) => {
  var Node5 = require_Node2(), Element4 = require_Element(), CSSStyleDeclaration2 = require_CSSStyleDeclaration2(), utils = require_utils12(), URLUtils = require_URLUtils(), defineElement = require_defineElement(), htmlElements = exports.elements = {}, htmlNameToImpl = Object.create(null);
  exports.createElement = function(doc2, localName, prefix) {
    var impl = htmlNameToImpl[localName] || HTMLUnknownElement2;
    return new impl(doc2, localName, prefix);
  };
  function define2(spec) {
    return defineElement(spec, HTMLElement2, htmlElements, htmlNameToImpl);
  }
  function URL4(attr) {
    return {
      get: function() {
        var v2 = this._getattr(attr);
        if (v2 === null)
          return "";
        var url3 = this.doc._resolve(v2);
        return url3 === null ? v2 : url3;
      },
      set: function(value) {
        this._setattr(attr, value);
      }
    };
  }
  function CORS(attr) {
    return {
      get: function() {
        var v2 = this._getattr(attr);
        if (v2 === null)
          return null;
        if (v2.toLowerCase() === "use-credentials")
          return "use-credentials";
        return "anonymous";
      },
      set: function(value) {
        if (value === null || value === void 0)
          this.removeAttribute(attr);
        else
          this._setattr(attr, value);
      }
    };
  }
  var REFERRER = {
    type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"],
    missing: ""
  }, focusableElements = {
    A: !0,
    LINK: !0,
    BUTTON: !0,
    INPUT: !0,
    SELECT: !0,
    TEXTAREA: !0,
    COMMAND: !0
  }, HTMLFormElement2 = function(doc2, localName, prefix) {
    HTMLElement2.call(this, doc2, localName, prefix), this._form = null;
  }, HTMLElement2 = exports.HTMLElement = define2({
    superclass: Element4,
    name: "HTMLElement",
    ctor: function(doc2, localName, prefix) {
      Element4.call(this, doc2, localName, utils.NAMESPACE.HTML, prefix);
    },
    props: {
      dangerouslySetInnerHTML: {
        set: function(v2) {
          this._innerHTML = v2;
        }
      },
      innerHTML: {
        get: function() {
          return this.serialize();
        },
        set: function(v2) {
          var parser2 = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, this);
          parser2.parse(v2 === null ? "" : String(v2), !0);
          var target = this instanceof htmlNameToImpl.template ? this.content : this;
          while (target.hasChildNodes())
            target.removeChild(target.firstChild);
          target.appendChild(parser2._asDocumentFragment());
        }
      },
      style: { get: function() {
        if (!this._style)
          this._style = new CSSStyleDeclaration2(this);
        return this._style;
      }, set: function(v2) {
        if (v2 === null || v2 === void 0)
          v2 = "";
        this._setattr("style", String(v2));
      } },
      blur: { value: function() {} },
      focus: { value: function() {} },
      forceSpellCheck: { value: function() {} },
      click: { value: function() {
        if (this._click_in_progress)
          return;
        this._click_in_progress = !0;
        try {
          if (this._pre_click_activation_steps)
            this._pre_click_activation_steps();
          var event = this.ownerDocument.createEvent("MouseEvent");
          event.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
          var success2 = this.dispatchEvent(event);
          if (success2) {
            if (this._post_click_activation_steps)
              this._post_click_activation_steps(event);
          } else if (this._cancelled_activation_steps)
            this._cancelled_activation_steps();
        } finally {
          this._click_in_progress = !1;
        }
      } },
      submit: { value: utils.nyi }
    },
    attributes: {
      title: String,
      lang: String,
      dir: { type: ["ltr", "rtl", "auto"], missing: "" },
      draggable: { type: ["true", "false"], treatNullAsEmptyString: !0 },
      spellcheck: { type: ["true", "false"], missing: "" },
      enterKeyHint: { type: ["enter", "done", "go", "next", "previous", "search", "send"], missing: "" },
      autoCapitalize: { type: ["off", "on", "none", "sentences", "words", "characters"], missing: "" },
      autoFocus: Boolean,
      accessKey: String,
      nonce: String,
      hidden: Boolean,
      translate: { type: ["no", "yes"], missing: "" },
      tabIndex: { type: "long", default: function() {
        if (this.tagName in focusableElements || this.contentEditable)
          return 0;
        else
          return -1;
      } }
    },
    events: [
      "abort",
      "canplay",
      "canplaythrough",
      "change",
      "click",
      "contextmenu",
      "cuechange",
      "dblclick",
      "drag",
      "dragend",
      "dragenter",
      "dragleave",
      "dragover",
      "dragstart",
      "drop",
      "durationchange",
      "emptied",
      "ended",
      "input",
      "invalid",
      "keydown",
      "keypress",
      "keyup",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "mousedown",
      "mousemove",
      "mouseout",
      "mouseover",
      "mouseup",
      "mousewheel",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "readystatechange",
      "reset",
      "seeked",
      "seeking",
      "select",
      "show",
      "stalled",
      "submit",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting",
      "blur",
      "error",
      "focus",
      "load",
      "scroll"
    ]
  }), HTMLUnknownElement2 = define2({
    name: "HTMLUnknownElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    }
  }), formAssociatedProps = {
    form: { get: function() {
      return this._form;
    } }
  };
  define2({
    tag: "a",
    name: "HTMLAnchorElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      _post_click_activation_steps: { value: function(e) {
        if (this.href)
          this.ownerDocument.defaultView.location = this.href;
      } }
    },
    attributes: {
      href: URL4,
      ping: String,
      download: String,
      target: String,
      rel: String,
      media: String,
      hreflang: String,
      type: String,
      referrerPolicy: REFERRER,
      coords: String,
      charset: String,
      name: String,
      rev: String,
      shape: String
    }
  });
  URLUtils._inherit(htmlNameToImpl.a.prototype);
  define2({
    tag: "area",
    name: "HTMLAreaElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      alt: String,
      target: String,
      download: String,
      rel: String,
      media: String,
      href: URL4,
      hreflang: String,
      type: String,
      shape: String,
      coords: String,
      ping: String,
      referrerPolicy: REFERRER,
      noHref: Boolean
    }
  });
  URLUtils._inherit(htmlNameToImpl.area.prototype);
  define2({
    tag: "br",
    name: "HTMLBRElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      clear: String
    }
  });
  define2({
    tag: "base",
    name: "HTMLBaseElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      target: String
    }
  });
  define2({
    tag: "body",
    name: "HTMLBodyElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    events: [
      "afterprint",
      "beforeprint",
      "beforeunload",
      "blur",
      "error",
      "focus",
      "hashchange",
      "load",
      "message",
      "offline",
      "online",
      "pagehide",
      "pageshow",
      "popstate",
      "resize",
      "scroll",
      "storage",
      "unload"
    ],
    attributes: {
      text: { type: String, treatNullAsEmptyString: !0 },
      link: { type: String, treatNullAsEmptyString: !0 },
      vLink: { type: String, treatNullAsEmptyString: !0 },
      aLink: { type: String, treatNullAsEmptyString: !0 },
      bgColor: { type: String, treatNullAsEmptyString: !0 },
      background: String
    }
  });
  define2({
    tag: "button",
    name: "HTMLButtonElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      name: String,
      value: String,
      disabled: Boolean,
      autofocus: Boolean,
      type: { type: ["submit", "reset", "button", "menu"], missing: "submit" },
      formTarget: String,
      formAction: URL4,
      formNoValidate: Boolean,
      formMethod: { type: ["get", "post", "dialog"], invalid: "get", missing: "" },
      formEnctype: { type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "" }
    }
  });
  define2({
    tag: "dl",
    name: "HTMLDListElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      compact: Boolean
    }
  });
  define2({
    tag: "data",
    name: "HTMLDataElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      value: String
    }
  });
  define2({
    tag: "datalist",
    name: "HTMLDataListElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tag: "details",
    name: "HTMLDetailsElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      open: Boolean
    }
  });
  define2({
    tag: "div",
    name: "HTMLDivElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      align: String
    }
  });
  define2({
    tag: "embed",
    name: "HTMLEmbedElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      src: URL4,
      type: String,
      width: String,
      height: String,
      align: String,
      name: String
    }
  });
  define2({
    tag: "fieldset",
    name: "HTMLFieldSetElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      disabled: Boolean,
      name: String
    }
  });
  define2({
    tag: "form",
    name: "HTMLFormElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      action: String,
      autocomplete: { type: ["on", "off"], missing: "on" },
      name: String,
      acceptCharset: { name: "accept-charset" },
      target: String,
      noValidate: Boolean,
      method: { type: ["get", "post", "dialog"], invalid: "get", missing: "get" },
      enctype: { type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "application/x-www-form-urlencoded" },
      encoding: { name: "enctype", type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "application/x-www-form-urlencoded" }
    }
  });
  define2({
    tag: "hr",
    name: "HTMLHRElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      align: String,
      color: String,
      noShade: Boolean,
      size: String,
      width: String
    }
  });
  define2({
    tag: "head",
    name: "HTMLHeadElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    name: "HTMLHeadingElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      align: String
    }
  });
  define2({
    tag: "html",
    name: "HTMLHtmlElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      xmlns: URL4,
      version: String
    }
  });
  define2({
    tag: "iframe",
    name: "HTMLIFrameElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      src: URL4,
      srcdoc: String,
      name: String,
      width: String,
      height: String,
      seamless: Boolean,
      allow: Boolean,
      allowFullscreen: Boolean,
      allowUserMedia: Boolean,
      allowPaymentRequest: Boolean,
      referrerPolicy: REFERRER,
      loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
      align: String,
      scrolling: String,
      frameBorder: String,
      longDesc: URL4,
      marginHeight: { type: String, treatNullAsEmptyString: !0 },
      marginWidth: { type: String, treatNullAsEmptyString: !0 }
    }
  });
  define2({
    tag: "img",
    name: "HTMLImageElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      alt: String,
      src: URL4,
      srcset: String,
      crossOrigin: CORS,
      useMap: String,
      isMap: Boolean,
      sizes: String,
      height: { type: "unsigned long", default: 0 },
      width: { type: "unsigned long", default: 0 },
      referrerPolicy: REFERRER,
      loading: { type: ["eager", "lazy"], missing: "" },
      name: String,
      lowsrc: URL4,
      align: String,
      hspace: { type: "unsigned long", default: 0 },
      vspace: { type: "unsigned long", default: 0 },
      longDesc: URL4,
      border: { type: String, treatNullAsEmptyString: !0 }
    }
  });
  define2({
    tag: "input",
    name: "HTMLInputElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: {
      form: formAssociatedProps.form,
      _post_click_activation_steps: { value: function(e) {
        if (this.type === "checkbox")
          this.checked = !this.checked;
        else if (this.type === "radio") {
          var group = this.form.getElementsByName(this.name);
          for (var i5 = group.length - 1;i5 >= 0; i5--) {
            var el = group[i5];
            el.checked = el === this;
          }
        }
      } }
    },
    attributes: {
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      accept: String,
      alt: String,
      max: String,
      min: String,
      pattern: String,
      placeholder: String,
      step: String,
      dirName: String,
      defaultValue: { name: "value" },
      multiple: Boolean,
      required: Boolean,
      readOnly: Boolean,
      checked: Boolean,
      value: String,
      src: URL4,
      defaultChecked: { name: "checked", type: Boolean },
      size: { type: "unsigned long", default: 20, min: 1, setmin: 1 },
      width: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
      height: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
      minLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 },
      maxLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 },
      autocomplete: String,
      type: {
        type: [
          "text",
          "hidden",
          "search",
          "tel",
          "url",
          "email",
          "password",
          "datetime",
          "date",
          "month",
          "week",
          "time",
          "datetime-local",
          "number",
          "range",
          "color",
          "checkbox",
          "radio",
          "file",
          "submit",
          "image",
          "reset",
          "button"
        ],
        missing: "text"
      },
      formTarget: String,
      formNoValidate: Boolean,
      formMethod: { type: ["get", "post"], invalid: "get", missing: "" },
      formEnctype: { type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], invalid: "application/x-www-form-urlencoded", missing: "" },
      inputMode: { type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"], missing: "" },
      align: String,
      useMap: String
    }
  });
  define2({
    tag: "keygen",
    name: "HTMLKeygenElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      challenge: String,
      keytype: { type: ["rsa"], missing: "" }
    }
  });
  define2({
    tag: "li",
    name: "HTMLLIElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      value: { type: "long", default: 0 },
      type: String
    }
  });
  define2({
    tag: "label",
    name: "HTMLLabelElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      htmlFor: { name: "for", type: String }
    }
  });
  define2({
    tag: "legend",
    name: "HTMLLegendElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      align: String
    }
  });
  define2({
    tag: "link",
    name: "HTMLLinkElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      href: URL4,
      rel: String,
      media: String,
      hreflang: String,
      type: String,
      crossOrigin: CORS,
      nonce: String,
      integrity: String,
      referrerPolicy: REFERRER,
      imageSizes: String,
      imageSrcset: String,
      charset: String,
      rev: String,
      target: String
    }
  });
  define2({
    tag: "map",
    name: "HTMLMapElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      name: String
    }
  });
  define2({
    tag: "menu",
    name: "HTMLMenuElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
      label: String,
      compact: Boolean
    }
  });
  define2({
    tag: "meta",
    name: "HTMLMetaElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      name: String,
      content: String,
      httpEquiv: { name: "http-equiv", type: String },
      scheme: String
    }
  });
  define2({
    tag: "meter",
    name: "HTMLMeterElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps
  });
  define2({
    tags: ["ins", "del"],
    name: "HTMLModElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      cite: URL4,
      dateTime: String
    }
  });
  define2({
    tag: "ol",
    name: "HTMLOListElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      _numitems: { get: function() {
        var items = 0;
        return this.childNodes.forEach(function(n5) {
          if (n5.nodeType === Node5.ELEMENT_NODE && n5.tagName === "LI")
            items++;
        }), items;
      } }
    },
    attributes: {
      type: String,
      reversed: Boolean,
      start: {
        type: "long",
        default: function() {
          if (this.reversed)
            return this._numitems;
          else
            return 1;
        }
      },
      compact: Boolean
    }
  });
  define2({
    tag: "object",
    name: "HTMLObjectElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      data: URL4,
      type: String,
      name: String,
      useMap: String,
      typeMustMatch: Boolean,
      width: String,
      height: String,
      align: String,
      archive: String,
      code: String,
      declare: Boolean,
      hspace: { type: "unsigned long", default: 0 },
      standby: String,
      vspace: { type: "unsigned long", default: 0 },
      codeBase: URL4,
      codeType: String,
      border: { type: String, treatNullAsEmptyString: !0 }
    }
  });
  define2({
    tag: "optgroup",
    name: "HTMLOptGroupElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      disabled: Boolean,
      label: String
    }
  });
  define2({
    tag: "option",
    name: "HTMLOptionElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      form: { get: function() {
        var p4 = this.parentNode;
        while (p4 && p4.nodeType === Node5.ELEMENT_NODE) {
          if (p4.localName === "select")
            return p4.form;
          p4 = p4.parentNode;
        }
      } },
      value: {
        get: function() {
          return this._getattr("value") || this.text;
        },
        set: function(v2) {
          this._setattr("value", v2);
        }
      },
      text: {
        get: function() {
          return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
        },
        set: function(v2) {
          this.textContent = v2;
        }
      }
    },
    attributes: {
      disabled: Boolean,
      defaultSelected: { name: "selected", type: Boolean },
      label: String
    }
  });
  define2({
    tag: "output",
    name: "HTMLOutputElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      name: String
    }
  });
  define2({
    tag: "p",
    name: "HTMLParagraphElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      align: String
    }
  });
  define2({
    tag: "param",
    name: "HTMLParamElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      name: String,
      value: String,
      type: String,
      valueType: String
    }
  });
  define2({
    tags: ["pre", "listing", "xmp"],
    name: "HTMLPreElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      width: { type: "long", default: 0 }
    }
  });
  define2({
    tag: "progress",
    name: "HTMLProgressElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: formAssociatedProps,
    attributes: {
      max: { type: Number, float: !0, default: 1, min: 0 }
    }
  });
  define2({
    tags: ["q", "blockquote"],
    name: "HTMLQuoteElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      cite: URL4
    }
  });
  define2({
    tag: "script",
    name: "HTMLScriptElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      text: {
        get: function() {
          var s2 = "";
          for (var i5 = 0, n5 = this.childNodes.length;i5 < n5; i5++) {
            var child = this.childNodes[i5];
            if (child.nodeType === Node5.TEXT_NODE)
              s2 += child._data;
          }
          return s2;
        },
        set: function(value) {
          if (this.removeChildren(), value !== null && value !== "")
            this.appendChild(this.ownerDocument.createTextNode(value));
        }
      }
    },
    attributes: {
      src: URL4,
      type: String,
      charset: String,
      referrerPolicy: REFERRER,
      defer: Boolean,
      async: Boolean,
      nomodule: Boolean,
      crossOrigin: CORS,
      nonce: String,
      integrity: String
    }
  });
  define2({
    tag: "select",
    name: "HTMLSelectElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: {
      form: formAssociatedProps.form,
      options: { get: function() {
        return this.getElementsByTagName("option");
      } }
    },
    attributes: {
      autocomplete: String,
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      multiple: Boolean,
      required: Boolean,
      size: { type: "unsigned long", default: 0 }
    }
  });
  define2({
    tag: "span",
    name: "HTMLSpanElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tag: "style",
    name: "HTMLStyleElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      media: String,
      type: String,
      scoped: Boolean
    }
  });
  define2({
    tag: "caption",
    name: "HTMLTableCaptionElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      align: String
    }
  });
  define2({
    name: "HTMLTableCellElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      colSpan: { type: "unsigned long", default: 1 },
      rowSpan: { type: "unsigned long", default: 1 },
      scope: { type: ["row", "col", "rowgroup", "colgroup"], missing: "" },
      abbr: String,
      align: String,
      axis: String,
      height: String,
      width: String,
      ch: { name: "char", type: String },
      chOff: { name: "charoff", type: String },
      noWrap: Boolean,
      vAlign: String,
      bgColor: { type: String, treatNullAsEmptyString: !0 }
    }
  });
  define2({
    tags: ["col", "colgroup"],
    name: "HTMLTableColElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      span: { type: "limited unsigned long with fallback", default: 1, min: 1 },
      align: String,
      ch: { name: "char", type: String },
      chOff: { name: "charoff", type: String },
      vAlign: String,
      width: String
    }
  });
  define2({
    tag: "table",
    name: "HTMLTableElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      rows: { get: function() {
        return this.getElementsByTagName("tr");
      } }
    },
    attributes: {
      align: String,
      border: String,
      frame: String,
      rules: String,
      summary: String,
      width: String,
      bgColor: { type: String, treatNullAsEmptyString: !0 },
      cellPadding: { type: String, treatNullAsEmptyString: !0 },
      cellSpacing: { type: String, treatNullAsEmptyString: !0 }
    }
  });
  define2({
    tag: "template",
    name: "HTMLTemplateElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix), this._contentFragment = doc2._templateDoc.createDocumentFragment();
    },
    props: {
      content: { get: function() {
        return this._contentFragment;
      } },
      serialize: { value: function() {
        return this.content.serialize();
      } }
    }
  });
  define2({
    tag: "tr",
    name: "HTMLTableRowElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      cells: { get: function() {
        return this.querySelectorAll("td,th");
      } }
    },
    attributes: {
      align: String,
      ch: { name: "char", type: String },
      chOff: { name: "charoff", type: String },
      vAlign: String,
      bgColor: { type: String, treatNullAsEmptyString: !0 }
    }
  });
  define2({
    tags: ["thead", "tfoot", "tbody"],
    name: "HTMLTableSectionElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      rows: { get: function() {
        return this.getElementsByTagName("tr");
      } }
    },
    attributes: {
      align: String,
      ch: { name: "char", type: String },
      chOff: { name: "charoff", type: String },
      vAlign: String
    }
  });
  define2({
    tag: "textarea",
    name: "HTMLTextAreaElement",
    ctor: function(doc2, localName, prefix) {
      HTMLFormElement2.call(this, doc2, localName, prefix);
    },
    props: {
      form: formAssociatedProps.form,
      type: { get: function() {
        return "textarea";
      } },
      defaultValue: {
        get: function() {
          return this.textContent;
        },
        set: function(v2) {
          this.textContent = v2;
        }
      },
      value: {
        get: function() {
          return this.defaultValue;
        },
        set: function(v2) {
          this.defaultValue = v2;
        }
      },
      textLength: { get: function() {
        return this.value.length;
      } }
    },
    attributes: {
      autocomplete: String,
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      placeholder: String,
      wrap: String,
      dirName: String,
      required: Boolean,
      readOnly: Boolean,
      rows: { type: "limited unsigned long with fallback", default: 2 },
      cols: { type: "limited unsigned long with fallback", default: 20 },
      maxLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 },
      minLength: { type: "unsigned long", min: 0, setmin: 0, default: -1 },
      inputMode: { type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"], missing: "" }
    }
  });
  define2({
    tag: "time",
    name: "HTMLTimeElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      dateTime: String,
      pubDate: Boolean
    }
  });
  define2({
    tag: "title",
    name: "HTMLTitleElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      text: { get: function() {
        return this.textContent;
      } }
    }
  });
  define2({
    tag: "ul",
    name: "HTMLUListElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      type: String,
      compact: Boolean
    }
  });
  define2({
    name: "HTMLMediaElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      src: URL4,
      crossOrigin: CORS,
      preload: { type: ["metadata", "none", "auto", { value: "", alias: "auto" }], missing: "auto" },
      loop: Boolean,
      autoplay: Boolean,
      mediaGroup: String,
      controls: Boolean,
      defaultMuted: { name: "muted", type: Boolean }
    }
  });
  define2({
    name: "HTMLAudioElement",
    tag: "audio",
    superclass: htmlElements.HTMLMediaElement,
    ctor: function(doc2, localName, prefix) {
      htmlElements.HTMLMediaElement.call(this, doc2, localName, prefix);
    }
  });
  define2({
    name: "HTMLVideoElement",
    tag: "video",
    superclass: htmlElements.HTMLMediaElement,
    ctor: function(doc2, localName, prefix) {
      htmlElements.HTMLMediaElement.call(this, doc2, localName, prefix);
    },
    attributes: {
      poster: URL4,
      width: { type: "unsigned long", min: 0, default: 0 },
      height: { type: "unsigned long", min: 0, default: 0 }
    }
  });
  define2({
    tag: "td",
    name: "HTMLTableDataCellElement",
    superclass: htmlElements.HTMLTableCellElement,
    ctor: function(doc2, localName, prefix) {
      htmlElements.HTMLTableCellElement.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tag: "th",
    name: "HTMLTableHeaderCellElement",
    superclass: htmlElements.HTMLTableCellElement,
    ctor: function(doc2, localName, prefix) {
      htmlElements.HTMLTableCellElement.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tag: "frameset",
    name: "HTMLFrameSetElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tag: "frame",
    name: "HTMLFrameElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    }
  });
  define2({
    tag: "canvas",
    name: "HTMLCanvasElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      getContext: { value: utils.nyi },
      probablySupportsContext: { value: utils.nyi },
      setContext: { value: utils.nyi },
      transferControlToProxy: { value: utils.nyi },
      toDataURL: { value: utils.nyi },
      toBlob: { value: utils.nyi }
    },
    attributes: {
      width: { type: "unsigned long", default: 300 },
      height: { type: "unsigned long", default: 150 }
    }
  });
  define2({
    tag: "dialog",
    name: "HTMLDialogElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      show: { value: utils.nyi },
      showModal: { value: utils.nyi },
      close: { value: utils.nyi }
    },
    attributes: {
      open: Boolean,
      returnValue: String
    }
  });
  define2({
    tag: "menuitem",
    name: "HTMLMenuItemElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    props: {
      _label: {
        get: function() {
          var val = this._getattr("label");
          if (val !== null && val !== "")
            return val;
          return val = this.textContent, val.replace(/[ \t\n\f\r]+/g, " ").trim();
        }
      },
      label: {
        get: function() {
          var val = this._getattr("label");
          if (val !== null)
            return val;
          return this._label;
        },
        set: function(v2) {
          this._setattr("label", v2);
        }
      }
    },
    attributes: {
      type: { type: ["command", "checkbox", "radio"], missing: "command" },
      icon: URL4,
      disabled: Boolean,
      checked: Boolean,
      radiogroup: String,
      default: Boolean
    }
  });
  define2({
    tag: "source",
    name: "HTMLSourceElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      srcset: String,
      sizes: String,
      media: String,
      src: URL4,
      type: String,
      width: String,
      height: String
    }
  });
  define2({
    tag: "track",
    name: "HTMLTrackElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      src: URL4,
      srclang: String,
      label: String,
      default: Boolean,
      kind: { type: ["subtitles", "captions", "descriptions", "chapters", "metadata"], missing: "subtitles", invalid: "metadata" }
    },
    props: {
      NONE: { get: function() {
        return 0;
      } },
      LOADING: { get: function() {
        return 1;
      } },
      LOADED: { get: function() {
        return 2;
      } },
      ERROR: { get: function() {
        return 3;
      } },
      readyState: { get: utils.nyi },
      track: { get: utils.nyi }
    }
  });
  define2({
    tag: "font",
    name: "HTMLFontElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      color: { type: String, treatNullAsEmptyString: !0 },
      face: { type: String },
      size: { type: String }
    }
  });
  define2({
    tag: "dir",
    name: "HTMLDirectoryElement",
    ctor: function(doc2, localName, prefix) {
      HTMLElement2.call(this, doc2, localName, prefix);
    },
    attributes: {
      compact: Boolean
    }
  });
  define2({
    tags: [
      "abbr",
      "address",
      "article",
      "aside",
      "b",
      "bdi",
      "bdo",
      "cite",
      "content",
      "code",
      "dd",
      "dfn",
      "dt",
      "em",
      "figcaption",
      "figure",
      "footer",
      "header",
      "hgroup",
      "i",
      "kbd",
      "main",
      "mark",
      "nav",
      "noscript",
      "rb",
      "rp",
      "rt",
      "rtc",
      "ruby",
      "s",
      "samp",
      "section",
      "small",
      "strong",
      "sub",
      "summary",
      "sup",
      "u",
      "var",
      "wbr",
      "acronym",
      "basefont",
      "big",
      "center",
      "nobr",
      "noembed",
      "noframes",
      "plaintext",
      "strike",
      "tt"
    ]
  });
});
