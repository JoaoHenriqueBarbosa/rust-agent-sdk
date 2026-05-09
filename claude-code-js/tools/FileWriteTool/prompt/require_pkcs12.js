// var: require_pkcs12
var require_pkcs12 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_hmac();
  require_oids();
  require_pkcs7asn1();
  require_pbe();
  require_random();
  require_rsa();
  require_sha13();
  require_util3();
  require_x509();
  var { asn1, pki } = forge, p12 = module.exports = forge.pkcs12 = forge.pkcs12 || {}, contentInfoValidator = {
    name: "ContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "ContentInfo.contentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      captureAsn1: "content"
    }]
  }, pfxValidator = {
    name: "PFX",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [
      {
        name: "PFX.version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: !1,
        capture: "version"
      },
      contentInfoValidator,
      {
        name: "PFX.macData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: !0,
        optional: !0,
        captureAsn1: "mac",
        value: [{
          name: "PFX.macData.mac",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "PFX.macData.mac.digestAlgorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: !0,
            value: [{
              name: "PFX.macData.mac.digestAlgorithm.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: !1,
              capture: "macAlgorithm"
            }, {
              name: "PFX.macData.mac.digestAlgorithm.parameters",
              optional: !0,
              tagClass: asn1.Class.UNIVERSAL,
              captureAsn1: "macAlgorithmParameters"
            }]
          }, {
            name: "PFX.macData.mac.digest",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: !1,
            capture: "macDigest"
          }]
        }, {
          name: "PFX.macData.macSalt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: !1,
          capture: "macSalt"
        }, {
          name: "PFX.macData.iterations",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: !1,
          optional: !0,
          capture: "macIterations"
        }]
      }
    ]
  }, safeBagValidator = {
    name: "SafeBag",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SafeBag.bagId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: !1,
      capture: "bagId"
    }, {
      name: "SafeBag.bagValue",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      captureAsn1: "bagValue"
    }, {
      name: "SafeBag.bagAttributes",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: !0,
      optional: !0,
      capture: "bagAttributes"
    }]
  }, attributeValidator = {
    name: "Attribute",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "Attribute.attrId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: !1,
      capture: "oid"
    }, {
      name: "Attribute.attrValues",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: !0,
      capture: "values"
    }]
  }, certBagValidator = {
    name: "CertBag",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "CertBag.certId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: !1,
      capture: "certId"
    }, {
      name: "CertBag.certValue",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      value: [{
        name: "CertBag.certValue[0]",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.OCTETSTRING,
        constructed: !1,
        capture: "cert"
      }]
    }]
  };
  function _getBagsByAttribute(safeContents, attrName, attrValue, bagType) {
    var result = [];
    for (var i5 = 0;i5 < safeContents.length; i5++)
      for (var j4 = 0;j4 < safeContents[i5].safeBags.length; j4++) {
        var bag = safeContents[i5].safeBags[j4];
        if (bagType !== void 0 && bag.type !== bagType)
          continue;
        if (attrName === null) {
          result.push(bag);
          continue;
        }
        if (bag.attributes[attrName] !== void 0 && bag.attributes[attrName].indexOf(attrValue) >= 0)
          result.push(bag);
      }
    return result;
  }
  p12.pkcs12FromAsn1 = function(obj, strict, password) {
    if (typeof strict === "string")
      password = strict, strict = !0;
    else if (strict === void 0)
      strict = !0;
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, pfxValidator, capture, errors8)) {
      var error44 = Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
      throw error44.errors = error44, error44;
    }
    var pfx = {
      version: capture.version.charCodeAt(0),
      safeContents: [],
      getBags: function(filter2) {
        var rval = {}, localKeyId;
        if ("localKeyId" in filter2)
          localKeyId = filter2.localKeyId;
        else if ("localKeyIdHex" in filter2)
          localKeyId = forge.util.hexToBytes(filter2.localKeyIdHex);
        if (localKeyId === void 0 && !("friendlyName" in filter2) && "bagType" in filter2)
          rval[filter2.bagType] = _getBagsByAttribute(pfx.safeContents, null, null, filter2.bagType);
        if (localKeyId !== void 0)
          rval.localKeyId = _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, filter2.bagType);
        if ("friendlyName" in filter2)
          rval.friendlyName = _getBagsByAttribute(pfx.safeContents, "friendlyName", filter2.friendlyName, filter2.bagType);
        return rval;
      },
      getBagsByFriendlyName: function(friendlyName, bagType) {
        return _getBagsByAttribute(pfx.safeContents, "friendlyName", friendlyName, bagType);
      },
      getBagsByLocalKeyId: function(localKeyId, bagType) {
        return _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, bagType);
      }
    };
    if (capture.version.charCodeAt(0) !== 3) {
      var error44 = Error("PKCS#12 PFX of version other than 3 not supported.");
      throw error44.version = capture.version.charCodeAt(0), error44;
    }
    if (asn1.derToOid(capture.contentType) !== pki.oids.data) {
      var error44 = Error("Only PKCS#12 PFX in password integrity mode supported.");
      throw error44.oid = asn1.derToOid(capture.contentType), error44;
    }
    var data = capture.content.value[0];
    if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING)
      throw Error("PKCS#12 authSafe content data is not an OCTET STRING.");
    if (data = _decodePkcs7Data(data), capture.mac) {
      var md = null, macKeyBytes = 0, macAlgorithm = asn1.derToOid(capture.macAlgorithm);
      switch (macAlgorithm) {
        case pki.oids.sha1:
          md = forge.md.sha1.create(), macKeyBytes = 20;
          break;
        case pki.oids.sha256:
          md = forge.md.sha256.create(), macKeyBytes = 32;
          break;
        case pki.oids.sha384:
          md = forge.md.sha384.create(), macKeyBytes = 48;
          break;
        case pki.oids.sha512:
          md = forge.md.sha512.create(), macKeyBytes = 64;
          break;
        case pki.oids.md5:
          md = forge.md.md5.create(), macKeyBytes = 16;
          break;
      }
      if (md === null)
        throw Error("PKCS#12 uses unsupported MAC algorithm: " + macAlgorithm);
      var macSalt = new forge.util.ByteBuffer(capture.macSalt), macIterations = "macIterations" in capture ? parseInt(forge.util.bytesToHex(capture.macIterations), 16) : 1, macKey = p12.generateKey(password, macSalt, 3, macIterations, macKeyBytes, md), mac = forge.hmac.create();
      mac.start(md, macKey), mac.update(data.value);
      var macValue = mac.getMac();
      if (macValue.getBytes() !== capture.macDigest)
        throw Error("PKCS#12 MAC could not be verified. Invalid password?");
    } else if (Array.isArray(obj.value) && obj.value.length > 2)
      throw Error("Invalid PKCS#12. macData field present but MAC was not validated.");
    return _decodeAuthenticatedSafe(pfx, data.value, strict, password), pfx;
  };
  function _decodePkcs7Data(data) {
    if (data.composed || data.constructed) {
      var value = forge.util.createBuffer();
      for (var i5 = 0;i5 < data.value.length; ++i5)
        value.putBytes(data.value[i5].value);
      data.composed = data.constructed = !1, data.value = value.getBytes();
    }
    return data;
  }
  function _decodeAuthenticatedSafe(pfx, authSafe, strict, password) {
    if (authSafe = asn1.fromDer(authSafe, strict), authSafe.tagClass !== asn1.Class.UNIVERSAL || authSafe.type !== asn1.Type.SEQUENCE || authSafe.constructed !== !0)
      throw Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
    for (var i5 = 0;i5 < authSafe.value.length; i5++) {
      var contentInfo = authSafe.value[i5], capture = {}, errors8 = [];
      if (!asn1.validate(contentInfo, contentInfoValidator, capture, errors8)) {
        var error44 = Error("Cannot read ContentInfo.");
        throw error44.errors = errors8, error44;
      }
      var obj = {
        encrypted: !1
      }, safeContents = null, data = capture.content.value[0];
      switch (asn1.derToOid(capture.contentType)) {
        case pki.oids.data:
          if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING)
            throw Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
          safeContents = _decodePkcs7Data(data).value;
          break;
        case pki.oids.encryptedData:
          safeContents = _decryptSafeContents(data, password), obj.encrypted = !0;
          break;
        default:
          var error44 = Error("Unsupported PKCS#12 contentType.");
          throw error44.contentType = asn1.derToOid(capture.contentType), error44;
      }
      obj.safeBags = _decodeSafeContents(safeContents, strict, password), pfx.safeContents.push(obj);
    }
  }
  function _decryptSafeContents(data, password) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(data, forge.pkcs7.asn1.encryptedDataValidator, capture, errors8)) {
      var error44 = Error("Cannot read EncryptedContentInfo.");
      throw error44.errors = errors8, error44;
    }
    var oid = asn1.derToOid(capture.contentType);
    if (oid !== pki.oids.data) {
      var error44 = Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
      throw error44.oid = oid, error44;
    }
    oid = asn1.derToOid(capture.encAlgorithm);
    var cipher = pki.pbe.getCipher(oid, capture.encParameter, password), encryptedContentAsn1 = _decodePkcs7Data(capture.encryptedContentAsn1), encrypted = forge.util.createBuffer(encryptedContentAsn1.value);
    if (cipher.update(encrypted), !cipher.finish())
      throw Error("Failed to decrypt PKCS#12 SafeContents.");
    return cipher.output.getBytes();
  }
  function _decodeSafeContents(safeContents, strict, password) {
    if (!strict && safeContents.length === 0)
      return [];
    if (safeContents = asn1.fromDer(safeContents, strict), safeContents.tagClass !== asn1.Class.UNIVERSAL || safeContents.type !== asn1.Type.SEQUENCE || safeContents.constructed !== !0)
      throw Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
    var res = [];
    for (var i5 = 0;i5 < safeContents.value.length; i5++) {
      var safeBag = safeContents.value[i5], capture = {}, errors8 = [];
      if (!asn1.validate(safeBag, safeBagValidator, capture, errors8)) {
        var error44 = Error("Cannot read SafeBag.");
        throw error44.errors = errors8, error44;
      }
      var bag = {
        type: asn1.derToOid(capture.bagId),
        attributes: _decodeBagAttributes(capture.bagAttributes)
      };
      res.push(bag);
      var validator, decoder, bagAsn1 = capture.bagValue.value[0];
      switch (bag.type) {
        case pki.oids.pkcs8ShroudedKeyBag:
          if (bagAsn1 = pki.decryptPrivateKeyInfo(bagAsn1, password), bagAsn1 === null)
            throw Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
        case pki.oids.keyBag:
          try {
            bag.key = pki.privateKeyFromAsn1(bagAsn1);
          } catch (e) {
            bag.key = null, bag.asn1 = bagAsn1;
          }
          continue;
        case pki.oids.certBag:
          validator = certBagValidator, decoder = function() {
            if (asn1.derToOid(capture.certId) !== pki.oids.x509Certificate) {
              var error45 = Error("Unsupported certificate type, only X.509 supported.");
              throw error45.oid = asn1.derToOid(capture.certId), error45;
            }
            var certAsn1 = asn1.fromDer(capture.cert, strict);
            try {
              bag.cert = pki.certificateFromAsn1(certAsn1, !0);
            } catch (e) {
              bag.cert = null, bag.asn1 = certAsn1;
            }
          };
          break;
        default:
          var error44 = Error("Unsupported PKCS#12 SafeBag type.");
          throw error44.oid = bag.type, error44;
      }
      if (validator !== void 0 && !asn1.validate(bagAsn1, validator, capture, errors8)) {
        var error44 = Error("Cannot read PKCS#12 " + validator.name);
        throw error44.errors = errors8, error44;
      }
      decoder();
    }
    return res;
  }
  function _decodeBagAttributes(attributes) {
    var decodedAttrs = {};
    if (attributes !== void 0)
      for (var i5 = 0;i5 < attributes.length; ++i5) {
        var capture = {}, errors8 = [];
        if (!asn1.validate(attributes[i5], attributeValidator, capture, errors8)) {
          var error44 = Error("Cannot read PKCS#12 BagAttribute.");
          throw error44.errors = errors8, error44;
        }
        var oid = asn1.derToOid(capture.oid);
        if (pki.oids[oid] === void 0)
          continue;
        decodedAttrs[pki.oids[oid]] = [];
        for (var j4 = 0;j4 < capture.values.length; ++j4)
          decodedAttrs[pki.oids[oid]].push(capture.values[j4].value);
      }
    return decodedAttrs;
  }
  p12.toPkcs12Asn1 = function(key2, cert, password, options) {
    if (options = options || {}, options.saltSize = options.saltSize || 8, options.count = options.count || 2048, options.algorithm = options.algorithm || options.encAlgorithm || "aes128", !("useMac" in options))
      options.useMac = !0;
    if (!("localKeyId" in options))
      options.localKeyId = null;
    if (!("generateLocalKeyId" in options))
      options.generateLocalKeyId = !0;
    var localKeyId = options.localKeyId, bagAttrs;
    if (localKeyId !== null)
      localKeyId = forge.util.hexToBytes(localKeyId);
    else if (options.generateLocalKeyId)
      if (cert) {
        var pairedCert = forge.util.isArray(cert) ? cert[0] : cert;
        if (typeof pairedCert === "string")
          pairedCert = pki.certificateFromPem(pairedCert);
        var sha1 = forge.md.sha1.create();
        sha1.update(asn1.toDer(pki.certificateToAsn1(pairedCert)).getBytes()), localKeyId = sha1.digest().getBytes();
      } else
        localKeyId = forge.random.getBytes(20);
    var attrs = [];
    if (localKeyId !== null)
      attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.localKeyId).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, localKeyId)
        ])
      ]));
    if ("friendlyName" in options)
      attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.friendlyName).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BMPSTRING, !1, options.friendlyName)
        ])
      ]));
    if (attrs.length > 0)
      bagAttrs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, attrs);
    var contents = [], chain4 = [];
    if (cert !== null)
      if (forge.util.isArray(cert))
        chain4 = cert;
      else
        chain4 = [cert];
    var certSafeBags = [];
    for (var i5 = 0;i5 < chain4.length; ++i5) {
      if (cert = chain4[i5], typeof cert === "string")
        cert = pki.certificateFromPem(cert);
      var certBagAttrs = i5 === 0 ? bagAttrs : void 0, certAsn1 = pki.certificateToAsn1(cert), certSafeBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.certBag).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.x509Certificate).getBytes()),
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, asn1.toDer(certAsn1).getBytes())
            ])
          ])
        ]),
        certBagAttrs
      ]);
      certSafeBags.push(certSafeBag);
    }
    if (certSafeBags.length > 0) {
      var certSafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, certSafeBags), certCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, asn1.toDer(certSafeContents).getBytes())
        ])
      ]);
      contents.push(certCI);
    }
    var keyBag = null;
    if (key2 !== null) {
      var pkAsn1 = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(key2));
      if (password === null)
        keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.keyBag).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
            pkAsn1
          ]),
          bagAttrs
        ]);
      else
        keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.pkcs8ShroudedKeyBag).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
            pki.encryptPrivateKeyInfo(pkAsn1, password, options)
          ]),
          bagAttrs
        ]);
      var keySafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [keyBag]), keyCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, asn1.toDer(keySafeContents).getBytes())
        ])
      ]);
      contents.push(keyCI);
    }
    var safe = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, contents), macData;
    if (options.useMac) {
      var sha1 = forge.md.sha1.create(), macSalt = new forge.util.ByteBuffer(forge.random.getBytes(options.saltSize)), count3 = options.count, key2 = p12.generateKey(password, macSalt, 3, count3, 20), mac = forge.hmac.create();
      mac.start(sha1, key2), mac.update(asn1.toDer(safe).getBytes());
      var macValue = mac.getMac();
      macData = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.sha1).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, macValue.getBytes())
        ]),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, macSalt.getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(count3).getBytes())
      ]);
    }
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(3).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, asn1.toDer(safe).getBytes())
        ])
      ]),
      macData
    ]);
  };
  p12.generateKey = forge.pbe.generatePkcs12Key;
});
