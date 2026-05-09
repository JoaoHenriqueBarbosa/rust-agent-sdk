// var: require_pki
var require_pki = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_oids();
  require_pbe();
  require_pem();
  require_pbkdf2();
  require_pkcs12();
  require_pss();
  require_rsa();
  require_util3();
  require_x509();
  var asn1 = forge.asn1, pki = module.exports = forge.pki = forge.pki || {};
  pki.pemToDer = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert PEM to DER; PEM is encrypted.");
    return forge.util.createBuffer(msg.body);
  };
  pki.privateKeyFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
      var error44 = Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
      throw error44.headerType = msg.type, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert private key from PEM; PEM is encrypted.");
    var obj = asn1.fromDer(msg.body);
    return pki.privateKeyFromAsn1(obj);
  };
  pki.privateKeyToPem = function(key2, maxline) {
    var msg = {
      type: "RSA PRIVATE KEY",
      body: asn1.toDer(pki.privateKeyToAsn1(key2)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.privateKeyInfoToPem = function(pki2, maxline) {
    var msg = {
      type: "PRIVATE KEY",
      body: asn1.toDer(pki2).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
});
