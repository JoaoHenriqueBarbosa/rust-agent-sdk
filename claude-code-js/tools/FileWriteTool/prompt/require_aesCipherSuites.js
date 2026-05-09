// var: require_aesCipherSuites
var require_aesCipherSuites = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_tls();
  var tls = module.exports = forge.tls;
  tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
    id: [0, 47],
    name: "TLS_RSA_WITH_AES_128_CBC_SHA",
    initSecurityParameters: function(sp) {
      sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes, sp.cipher_type = tls.CipherType.block, sp.enc_key_length = 16, sp.block_length = 16, sp.fixed_iv_length = 16, sp.record_iv_length = 16, sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1, sp.mac_length = 20, sp.mac_key_length = 20;
    },
    initConnectionState
  };
  tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
    id: [0, 53],
    name: "TLS_RSA_WITH_AES_256_CBC_SHA",
    initSecurityParameters: function(sp) {
      sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes, sp.cipher_type = tls.CipherType.block, sp.enc_key_length = 32, sp.block_length = 16, sp.fixed_iv_length = 16, sp.record_iv_length = 16, sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1, sp.mac_length = 20, sp.mac_key_length = 20;
    },
    initConnectionState
  };
  function initConnectionState(state3, c3, sp) {
    var client15 = c3.entity === forge.tls.ConnectionEnd.client;
    state3.read.cipherState = {
      init: !1,
      cipher: forge.cipher.createDecipher("AES-CBC", client15 ? sp.keys.server_write_key : sp.keys.client_write_key),
      iv: client15 ? sp.keys.server_write_IV : sp.keys.client_write_IV
    }, state3.write.cipherState = {
      init: !1,
      cipher: forge.cipher.createCipher("AES-CBC", client15 ? sp.keys.client_write_key : sp.keys.server_write_key),
      iv: client15 ? sp.keys.client_write_IV : sp.keys.server_write_IV
    }, state3.read.cipherFunction = decrypt_aes_cbc_sha1, state3.write.cipherFunction = encrypt_aes_cbc_sha1, state3.read.macLength = state3.write.macLength = sp.mac_length, state3.read.macFunction = state3.write.macFunction = tls.hmac_sha1;
  }
  function encrypt_aes_cbc_sha1(record2, s2) {
    var rval = !1, mac = s2.macFunction(s2.macKey, s2.sequenceNumber, record2);
    record2.fragment.putBytes(mac), s2.updateSequenceNumber();
    var iv;
    if (record2.version.minor === tls.Versions.TLS_1_0.minor)
      iv = s2.cipherState.init ? null : s2.cipherState.iv;
    else
      iv = forge.random.getBytesSync(16);
    s2.cipherState.init = !0;
    var cipher = s2.cipherState.cipher;
    if (cipher.start({ iv }), record2.version.minor >= tls.Versions.TLS_1_1.minor)
      cipher.output.putBytes(iv);
    if (cipher.update(record2.fragment), cipher.finish(encrypt_aes_cbc_sha1_padding))
      record2.fragment = cipher.output, record2.length = record2.fragment.length(), rval = !0;
    return rval;
  }
  function encrypt_aes_cbc_sha1_padding(blockSize, input, decrypt) {
    if (!decrypt) {
      var padding = blockSize - input.length() % blockSize;
      input.fillWithByte(padding - 1, padding);
    }
    return !0;
  }
  function decrypt_aes_cbc_sha1_padding(blockSize, output, decrypt) {
    var rval = !0;
    if (decrypt) {
      var len = output.length(), paddingLength = output.last();
      for (var i5 = len - 1 - paddingLength;i5 < len - 1; ++i5)
        rval = rval && output.at(i5) == paddingLength;
      if (rval)
        output.truncate(paddingLength + 1);
    }
    return rval;
  }
  function decrypt_aes_cbc_sha1(record2, s2) {
    var rval = !1, iv;
    if (record2.version.minor === tls.Versions.TLS_1_0.minor)
      iv = s2.cipherState.init ? null : s2.cipherState.iv;
    else
      iv = record2.fragment.getBytes(16);
    s2.cipherState.init = !0;
    var cipher = s2.cipherState.cipher;
    cipher.start({ iv }), cipher.update(record2.fragment), rval = cipher.finish(decrypt_aes_cbc_sha1_padding);
    var macLen = s2.macLength, mac = forge.random.getBytesSync(macLen), len = cipher.output.length();
    if (len >= macLen)
      record2.fragment = cipher.output.getBytes(len - macLen), mac = cipher.output.getBytes(macLen);
    else
      record2.fragment = cipher.output.getBytes();
    record2.fragment = forge.util.createBuffer(record2.fragment), record2.length = record2.fragment.length();
    var mac2 = s2.macFunction(s2.macKey, s2.sequenceNumber, record2);
    return s2.updateSequenceNumber(), rval = compareMacs(s2.macKey, mac, mac2) && rval, rval;
  }
  function compareMacs(key2, mac1, mac2) {
    var hmac2 = forge.hmac.create();
    return hmac2.start("SHA1", key2), hmac2.update(mac1), mac1 = hmac2.digest().getBytes(), hmac2.start(null, null), hmac2.update(mac2), mac2 = hmac2.digest().getBytes(), mac1 === mac2;
  }
});
