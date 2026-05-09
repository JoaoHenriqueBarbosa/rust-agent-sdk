// var: require_defineElement
var require_defineElement = __commonJS((exports, module) => {
  var attributes2 = require_attributes2(), isApiWritable = require_config().isApiWritable;
  module.exports = function(spec, defaultConstructor, tagList, tagNameToImpl) {
    var c3 = spec.ctor;
    if (c3) {
      var props = spec.props || {};
      if (spec.attributes)
        for (var n5 in spec.attributes) {
          var attr = spec.attributes[n5];
          if (typeof attr !== "object" || Array.isArray(attr))
            attr = { type: attr };
          if (!attr.name)
            attr.name = n5.toLowerCase();
          props[n5] = attributes2.property(attr);
        }
      if (props.constructor = { value: c3, writable: isApiWritable }, c3.prototype = Object.create((spec.superclass || defaultConstructor).prototype, props), spec.events)
        addEventHandlers(c3, spec.events);
      tagList[spec.name] = c3;
    } else
      c3 = defaultConstructor;
    return (spec.tags || spec.tag && [spec.tag] || []).forEach(function(tag2) {
      tagNameToImpl[tag2] = c3;
    }), c3;
  };
  function EventHandlerBuilder(body, document2, form, element) {
    this.body = body, this.document = document2, this.form = form, this.element = element;
  }
  EventHandlerBuilder.prototype.build = function() {
    return () => {};
  };
  function EventHandlerChangeHandler(elt, name3, oldval, newval) {
    var doc2 = elt.ownerDocument || Object.create(null), form = elt.form || Object.create(null);
    elt[name3] = new EventHandlerBuilder(newval, doc2, form, elt).build();
  }
  function addEventHandlers(c3, eventHandlerTypes) {
    var p4 = c3.prototype;
    eventHandlerTypes.forEach(function(type) {
      Object.defineProperty(p4, "on" + type, {
        get: function() {
          return this._getEventHandler(type);
        },
        set: function(v2) {
          this._setEventHandler(type, v2);
        }
      }), attributes2.registerChangeHandler(c3, "on" + type, EventHandlerChangeHandler);
    });
  }
});
