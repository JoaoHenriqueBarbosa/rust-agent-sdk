// var: require_tls
var require_tls = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_hmac();
  require_md53();
  require_pem();
  require_pki();
  require_random();
  require_sha13();
  require_util3();
  var prf_TLS1 = function(secret, label, seed, length) {
    var rval = forge.util.createBuffer(), idx = secret.length >> 1, slen = idx + (secret.length & 1), s1 = secret.substr(0, slen), s2 = secret.substr(idx, slen), ai = forge.util.createBuffer(), hmac2 = forge.hmac.create();
    seed = label + seed;
    var md5itr = Math.ceil(length / 16), sha1itr = Math.ceil(length / 20);
    hmac2.start("MD5", s1);
    var md5bytes = forge.util.createBuffer();
    ai.putBytes(seed);
    for (var i5 = 0;i5 < md5itr; ++i5)
      hmac2.start(null, null), hmac2.update(ai.getBytes()), ai.putBuffer(hmac2.digest()), hmac2.start(null, null), hmac2.update(ai.bytes() + seed), md5bytes.putBuffer(hmac2.digest());
    hmac2.start("SHA1", s2);
    var sha1bytes = forge.util.createBuffer();
    ai.clear(), ai.putBytes(seed);
    for (var i5 = 0;i5 < sha1itr; ++i5)
      hmac2.start(null, null), hmac2.update(ai.getBytes()), ai.putBuffer(hmac2.digest()), hmac2.start(null, null), hmac2.update(ai.bytes() + seed), sha1bytes.putBuffer(hmac2.digest());
    return rval.putBytes(forge.util.xorBytes(md5bytes.getBytes(), sha1bytes.getBytes(), length)), rval;
  }, hmac_sha1 = function(key3, seqNum, record2) {
    var hmac2 = forge.hmac.create();
    hmac2.start("SHA1", key3);
    var b = forge.util.createBuffer();
    return b.putInt32(seqNum[0]), b.putInt32(seqNum[1]), b.putByte(record2.type), b.putByte(record2.version.major), b.putByte(record2.version.minor), b.putInt16(record2.length), b.putBytes(record2.fragment.bytes()), hmac2.update(b.getBytes()), hmac2.digest().getBytes();
  }, deflate2 = function(c3, record2, s2) {
    var rval = !1;
    try {
      var bytes = c3.deflate(record2.fragment.getBytes());
      record2.fragment = forge.util.createBuffer(bytes), record2.length = bytes.length, rval = !0;
    } catch (ex) {}
    return rval;
  }, inflate2 = function(c3, record2, s2) {
    var rval = !1;
    try {
      var bytes = c3.inflate(record2.fragment.getBytes());
      record2.fragment = forge.util.createBuffer(bytes), record2.length = bytes.length, rval = !0;
    } catch (ex) {}
    return rval;
  }, readVector = function(b, lenBytes) {
    var len = 0;
    switch (lenBytes) {
      case 1:
        len = b.getByte();
        break;
      case 2:
        len = b.getInt16();
        break;
      case 3:
        len = b.getInt24();
        break;
      case 4:
        len = b.getInt32();
        break;
    }
    return forge.util.createBuffer(b.getBytes(len));
  }, writeVector = function(b, lenBytes, v2) {
    b.putInt(v2.length(), lenBytes << 3), b.putBuffer(v2);
  }, tls = {};
  tls.Versions = {
    TLS_1_0: { major: 3, minor: 1 },
    TLS_1_1: { major: 3, minor: 2 },
    TLS_1_2: { major: 3, minor: 3 }
  };
  tls.SupportedVersions = [
    tls.Versions.TLS_1_1,
    tls.Versions.TLS_1_0
  ];
  tls.Version = tls.SupportedVersions[0];
  tls.MaxFragment = 15360;
  tls.ConnectionEnd = {
    server: 0,
    client: 1
  };
  tls.PRFAlgorithm = {
    tls_prf_sha256: 0
  };
  tls.BulkCipherAlgorithm = {
    none: null,
    rc4: 0,
    des3: 1,
    aes: 2
  };
  tls.CipherType = {
    stream: 0,
    block: 1,
    aead: 2
  };
  tls.MACAlgorithm = {
    none: null,
    hmac_md5: 0,
    hmac_sha1: 1,
    hmac_sha256: 2,
    hmac_sha384: 3,
    hmac_sha512: 4
  };
  tls.CompressionMethod = {
    none: 0,
    deflate: 1
  };
  tls.ContentType = {
    change_cipher_spec: 20,
    alert: 21,
    handshake: 22,
    application_data: 23,
    heartbeat: 24
  };
  tls.HandshakeType = {
    hello_request: 0,
    client_hello: 1,
    server_hello: 2,
    certificate: 11,
    server_key_exchange: 12,
    certificate_request: 13,
    server_hello_done: 14,
    certificate_verify: 15,
    client_key_exchange: 16,
    finished: 20
  };
  tls.Alert = {};
  tls.Alert.Level = {
    warning: 1,
    fatal: 2
  };
  tls.Alert.Description = {
    close_notify: 0,
    unexpected_message: 10,
    bad_record_mac: 20,
    decryption_failed: 21,
    record_overflow: 22,
    decompression_failure: 30,
    handshake_failure: 40,
    bad_certificate: 42,
    unsupported_certificate: 43,
    certificate_revoked: 44,
    certificate_expired: 45,
    certificate_unknown: 46,
    illegal_parameter: 47,
    unknown_ca: 48,
    access_denied: 49,
    decode_error: 50,
    decrypt_error: 51,
    export_restriction: 60,
    protocol_version: 70,
    insufficient_security: 71,
    internal_error: 80,
    user_canceled: 90,
    no_renegotiation: 100
  };
  tls.HeartbeatMessageType = {
    heartbeat_request: 1,
    heartbeat_response: 2
  };
  tls.CipherSuites = {};
  tls.getCipherSuite = function(twoBytes) {
    var rval = null;
    for (var key3 in tls.CipherSuites) {
      var cs = tls.CipherSuites[key3];
      if (cs.id[0] === twoBytes.charCodeAt(0) && cs.id[1] === twoBytes.charCodeAt(1)) {
        rval = cs;
        break;
      }
    }
    return rval;
  };
  tls.handleUnexpected = function(c3, record2) {
    var ignore2 = !c3.open && c3.entity === tls.ConnectionEnd.client;
    if (!ignore2)
      c3.error(c3, {
        message: "Unexpected message. Received TLS record out of order.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unexpected_message
        }
      });
  };
  tls.handleHelloRequest = function(c3, record2, length) {
    if (!c3.handshaking && c3.handshakes > 0)
      tls.queue(c3, tls.createAlert(c3, {
        level: tls.Alert.Level.warning,
        description: tls.Alert.Description.no_renegotiation
      })), tls.flush(c3);
    c3.process();
  };
  tls.parseHelloMessage = function(c3, record2, length) {
    var msg = null, client15 = c3.entity === tls.ConnectionEnd.client;
    if (length < 38)
      c3.error(c3, {
        message: client15 ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    else {
      var b = record2.fragment, remaining = b.length();
      if (msg = {
        version: {
          major: b.getByte(),
          minor: b.getByte()
        },
        random: forge.util.createBuffer(b.getBytes(32)),
        session_id: readVector(b, 1),
        extensions: []
      }, client15)
        msg.cipher_suite = b.getBytes(2), msg.compression_method = b.getByte();
      else
        msg.cipher_suites = readVector(b, 2), msg.compression_methods = readVector(b, 1);
      if (remaining = length - (remaining - b.length()), remaining > 0) {
        var exts = readVector(b, 2);
        while (exts.length() > 0)
          msg.extensions.push({
            type: [exts.getByte(), exts.getByte()],
            data: readVector(exts, 2)
          });
        if (!client15)
          for (var i5 = 0;i5 < msg.extensions.length; ++i5) {
            var ext = msg.extensions[i5];
            if (ext.type[0] === 0 && ext.type[1] === 0) {
              var snl = readVector(ext.data, 2);
              while (snl.length() > 0) {
                var snType = snl.getByte();
                if (snType !== 0)
                  break;
                c3.session.extensions.server_name.serverNameList.push(readVector(snl, 2).getBytes());
              }
            }
          }
      }
      if (c3.session.version) {
        if (msg.version.major !== c3.session.version.major || msg.version.minor !== c3.session.version.minor)
          return c3.error(c3, {
            message: "TLS version change is disallowed during renegotiation.",
            send: !0,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
      }
      if (client15)
        c3.session.cipherSuite = tls.getCipherSuite(msg.cipher_suite);
      else {
        var tmp = forge.util.createBuffer(msg.cipher_suites.bytes());
        while (tmp.length() > 0)
          if (c3.session.cipherSuite = tls.getCipherSuite(tmp.getBytes(2)), c3.session.cipherSuite !== null)
            break;
      }
      if (c3.session.cipherSuite === null)
        return c3.error(c3, {
          message: "No cipher suites in common.",
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.handshake_failure
          },
          cipherSuite: forge.util.bytesToHex(msg.cipher_suite)
        });
      if (client15)
        c3.session.compressionMethod = msg.compression_method;
      else
        c3.session.compressionMethod = tls.CompressionMethod.none;
    }
    return msg;
  };
  tls.createSecurityParameters = function(c3, msg) {
    var client15 = c3.entity === tls.ConnectionEnd.client, msgRandom = msg.random.bytes(), cRandom = client15 ? c3.session.sp.client_random : msgRandom, sRandom = client15 ? msgRandom : tls.createRandom().getBytes();
    c3.session.sp = {
      entity: c3.entity,
      prf_algorithm: tls.PRFAlgorithm.tls_prf_sha256,
      bulk_cipher_algorithm: null,
      cipher_type: null,
      enc_key_length: null,
      block_length: null,
      fixed_iv_length: null,
      record_iv_length: null,
      mac_algorithm: null,
      mac_length: null,
      mac_key_length: null,
      compression_algorithm: c3.session.compressionMethod,
      pre_master_secret: null,
      master_secret: null,
      client_random: cRandom,
      server_random: sRandom
    };
  };
  tls.handleServerHello = function(c3, record2, length) {
    var msg = tls.parseHelloMessage(c3, record2, length);
    if (c3.fail)
      return;
    if (msg.version.minor <= c3.version.minor)
      c3.version.minor = msg.version.minor;
    else
      return c3.error(c3, {
        message: "Incompatible TLS version.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.protocol_version
        }
      });
    c3.session.version = c3.version;
    var sessionId = msg.session_id.bytes();
    if (sessionId.length > 0 && sessionId === c3.session.id)
      c3.expect = SCC, c3.session.resuming = !0, c3.session.sp.server_random = msg.random.bytes();
    else
      c3.expect = SCE, c3.session.resuming = !1, tls.createSecurityParameters(c3, msg);
    c3.session.id = sessionId, c3.process();
  };
  tls.handleClientHello = function(c3, record2, length) {
    var msg = tls.parseHelloMessage(c3, record2, length);
    if (c3.fail)
      return;
    var sessionId = msg.session_id.bytes(), session = null;
    if (c3.sessionCache) {
      if (session = c3.sessionCache.getSession(sessionId), session === null)
        sessionId = "";
      else if (session.version.major !== msg.version.major || session.version.minor > msg.version.minor)
        session = null, sessionId = "";
    }
    if (sessionId.length === 0)
      sessionId = forge.random.getBytes(32);
    if (c3.session.id = sessionId, c3.session.clientHelloVersion = msg.version, c3.session.sp = {}, session)
      c3.version = c3.session.version = session.version, c3.session.sp = session.sp;
    else {
      var version5;
      for (var i5 = 1;i5 < tls.SupportedVersions.length; ++i5)
        if (version5 = tls.SupportedVersions[i5], version5.minor <= msg.version.minor)
          break;
      c3.version = { major: version5.major, minor: version5.minor }, c3.session.version = c3.version;
    }
    if (session !== null)
      c3.expect = CCC, c3.session.resuming = !0, c3.session.sp.client_random = msg.random.bytes();
    else
      c3.expect = c3.verifyClient !== !1 ? CCE : CKE, c3.session.resuming = !1, tls.createSecurityParameters(c3, msg);
    if (c3.open = !0, tls.queue(c3, tls.createRecord(c3, {
      type: tls.ContentType.handshake,
      data: tls.createServerHello(c3)
    })), c3.session.resuming)
      tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      })), c3.state.pending = tls.createConnectionState(c3), c3.state.current.write = c3.state.pending.write, tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c3)
      }));
    else if (tls.queue(c3, tls.createRecord(c3, {
      type: tls.ContentType.handshake,
      data: tls.createCertificate(c3)
    })), !c3.fail) {
      if (tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.handshake,
        data: tls.createServerKeyExchange(c3)
      })), c3.verifyClient !== !1)
        tls.queue(c3, tls.createRecord(c3, {
          type: tls.ContentType.handshake,
          data: tls.createCertificateRequest(c3)
        }));
      tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.handshake,
        data: tls.createServerHelloDone(c3)
      }));
    }
    tls.flush(c3), c3.process();
  };
  tls.handleCertificate = function(c3, record2, length) {
    if (length < 3)
      return c3.error(c3, {
        message: "Invalid Certificate message. Message too short.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    var b = record2.fragment, msg = {
      certificate_list: readVector(b, 3)
    }, cert, asn1, certs = [];
    try {
      while (msg.certificate_list.length() > 0)
        cert = readVector(msg.certificate_list, 3), asn1 = forge.asn1.fromDer(cert), cert = forge.pki.certificateFromAsn1(asn1, !0), certs.push(cert);
    } catch (ex) {
      return c3.error(c3, {
        message: "Could not parse certificate list.",
        cause: ex,
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.bad_certificate
        }
      });
    }
    var client15 = c3.entity === tls.ConnectionEnd.client;
    if ((client15 || c3.verifyClient === !0) && certs.length === 0)
      c3.error(c3, {
        message: client15 ? "No server certificate provided." : "No client certificate provided.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    else if (certs.length === 0)
      c3.expect = client15 ? SKE : CKE;
    else {
      if (client15)
        c3.session.serverCertificate = certs[0];
      else
        c3.session.clientCertificate = certs[0];
      if (tls.verifyCertificateChain(c3, certs))
        c3.expect = client15 ? SKE : CKE;
    }
    c3.process();
  };
  tls.handleServerKeyExchange = function(c3, record2, length) {
    if (length > 0)
      return c3.error(c3, {
        message: "Invalid key parameters. Only RSA is supported.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unsupported_certificate
        }
      });
    c3.expect = SCR, c3.process();
  };
  tls.handleClientKeyExchange = function(c3, record2, length) {
    if (length < 48)
      return c3.error(c3, {
        message: "Invalid key parameters. Only RSA is supported.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unsupported_certificate
        }
      });
    var b = record2.fragment, msg = {
      enc_pre_master_secret: readVector(b, 2).getBytes()
    }, privateKey = null;
    if (c3.getPrivateKey)
      try {
        privateKey = c3.getPrivateKey(c3, c3.session.serverCertificate), privateKey = forge.pki.privateKeyFromPem(privateKey);
      } catch (ex) {
        c3.error(c3, {
          message: "Could not get private key.",
          cause: ex,
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      }
    if (privateKey === null)
      return c3.error(c3, {
        message: "No private key set.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.internal_error
        }
      });
    try {
      var sp = c3.session.sp;
      sp.pre_master_secret = privateKey.decrypt(msg.enc_pre_master_secret);
      var version5 = c3.session.clientHelloVersion;
      if (version5.major !== sp.pre_master_secret.charCodeAt(0) || version5.minor !== sp.pre_master_secret.charCodeAt(1))
        throw Error("TLS version rollback attack detected.");
    } catch (ex) {
      sp.pre_master_secret = forge.random.getBytes(48);
    }
    if (c3.expect = CCC, c3.session.clientCertificate !== null)
      c3.expect = CCV;
    c3.process();
  };
  tls.handleCertificateRequest = function(c3, record2, length) {
    if (length < 3)
      return c3.error(c3, {
        message: "Invalid CertificateRequest. Message too short.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    var b = record2.fragment, msg = {
      certificate_types: readVector(b, 1),
      certificate_authorities: readVector(b, 2)
    };
    c3.session.certificateRequest = msg, c3.expect = SHD, c3.process();
  };
  tls.handleCertificateVerify = function(c3, record2, length) {
    if (length < 2)
      return c3.error(c3, {
        message: "Invalid CertificateVerify. Message too short.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    var b = record2.fragment;
    b.read -= 4;
    var msgBytes = b.bytes();
    b.read += 4;
    var msg = {
      signature: readVector(b, 2).getBytes()
    }, verify = forge.util.createBuffer();
    verify.putBuffer(c3.session.md5.digest()), verify.putBuffer(c3.session.sha1.digest()), verify = verify.getBytes();
    try {
      var cert = c3.session.clientCertificate;
      if (!cert.publicKey.verify(verify, msg.signature, "NONE"))
        throw Error("CertificateVerify signature does not match.");
      c3.session.md5.update(msgBytes), c3.session.sha1.update(msgBytes);
    } catch (ex) {
      return c3.error(c3, {
        message: "Bad signature in CertificateVerify.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.handshake_failure
        }
      });
    }
    c3.expect = CCC, c3.process();
  };
  tls.handleServerHelloDone = function(c3, record2, length) {
    if (length > 0)
      return c3.error(c3, {
        message: "Invalid ServerHelloDone message. Invalid length.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.record_overflow
        }
      });
    if (c3.serverCertificate === null) {
      var error44 = {
        message: "No server certificate provided. Not enough security.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.insufficient_security
        }
      }, depth = 0, ret = c3.verify(c3, error44.alert.description, depth, []);
      if (ret !== !0) {
        if (ret || ret === 0) {
          if (typeof ret === "object" && !forge.util.isArray(ret)) {
            if (ret.message)
              error44.message = ret.message;
            if (ret.alert)
              error44.alert.description = ret.alert;
          } else if (typeof ret === "number")
            error44.alert.description = ret;
        }
        return c3.error(c3, error44);
      }
    }
    if (c3.session.certificateRequest !== null)
      record2 = tls.createRecord(c3, {
        type: tls.ContentType.handshake,
        data: tls.createCertificate(c3)
      }), tls.queue(c3, record2);
    record2 = tls.createRecord(c3, {
      type: tls.ContentType.handshake,
      data: tls.createClientKeyExchange(c3)
    }), tls.queue(c3, record2), c3.expect = SER;
    var callback = function(c4, signature7) {
      if (c4.session.certificateRequest !== null && c4.session.clientCertificate !== null)
        tls.queue(c4, tls.createRecord(c4, {
          type: tls.ContentType.handshake,
          data: tls.createCertificateVerify(c4, signature7)
        }));
      tls.queue(c4, tls.createRecord(c4, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      })), c4.state.pending = tls.createConnectionState(c4), c4.state.current.write = c4.state.pending.write, tls.queue(c4, tls.createRecord(c4, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c4)
      })), c4.expect = SCC, tls.flush(c4), c4.process();
    };
    if (c3.session.certificateRequest === null || c3.session.clientCertificate === null)
      return callback(c3, null);
    tls.getClientSignature(c3, callback);
  };
  tls.handleChangeCipherSpec = function(c3, record2) {
    if (record2.fragment.getByte() !== 1)
      return c3.error(c3, {
        message: "Invalid ChangeCipherSpec message received.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    var client15 = c3.entity === tls.ConnectionEnd.client;
    if (c3.session.resuming && client15 || !c3.session.resuming && !client15)
      c3.state.pending = tls.createConnectionState(c3);
    if (c3.state.current.read = c3.state.pending.read, !c3.session.resuming && client15 || c3.session.resuming && !client15)
      c3.state.pending = null;
    c3.expect = client15 ? SFI : CFI, c3.process();
  };
  tls.handleFinished = function(c3, record2, length) {
    var b = record2.fragment;
    b.read -= 4;
    var msgBytes = b.bytes();
    b.read += 4;
    var vd = record2.fragment.getBytes();
    b = forge.util.createBuffer(), b.putBuffer(c3.session.md5.digest()), b.putBuffer(c3.session.sha1.digest());
    var client15 = c3.entity === tls.ConnectionEnd.client, label = client15 ? "server finished" : "client finished", sp = c3.session.sp, vdl = 12, prf = prf_TLS1;
    if (b = prf(sp.master_secret, label, b.getBytes(), vdl), b.getBytes() !== vd)
      return c3.error(c3, {
        message: "Invalid verify_data in Finished message.",
        send: !0,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.decrypt_error
        }
      });
    if (c3.session.md5.update(msgBytes), c3.session.sha1.update(msgBytes), c3.session.resuming && client15 || !c3.session.resuming && !client15)
      tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      })), c3.state.current.write = c3.state.pending.write, c3.state.pending = null, tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c3)
      }));
    c3.expect = client15 ? SAD : CAD, c3.handshaking = !1, ++c3.handshakes, c3.peerCertificate = client15 ? c3.session.serverCertificate : c3.session.clientCertificate, tls.flush(c3), c3.isConnected = !0, c3.connected(c3), c3.process();
  };
  tls.handleAlert = function(c3, record2) {
    var b = record2.fragment, alert = {
      level: b.getByte(),
      description: b.getByte()
    }, msg;
    switch (alert.description) {
      case tls.Alert.Description.close_notify:
        msg = "Connection closed.";
        break;
      case tls.Alert.Description.unexpected_message:
        msg = "Unexpected message.";
        break;
      case tls.Alert.Description.bad_record_mac:
        msg = "Bad record MAC.";
        break;
      case tls.Alert.Description.decryption_failed:
        msg = "Decryption failed.";
        break;
      case tls.Alert.Description.record_overflow:
        msg = "Record overflow.";
        break;
      case tls.Alert.Description.decompression_failure:
        msg = "Decompression failed.";
        break;
      case tls.Alert.Description.handshake_failure:
        msg = "Handshake failure.";
        break;
      case tls.Alert.Description.bad_certificate:
        msg = "Bad certificate.";
        break;
      case tls.Alert.Description.unsupported_certificate:
        msg = "Unsupported certificate.";
        break;
      case tls.Alert.Description.certificate_revoked:
        msg = "Certificate revoked.";
        break;
      case tls.Alert.Description.certificate_expired:
        msg = "Certificate expired.";
        break;
      case tls.Alert.Description.certificate_unknown:
        msg = "Certificate unknown.";
        break;
      case tls.Alert.Description.illegal_parameter:
        msg = "Illegal parameter.";
        break;
      case tls.Alert.Description.unknown_ca:
        msg = "Unknown certificate authority.";
        break;
      case tls.Alert.Description.access_denied:
        msg = "Access denied.";
        break;
      case tls.Alert.Description.decode_error:
        msg = "Decode error.";
        break;
      case tls.Alert.Description.decrypt_error:
        msg = "Decrypt error.";
        break;
      case tls.Alert.Description.export_restriction:
        msg = "Export restriction.";
        break;
      case tls.Alert.Description.protocol_version:
        msg = "Unsupported protocol version.";
        break;
      case tls.Alert.Description.insufficient_security:
        msg = "Insufficient security.";
        break;
      case tls.Alert.Description.internal_error:
        msg = "Internal error.";
        break;
      case tls.Alert.Description.user_canceled:
        msg = "User canceled.";
        break;
      case tls.Alert.Description.no_renegotiation:
        msg = "Renegotiation not supported.";
        break;
      default:
        msg = "Unknown error.";
        break;
    }
    if (alert.description === tls.Alert.Description.close_notify)
      return c3.close();
    c3.error(c3, {
      message: msg,
      send: !1,
      origin: c3.entity === tls.ConnectionEnd.client ? "server" : "client",
      alert
    }), c3.process();
  };
  tls.handleHandshake = function(c3, record2) {
    var b = record2.fragment, type = b.getByte(), length = b.getInt24();
    if (length > b.length())
      return c3.fragmented = record2, record2.fragment = forge.util.createBuffer(), b.read -= 4, c3.process();
    c3.fragmented = null, b.read -= 4;
    var bytes = b.bytes(length + 4);
    if (b.read += 4, type in hsTable[c3.entity][c3.expect]) {
      if (c3.entity === tls.ConnectionEnd.server && !c3.open && !c3.fail)
        c3.handshaking = !0, c3.session = {
          version: null,
          extensions: {
            server_name: {
              serverNameList: []
            }
          },
          cipherSuite: null,
          compressionMethod: null,
          serverCertificate: null,
          clientCertificate: null,
          md5: forge.md.md5.create(),
          sha1: forge.md.sha1.create()
        };
      if (type !== tls.HandshakeType.hello_request && type !== tls.HandshakeType.certificate_verify && type !== tls.HandshakeType.finished)
        c3.session.md5.update(bytes), c3.session.sha1.update(bytes);
      hsTable[c3.entity][c3.expect][type](c3, record2, length);
    } else
      tls.handleUnexpected(c3, record2);
  };
  tls.handleApplicationData = function(c3, record2) {
    c3.data.putBuffer(record2.fragment), c3.dataReady(c3), c3.process();
  };
  tls.handleHeartbeat = function(c3, record2) {
    var b = record2.fragment, type = b.getByte(), length = b.getInt16(), payload = b.getBytes(length);
    if (type === tls.HeartbeatMessageType.heartbeat_request) {
      if (c3.handshaking || length > payload.length)
        return c3.process();
      tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.heartbeat,
        data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_response, payload)
      })), tls.flush(c3);
    } else if (type === tls.HeartbeatMessageType.heartbeat_response) {
      if (payload !== c3.expectedHeartbeatPayload)
        return c3.process();
      if (c3.heartbeatReceived)
        c3.heartbeatReceived(c3, forge.util.createBuffer(payload));
    }
    c3.process();
  };
  var SHE = 0, SCE = 1, SKE = 2, SCR = 3, SHD = 4, SCC = 5, SFI = 6, SAD = 7, SER = 8, CHE = 0, CCE = 1, CKE = 2, CCV = 3, CCC = 4, CFI = 5, CAD = 6, __ = tls.handleUnexpected, R0 = tls.handleChangeCipherSpec, R1 = tls.handleAlert, R2 = tls.handleHandshake, R3 = tls.handleApplicationData, R4 = tls.handleHeartbeat, ctTable = [];
  ctTable[tls.ConnectionEnd.client] = [
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [R0, R1, __, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, R3, R4],
    [__, R1, R2, __, R4]
  ];
  ctTable[tls.ConnectionEnd.server] = [
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [R0, R1, __, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, R3, R4],
    [__, R1, R2, __, R4]
  ];
  var { handleHelloRequest: H0, handleServerHello: H1, handleCertificate: H2, handleServerKeyExchange: H3, handleCertificateRequest: H4, handleServerHelloDone: H5, handleFinished: H6 } = tls, hsTable = [];
  hsTable[tls.ConnectionEnd.client] = [
    [__, __, H1, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, H2, H3, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, H3, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
  ];
  var { handleClientHello: H7, handleClientKeyExchange: H8, handleCertificateVerify: H9 } = tls;
  hsTable[tls.ConnectionEnd.server] = [
    [__, H7, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, H2, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H8, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H9, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
  ];
  tls.generateKeys = function(c3, sp) {
    var prf = prf_TLS1, random = sp.client_random + sp.server_random;
    if (!c3.session.resuming)
      sp.master_secret = prf(sp.pre_master_secret, "master secret", random, 48).bytes(), sp.pre_master_secret = null;
    random = sp.server_random + sp.client_random;
    var length = 2 * sp.mac_key_length + 2 * sp.enc_key_length, tls10 = c3.version.major === tls.Versions.TLS_1_0.major && c3.version.minor === tls.Versions.TLS_1_0.minor;
    if (tls10)
      length += 2 * sp.fixed_iv_length;
    var km = prf(sp.master_secret, "key expansion", random, length), rval = {
      client_write_MAC_key: km.getBytes(sp.mac_key_length),
      server_write_MAC_key: km.getBytes(sp.mac_key_length),
      client_write_key: km.getBytes(sp.enc_key_length),
      server_write_key: km.getBytes(sp.enc_key_length)
    };
    if (tls10)
      rval.client_write_IV = km.getBytes(sp.fixed_iv_length), rval.server_write_IV = km.getBytes(sp.fixed_iv_length);
    return rval;
  };
  tls.createConnectionState = function(c3) {
    var client15 = c3.entity === tls.ConnectionEnd.client, createMode = function() {
      var mode = {
        sequenceNumber: [0, 0],
        macKey: null,
        macLength: 0,
        macFunction: null,
        cipherState: null,
        cipherFunction: function(record2) {
          return !0;
        },
        compressionState: null,
        compressFunction: function(record2) {
          return !0;
        },
        updateSequenceNumber: function() {
          if (mode.sequenceNumber[1] === 4294967295)
            mode.sequenceNumber[1] = 0, ++mode.sequenceNumber[0];
          else
            ++mode.sequenceNumber[1];
        }
      };
      return mode;
    }, state3 = {
      read: createMode(),
      write: createMode()
    };
    if (state3.read.update = function(c4, record2) {
      if (!state3.read.cipherFunction(record2, state3.read))
        c4.error(c4, {
          message: "Could not decrypt record or bad MAC.",
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_record_mac
          }
        });
      else if (!state3.read.compressFunction(c4, record2, state3.read))
        c4.error(c4, {
          message: "Could not decompress record.",
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.decompression_failure
          }
        });
      return !c4.fail;
    }, state3.write.update = function(c4, record2) {
      if (!state3.write.compressFunction(c4, record2, state3.write))
        c4.error(c4, {
          message: "Could not compress record.",
          send: !1,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      else if (!state3.write.cipherFunction(record2, state3.write))
        c4.error(c4, {
          message: "Could not encrypt record.",
          send: !1,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      return !c4.fail;
    }, c3.session) {
      var sp = c3.session.sp;
      switch (c3.session.cipherSuite.initSecurityParameters(sp), sp.keys = tls.generateKeys(c3, sp), state3.read.macKey = client15 ? sp.keys.server_write_MAC_key : sp.keys.client_write_MAC_key, state3.write.macKey = client15 ? sp.keys.client_write_MAC_key : sp.keys.server_write_MAC_key, c3.session.cipherSuite.initConnectionState(state3, c3, sp), sp.compression_algorithm) {
        case tls.CompressionMethod.none:
          break;
        case tls.CompressionMethod.deflate:
          state3.read.compressFunction = inflate2, state3.write.compressFunction = deflate2;
          break;
        default:
          throw Error("Unsupported compression algorithm.");
      }
    }
    return state3;
  };
  tls.createRandom = function() {
    var d = /* @__PURE__ */ new Date, utc = +d + d.getTimezoneOffset() * 60000, rval = forge.util.createBuffer();
    return rval.putInt32(utc), rval.putBytes(forge.random.getBytes(28)), rval;
  };
  tls.createRecord = function(c3, options) {
    if (!options.data)
      return null;
    var record2 = {
      type: options.type,
      version: {
        major: c3.version.major,
        minor: c3.version.minor
      },
      length: options.data.length(),
      fragment: options.data
    };
    return record2;
  };
  tls.createAlert = function(c3, alert) {
    var b = forge.util.createBuffer();
    return b.putByte(alert.level), b.putByte(alert.description), tls.createRecord(c3, {
      type: tls.ContentType.alert,
      data: b
    });
  };
  tls.createClientHello = function(c3) {
    c3.session.clientHelloVersion = {
      major: c3.version.major,
      minor: c3.version.minor
    };
    var cipherSuites = forge.util.createBuffer();
    for (var i5 = 0;i5 < c3.cipherSuites.length; ++i5) {
      var cs = c3.cipherSuites[i5];
      cipherSuites.putByte(cs.id[0]), cipherSuites.putByte(cs.id[1]);
    }
    var cSuites = cipherSuites.length(), compressionMethods = forge.util.createBuffer();
    compressionMethods.putByte(tls.CompressionMethod.none);
    var cMethods = compressionMethods.length(), extensions20 = forge.util.createBuffer();
    if (c3.virtualHost) {
      var ext = forge.util.createBuffer();
      ext.putByte(0), ext.putByte(0);
      var serverName = forge.util.createBuffer();
      serverName.putByte(0), writeVector(serverName, 2, forge.util.createBuffer(c3.virtualHost));
      var snList = forge.util.createBuffer();
      writeVector(snList, 2, serverName), writeVector(ext, 2, snList), extensions20.putBuffer(ext);
    }
    var extLength = extensions20.length();
    if (extLength > 0)
      extLength += 2;
    var sessionId = c3.session.id, length = sessionId.length + 1 + 2 + 4 + 28 + 2 + cSuites + 1 + cMethods + extLength, rval = forge.util.createBuffer();
    if (rval.putByte(tls.HandshakeType.client_hello), rval.putInt24(length), rval.putByte(c3.version.major), rval.putByte(c3.version.minor), rval.putBytes(c3.session.sp.client_random), writeVector(rval, 1, forge.util.createBuffer(sessionId)), writeVector(rval, 2, cipherSuites), writeVector(rval, 1, compressionMethods), extLength > 0)
      writeVector(rval, 2, extensions20);
    return rval;
  };
  tls.createServerHello = function(c3) {
    var sessionId = c3.session.id, length = sessionId.length + 1 + 2 + 4 + 28 + 2 + 1, rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.server_hello), rval.putInt24(length), rval.putByte(c3.version.major), rval.putByte(c3.version.minor), rval.putBytes(c3.session.sp.server_random), writeVector(rval, 1, forge.util.createBuffer(sessionId)), rval.putByte(c3.session.cipherSuite.id[0]), rval.putByte(c3.session.cipherSuite.id[1]), rval.putByte(c3.session.compressionMethod), rval;
  };
  tls.createCertificate = function(c3) {
    var client15 = c3.entity === tls.ConnectionEnd.client, cert = null;
    if (c3.getCertificate) {
      var hint;
      if (client15)
        hint = c3.session.certificateRequest;
      else
        hint = c3.session.extensions.server_name.serverNameList;
      cert = c3.getCertificate(c3, hint);
    }
    var certList = forge.util.createBuffer();
    if (cert !== null)
      try {
        if (!forge.util.isArray(cert))
          cert = [cert];
        var asn1 = null;
        for (var i5 = 0;i5 < cert.length; ++i5) {
          var msg = forge.pem.decode(cert[i5])[0];
          if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
            var error44 = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
            throw error44.headerType = msg.type, error44;
          }
          if (msg.procType && msg.procType.type === "ENCRYPTED")
            throw Error("Could not convert certificate from PEM; PEM is encrypted.");
          var der = forge.util.createBuffer(msg.body);
          if (asn1 === null)
            asn1 = forge.asn1.fromDer(der.bytes(), !1);
          var certBuffer = forge.util.createBuffer();
          writeVector(certBuffer, 3, der), certList.putBuffer(certBuffer);
        }
        if (cert = forge.pki.certificateFromAsn1(asn1), client15)
          c3.session.clientCertificate = cert;
        else
          c3.session.serverCertificate = cert;
      } catch (ex) {
        return c3.error(c3, {
          message: "Could not send certificate list.",
          cause: ex,
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_certificate
          }
        });
      }
    var length = 3 + certList.length(), rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.certificate), rval.putInt24(length), writeVector(rval, 3, certList), rval;
  };
  tls.createClientKeyExchange = function(c3) {
    var b = forge.util.createBuffer();
    b.putByte(c3.session.clientHelloVersion.major), b.putByte(c3.session.clientHelloVersion.minor), b.putBytes(forge.random.getBytes(46));
    var sp = c3.session.sp;
    sp.pre_master_secret = b.getBytes();
    var key3 = c3.session.serverCertificate.publicKey;
    b = key3.encrypt(sp.pre_master_secret);
    var length = b.length + 2, rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.client_key_exchange), rval.putInt24(length), rval.putInt16(b.length), rval.putBytes(b), rval;
  };
  tls.createServerKeyExchange = function(c3) {
    var length = 0, rval = forge.util.createBuffer();
    if (length > 0)
      rval.putByte(tls.HandshakeType.server_key_exchange), rval.putInt24(length);
    return rval;
  };
  tls.getClientSignature = function(c3, callback) {
    var b = forge.util.createBuffer();
    b.putBuffer(c3.session.md5.digest()), b.putBuffer(c3.session.sha1.digest()), b = b.getBytes(), c3.getSignature = c3.getSignature || function(c4, b3, callback2) {
      var privateKey = null;
      if (c4.getPrivateKey)
        try {
          privateKey = c4.getPrivateKey(c4, c4.session.clientCertificate), privateKey = forge.pki.privateKeyFromPem(privateKey);
        } catch (ex) {
          c4.error(c4, {
            message: "Could not get private key.",
            cause: ex,
            send: !0,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        }
      if (privateKey === null)
        c4.error(c4, {
          message: "No private key set.",
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      else
        b3 = privateKey.sign(b3, null);
      callback2(c4, b3);
    }, c3.getSignature(c3, b, callback);
  };
  tls.createCertificateVerify = function(c3, signature7) {
    var length = signature7.length + 2, rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.certificate_verify), rval.putInt24(length), rval.putInt16(signature7.length), rval.putBytes(signature7), rval;
  };
  tls.createCertificateRequest = function(c3) {
    var certTypes = forge.util.createBuffer();
    certTypes.putByte(1);
    var cAs = forge.util.createBuffer();
    for (var key3 in c3.caStore.certs) {
      var cert = c3.caStore.certs[key3], dn = forge.pki.distinguishedNameToAsn1(cert.subject), byteBuffer = forge.asn1.toDer(dn);
      cAs.putInt16(byteBuffer.length()), cAs.putBuffer(byteBuffer);
    }
    var length = 1 + certTypes.length() + 2 + cAs.length(), rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.certificate_request), rval.putInt24(length), writeVector(rval, 1, certTypes), writeVector(rval, 2, cAs), rval;
  };
  tls.createServerHelloDone = function(c3) {
    var rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.server_hello_done), rval.putInt24(0), rval;
  };
  tls.createChangeCipherSpec = function() {
    var rval = forge.util.createBuffer();
    return rval.putByte(1), rval;
  };
  tls.createFinished = function(c3) {
    var b = forge.util.createBuffer();
    b.putBuffer(c3.session.md5.digest()), b.putBuffer(c3.session.sha1.digest());
    var client15 = c3.entity === tls.ConnectionEnd.client, sp = c3.session.sp, vdl = 12, prf = prf_TLS1, label = client15 ? "client finished" : "server finished";
    b = prf(sp.master_secret, label, b.getBytes(), vdl);
    var rval = forge.util.createBuffer();
    return rval.putByte(tls.HandshakeType.finished), rval.putInt24(b.length()), rval.putBuffer(b), rval;
  };
  tls.createHeartbeat = function(type, payload, payloadLength) {
    if (typeof payloadLength > "u")
      payloadLength = payload.length;
    var rval = forge.util.createBuffer();
    rval.putByte(type), rval.putInt16(payloadLength), rval.putBytes(payload);
    var plaintextLength = rval.length(), paddingLength = Math.max(16, plaintextLength - payloadLength - 3);
    return rval.putBytes(forge.random.getBytes(paddingLength)), rval;
  };
  tls.queue = function(c3, record2) {
    if (!record2)
      return;
    if (record2.fragment.length() === 0) {
      if (record2.type === tls.ContentType.handshake || record2.type === tls.ContentType.alert || record2.type === tls.ContentType.change_cipher_spec)
        return;
    }
    if (record2.type === tls.ContentType.handshake) {
      var bytes = record2.fragment.bytes();
      c3.session.md5.update(bytes), c3.session.sha1.update(bytes), bytes = null;
    }
    var records;
    if (record2.fragment.length() <= tls.MaxFragment)
      records = [record2];
    else {
      records = [];
      var data = record2.fragment.bytes();
      while (data.length > tls.MaxFragment)
        records.push(tls.createRecord(c3, {
          type: record2.type,
          data: forge.util.createBuffer(data.slice(0, tls.MaxFragment))
        })), data = data.slice(tls.MaxFragment);
      if (data.length > 0)
        records.push(tls.createRecord(c3, {
          type: record2.type,
          data: forge.util.createBuffer(data)
        }));
    }
    for (var i5 = 0;i5 < records.length && !c3.fail; ++i5) {
      var rec = records[i5], s2 = c3.state.current.write;
      if (s2.update(c3, rec))
        c3.records.push(rec);
    }
  };
  tls.flush = function(c3) {
    for (var i5 = 0;i5 < c3.records.length; ++i5) {
      var record2 = c3.records[i5];
      c3.tlsData.putByte(record2.type), c3.tlsData.putByte(record2.version.major), c3.tlsData.putByte(record2.version.minor), c3.tlsData.putInt16(record2.fragment.length()), c3.tlsData.putBuffer(c3.records[i5].fragment);
    }
    return c3.records = [], c3.tlsDataReady(c3);
  };
  var _certErrorToAlertDesc = function(error44) {
    switch (error44) {
      case !0:
        return !0;
      case forge.pki.certificateError.bad_certificate:
        return tls.Alert.Description.bad_certificate;
      case forge.pki.certificateError.unsupported_certificate:
        return tls.Alert.Description.unsupported_certificate;
      case forge.pki.certificateError.certificate_revoked:
        return tls.Alert.Description.certificate_revoked;
      case forge.pki.certificateError.certificate_expired:
        return tls.Alert.Description.certificate_expired;
      case forge.pki.certificateError.certificate_unknown:
        return tls.Alert.Description.certificate_unknown;
      case forge.pki.certificateError.unknown_ca:
        return tls.Alert.Description.unknown_ca;
      default:
        return tls.Alert.Description.bad_certificate;
    }
  }, _alertDescToCertError = function(desc) {
    switch (desc) {
      case !0:
        return !0;
      case tls.Alert.Description.bad_certificate:
        return forge.pki.certificateError.bad_certificate;
      case tls.Alert.Description.unsupported_certificate:
        return forge.pki.certificateError.unsupported_certificate;
      case tls.Alert.Description.certificate_revoked:
        return forge.pki.certificateError.certificate_revoked;
      case tls.Alert.Description.certificate_expired:
        return forge.pki.certificateError.certificate_expired;
      case tls.Alert.Description.certificate_unknown:
        return forge.pki.certificateError.certificate_unknown;
      case tls.Alert.Description.unknown_ca:
        return forge.pki.certificateError.unknown_ca;
      default:
        return forge.pki.certificateError.bad_certificate;
    }
  };
  tls.verifyCertificateChain = function(c3, chain4) {
    try {
      var options = {};
      for (var key3 in c3.verifyOptions)
        options[key3] = c3.verifyOptions[key3];
      options.verify = function(vfd, depth, chain5) {
        var desc = _certErrorToAlertDesc(vfd), ret = c3.verify(c3, vfd, depth, chain5);
        if (ret !== !0) {
          if (typeof ret === "object" && !forge.util.isArray(ret)) {
            var error44 = Error("The application rejected the certificate.");
            if (error44.send = !0, error44.alert = {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.bad_certificate
            }, ret.message)
              error44.message = ret.message;
            if (ret.alert)
              error44.alert.description = ret.alert;
            throw error44;
          }
          if (ret !== vfd)
            ret = _alertDescToCertError(ret);
        }
        return ret;
      }, forge.pki.verifyCertificateChain(c3.caStore, chain4, options);
    } catch (ex) {
      var err2 = ex;
      if (typeof err2 !== "object" || forge.util.isArray(err2))
        err2 = {
          send: !0,
          alert: {
            level: tls.Alert.Level.fatal,
            description: _certErrorToAlertDesc(ex)
          }
        };
      if (!("send" in err2))
        err2.send = !0;
      if (!("alert" in err2))
        err2.alert = {
          level: tls.Alert.Level.fatal,
          description: _certErrorToAlertDesc(err2.error)
        };
      c3.error(c3, err2);
    }
    return !c3.fail;
  };
  tls.createSessionCache = function(cache5, capacity) {
    var rval = null;
    if (cache5 && cache5.getSession && cache5.setSession && cache5.order)
      rval = cache5;
    else {
      rval = {}, rval.cache = cache5 || {}, rval.capacity = Math.max(capacity || 100, 1), rval.order = [];
      for (var key3 in cache5)
        if (rval.order.length <= capacity)
          rval.order.push(key3);
        else
          delete cache5[key3];
      rval.getSession = function(sessionId) {
        var session = null, key4 = null;
        if (sessionId)
          key4 = forge.util.bytesToHex(sessionId);
        else if (rval.order.length > 0)
          key4 = rval.order[0];
        if (key4 !== null && key4 in rval.cache) {
          session = rval.cache[key4], delete rval.cache[key4];
          for (var i5 in rval.order)
            if (rval.order[i5] === key4) {
              rval.order.splice(i5, 1);
              break;
            }
        }
        return session;
      }, rval.setSession = function(sessionId, session) {
        if (rval.order.length === rval.capacity) {
          var key4 = rval.order.shift();
          delete rval.cache[key4];
        }
        var key4 = forge.util.bytesToHex(sessionId);
        rval.order.push(key4), rval.cache[key4] = session;
      };
    }
    return rval;
  };
  tls.createConnection = function(options) {
    var caStore = null;
    if (options.caStore)
      if (forge.util.isArray(options.caStore))
        caStore = forge.pki.createCaStore(options.caStore);
      else
        caStore = options.caStore;
    else
      caStore = forge.pki.createCaStore();
    var cipherSuites = options.cipherSuites || null;
    if (cipherSuites === null) {
      cipherSuites = [];
      for (var key3 in tls.CipherSuites)
        cipherSuites.push(tls.CipherSuites[key3]);
    }
    var entity = options.server ? tls.ConnectionEnd.server : tls.ConnectionEnd.client, sessionCache2 = options.sessionCache ? tls.createSessionCache(options.sessionCache) : null, c3 = {
      version: { major: tls.Version.major, minor: tls.Version.minor },
      entity,
      sessionId: options.sessionId,
      caStore,
      sessionCache: sessionCache2,
      cipherSuites,
      connected: options.connected,
      virtualHost: options.virtualHost || null,
      verifyClient: options.verifyClient || !1,
      verify: options.verify || function(cn, vfd, dpth, cts) {
        return vfd;
      },
      verifyOptions: options.verifyOptions || {},
      getCertificate: options.getCertificate || null,
      getPrivateKey: options.getPrivateKey || null,
      getSignature: options.getSignature || null,
      input: forge.util.createBuffer(),
      tlsData: forge.util.createBuffer(),
      data: forge.util.createBuffer(),
      tlsDataReady: options.tlsDataReady,
      dataReady: options.dataReady,
      heartbeatReceived: options.heartbeatReceived,
      closed: options.closed,
      error: function(c4, ex) {
        if (ex.origin = ex.origin || (c4.entity === tls.ConnectionEnd.client ? "client" : "server"), ex.send)
          tls.queue(c4, tls.createAlert(c4, ex.alert)), tls.flush(c4);
        var fatal = ex.fatal !== !1;
        if (fatal)
          c4.fail = !0;
        if (options.error(c4, ex), fatal)
          c4.close(!1);
      },
      deflate: options.deflate || null,
      inflate: options.inflate || null
    };
    c3.reset = function(clearFail) {
      c3.version = { major: tls.Version.major, minor: tls.Version.minor }, c3.record = null, c3.session = null, c3.peerCertificate = null, c3.state = {
        pending: null,
        current: null
      }, c3.expect = c3.entity === tls.ConnectionEnd.client ? SHE : CHE, c3.fragmented = null, c3.records = [], c3.open = !1, c3.handshakes = 0, c3.handshaking = !1, c3.isConnected = !1, c3.fail = !(clearFail || typeof clearFail > "u"), c3.input.clear(), c3.tlsData.clear(), c3.data.clear(), c3.state.current = tls.createConnectionState(c3);
    }, c3.reset();
    var _update = function(c4, record2) {
      var aligned = record2.type - tls.ContentType.change_cipher_spec, handlers = ctTable[c4.entity][c4.expect];
      if (aligned in handlers)
        handlers[aligned](c4, record2);
      else
        tls.handleUnexpected(c4, record2);
    }, _readRecordHeader = function(c4) {
      var rval = 0, b = c4.input, len = b.length();
      if (len < 5)
        rval = 5 - len;
      else {
        c4.record = {
          type: b.getByte(),
          version: {
            major: b.getByte(),
            minor: b.getByte()
          },
          length: b.getInt16(),
          fragment: forge.util.createBuffer(),
          ready: !1
        };
        var compatibleVersion = c4.record.version.major === c4.version.major;
        if (compatibleVersion && c4.session && c4.session.version)
          compatibleVersion = c4.record.version.minor === c4.version.minor;
        if (!compatibleVersion)
          c4.error(c4, {
            message: "Incompatible TLS version.",
            send: !0,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
      }
      return rval;
    }, _readRecord = function(c4) {
      var rval = 0, b = c4.input, len = b.length();
      if (len < c4.record.length)
        rval = c4.record.length - len;
      else {
        c4.record.fragment.putBytes(b.getBytes(c4.record.length)), b.compact();
        var s2 = c4.state.current.read;
        if (s2.update(c4, c4.record)) {
          if (c4.fragmented !== null)
            if (c4.fragmented.type === c4.record.type)
              c4.fragmented.fragment.putBuffer(c4.record.fragment), c4.record = c4.fragmented;
            else
              c4.error(c4, {
                message: "Invalid fragmented record.",
                send: !0,
                alert: {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.unexpected_message
                }
              });
          c4.record.ready = !0;
        }
      }
      return rval;
    };
    return c3.handshake = function(sessionId) {
      if (c3.entity !== tls.ConnectionEnd.client)
        c3.error(c3, {
          message: "Cannot initiate handshake as a server.",
          fatal: !1
        });
      else if (c3.handshaking)
        c3.error(c3, {
          message: "Handshake already in progress.",
          fatal: !1
        });
      else {
        if (c3.fail && !c3.open && c3.handshakes === 0)
          c3.fail = !1;
        c3.handshaking = !0, sessionId = sessionId || "";
        var session = null;
        if (sessionId.length > 0) {
          if (c3.sessionCache)
            session = c3.sessionCache.getSession(sessionId);
          if (session === null)
            sessionId = "";
        }
        if (sessionId.length === 0 && c3.sessionCache) {
          if (session = c3.sessionCache.getSession(), session !== null)
            sessionId = session.id;
        }
        if (c3.session = {
          id: sessionId,
          version: null,
          cipherSuite: null,
          compressionMethod: null,
          serverCertificate: null,
          certificateRequest: null,
          clientCertificate: null,
          sp: {},
          md5: forge.md.md5.create(),
          sha1: forge.md.sha1.create()
        }, session)
          c3.version = session.version, c3.session.sp = session.sp;
        c3.session.sp.client_random = tls.createRandom().getBytes(), c3.open = !0, tls.queue(c3, tls.createRecord(c3, {
          type: tls.ContentType.handshake,
          data: tls.createClientHello(c3)
        })), tls.flush(c3);
      }
    }, c3.process = function(data) {
      var rval = 0;
      if (data)
        c3.input.putBytes(data);
      if (!c3.fail) {
        if (c3.record !== null && c3.record.ready && c3.record.fragment.isEmpty())
          c3.record = null;
        if (c3.record === null)
          rval = _readRecordHeader(c3);
        if (!c3.fail && c3.record !== null && !c3.record.ready)
          rval = _readRecord(c3);
        if (!c3.fail && c3.record !== null && c3.record.ready)
          _update(c3, c3.record);
      }
      return rval;
    }, c3.prepare = function(data) {
      return tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.application_data,
        data: forge.util.createBuffer(data)
      })), tls.flush(c3);
    }, c3.prepareHeartbeatRequest = function(payload, payloadLength) {
      if (payload instanceof forge.util.ByteBuffer)
        payload = payload.bytes();
      if (typeof payloadLength > "u")
        payloadLength = payload.length;
      return c3.expectedHeartbeatPayload = payload, tls.queue(c3, tls.createRecord(c3, {
        type: tls.ContentType.heartbeat,
        data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_request, payload, payloadLength)
      })), tls.flush(c3);
    }, c3.close = function(clearFail) {
      if (!c3.fail && c3.sessionCache && c3.session) {
        var session = {
          id: c3.session.id,
          version: c3.session.version,
          sp: c3.session.sp
        };
        session.sp.keys = null, c3.sessionCache.setSession(session.id, session);
      }
      if (c3.open) {
        if (c3.open = !1, c3.input.clear(), c3.isConnected || c3.handshaking)
          c3.isConnected = c3.handshaking = !1, tls.queue(c3, tls.createAlert(c3, {
            level: tls.Alert.Level.warning,
            description: tls.Alert.Description.close_notify
          })), tls.flush(c3);
        c3.closed(c3);
      }
      c3.reset(clearFail);
    }, c3;
  };
  module.exports = forge.tls = forge.tls || {};
  for (key2 in tls)
    if (typeof tls[key2] !== "function")
      forge.tls[key2] = tls[key2];
  var key2;
  forge.tls.prf_tls1 = prf_TLS1;
  forge.tls.hmac_sha1 = hmac_sha1;
  forge.tls.createSessionCache = tls.createSessionCache;
  forge.tls.createConnection = tls.createConnection;
});
