// var: require_hmac
var require_hmac = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util3();
  var hmac2 = module.exports = forge.hmac = forge.hmac || {};
  hmac2.create = function() {
    var _key = null, _md = null, _ipadding = null, _opadding = null, ctx = {};
    return ctx.start = function(md, key2) {
      if (md !== null)
        if (typeof md === "string")
          if (md = md.toLowerCase(), md in forge.md.algorithms)
            _md = forge.md.algorithms[md].create();
          else
            throw Error('Unknown hash algorithm "' + md + '"');
        else
          _md = md;
      if (key2 === null)
        key2 = _key;
      else {
        if (typeof key2 === "string")
          key2 = forge.util.createBuffer(key2);
        else if (forge.util.isArray(key2)) {
          var tmp = key2;
          key2 = forge.util.createBuffer();
          for (var i5 = 0;i5 < tmp.length; ++i5)
            key2.putByte(tmp[i5]);
        }
        var keylen = key2.length();
        if (keylen > _md.blockLength)
          _md.start(), _md.update(key2.bytes()), key2 = _md.digest();
        _ipadding = forge.util.createBuffer(), _opadding = forge.util.createBuffer(), keylen = key2.length();
        for (var i5 = 0;i5 < keylen; ++i5) {
          var tmp = key2.at(i5);
          _ipadding.putByte(54 ^ tmp), _opadding.putByte(92 ^ tmp);
        }
        if (keylen < _md.blockLength) {
          var tmp = _md.blockLength - keylen;
          for (var i5 = 0;i5 < tmp; ++i5)
            _ipadding.putByte(54), _opadding.putByte(92);
        }
        _key = key2, _ipadding = _ipadding.bytes(), _opadding = _opadding.bytes();
      }
      _md.start(), _md.update(_ipadding);
    }, ctx.update = function(bytes) {
      _md.update(bytes);
    }, ctx.getMac = function() {
      var inner = _md.digest().bytes();
      return _md.start(), _md.update(_opadding), _md.update(inner), _md.digest();
    }, ctx.digest = ctx.getMac, ctx;
  };
});
