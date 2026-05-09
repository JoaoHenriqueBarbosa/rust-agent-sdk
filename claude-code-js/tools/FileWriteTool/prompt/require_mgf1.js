// var: require_mgf1
var require_mgf1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  forge.mgf = forge.mgf || {};
  var mgf1 = module.exports = forge.mgf.mgf1 = forge.mgf1 = forge.mgf1 || {};
  mgf1.create = function(md) {
    var mgf = {
      generate: function(seed, maskLen) {
        var t2 = new forge.util.ByteBuffer, len = Math.ceil(maskLen / md.digestLength);
        for (var i5 = 0;i5 < len; i5++) {
          var c3 = new forge.util.ByteBuffer;
          c3.putInt32(i5), md.start(), md.update(seed + c3.getBytes()), t2.putBuffer(md.digest());
        }
        return t2.truncate(t2.length() - maskLen), t2.getBytes();
      }
    };
    return mgf;
  };
});
