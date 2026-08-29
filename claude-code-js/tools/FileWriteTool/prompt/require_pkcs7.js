// var: require_pkcs7
var require_pkcs7 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_oids();
  require_pem();
  require_pkcs7asn1();
  require_random();
  require_util3();
  require_x509();
  var asn1 = forge.asn1, p7 = module.exports = forge.pkcs7 = forge.pkcs7 || {};
  p7.messageFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "PKCS7") {
      var error44 = Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
      throw error44.headerType = msg.type, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
    var obj = asn1.fromDer(msg.body);
    return p7.messageFromAsn1(obj);
  };
  p7.messageToPem = function(msg, maxline) {
    var pemObj = {
      type: "PKCS7",
      body: asn1.toDer(msg.toAsn1()).getBytes()
    };
    return forge.pem.encode(pemObj, { maxline });
  };
  p7.messageFromAsn1 = function(obj) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, p7.asn1.contentInfoValidator, capture, errors8)) {
      var error44 = Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
      throw error44.errors = errors8, error44;
    }
    var contentType = asn1.derToOid(capture.contentType), msg;
    switch (contentType) {
      case forge.pki.oids.envelopedData:
        msg = p7.createEnvelopedData();
        break;
      case forge.pki.oids.encryptedData:
        msg = p7.createEncryptedData();
        break;
      case forge.pki.oids.signedData:
        msg = p7.createSignedData();
        break;
      default:
        throw Error("Cannot read PKCS#7 message. ContentType with OID " + contentType + " is not (yet) supported.");
    }
    return msg.fromAsn1(capture.content.value[0]), msg;
  };
  p7.createSignedData = function() {
    var msg = null;
    return msg = {
      type: forge.pki.oids.signedData,
      version: 1,
      certificates: [],
      crls: [],
      signers: [],
      digestAlgorithmIdentifiers: [],
      contentInfo: null,
      signerInfos: [],
      fromAsn1: function(obj) {
        if (_fromAsn1(msg, obj, p7.asn1.signedDataValidator), msg.certificates = [], msg.crls = [], msg.digestAlgorithmIdentifiers = [], msg.contentInfo = null, msg.signerInfos = [], msg.rawCapture.certificates) {
          var certs = msg.rawCapture.certificates.value;
          for (var i5 = 0;i5 < certs.length; ++i5)
            msg.certificates.push(forge.pki.certificateFromAsn1(certs[i5]));
        }
      },
      toAsn1: function() {
        if (!msg.contentInfo)
          msg.sign();
        var certs = [];
        for (var i5 = 0;i5 < msg.certificates.length; ++i5)
          certs.push(forge.pki.certificateToAsn1(msg.certificates[i5]));
        var crls = [], signedData = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(msg.version).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, msg.digestAlgorithmIdentifiers),
            msg.contentInfo
          ])
        ]);
        if (certs.length > 0)
          signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, certs));
        if (crls.length > 0)
          signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, !0, crls));
        return signedData.value[0].value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, msg.signerInfos)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(msg.type).getBytes()),
          signedData
        ]);
      },
      addSigner: function(signer) {
        var { issuer, serialNumber } = signer;
        if (signer.certificate) {
          var cert = signer.certificate;
          if (typeof cert === "string")
            cert = forge.pki.certificateFromPem(cert);
          issuer = cert.issuer.attributes, serialNumber = cert.serialNumber;
        }
        var key2 = signer.key;
        if (!key2)
          throw Error("Could not add PKCS#7 signer; no private key specified.");
        if (typeof key2 === "string")
          key2 = forge.pki.privateKeyFromPem(key2);
        var digestAlgorithm = signer.digestAlgorithm || forge.pki.oids.sha1;
        switch (digestAlgorithm) {
          case forge.pki.oids.sha1:
          case forge.pki.oids.sha256:
          case forge.pki.oids.sha384:
          case forge.pki.oids.sha512:
          case forge.pki.oids.md5:
            break;
          default:
            throw Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + digestAlgorithm);
        }
        var authenticatedAttributes = signer.authenticatedAttributes || [];
        if (authenticatedAttributes.length > 0) {
          var contentType = !1, messageDigest = !1;
          for (var i5 = 0;i5 < authenticatedAttributes.length; ++i5) {
            var attr = authenticatedAttributes[i5];
            if (!contentType && attr.type === forge.pki.oids.contentType) {
              if (contentType = !0, messageDigest)
                break;
              continue;
            }
            if (!messageDigest && attr.type === forge.pki.oids.messageDigest) {
              if (messageDigest = !0, contentType)
                break;
              continue;
            }
          }
          if (!contentType || !messageDigest)
            throw Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.");
        }
        msg.signers.push({
          key: key2,
          version: 1,
          issuer,
          serialNumber,
          digestAlgorithm,
          signatureAlgorithm: forge.pki.oids.rsaEncryption,
          signature: null,
          authenticatedAttributes,
          unauthenticatedAttributes: []
        });
      },
      sign: function(options) {
        if (options = options || {}, typeof msg.content !== "object" || msg.contentInfo === null) {
          if (msg.contentInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(forge.pki.oids.data).getBytes())
          ]), "content" in msg) {
            var content;
            if (msg.content instanceof forge.util.ByteBuffer)
              content = msg.content.bytes();
            else if (typeof msg.content === "string")
              content = forge.util.encodeUtf8(msg.content);
            if (options.detached)
              msg.detachedContent = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, content);
            else
              msg.contentInfo.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, content)
              ]));
          }
        }
        if (msg.signers.length === 0)
          return;
        var mds = addDigestAlgorithmIds();
        addSignerInfos(mds);
      },
      verify: function() {
        throw Error("PKCS#7 signature verification not yet implemented.");
      },
      addCertificate: function(cert) {
        if (typeof cert === "string")
          cert = forge.pki.certificateFromPem(cert);
        msg.certificates.push(cert);
      },
      addCertificateRevokationList: function(crl) {
        throw Error("PKCS#7 CRL support not yet implemented.");
      }
    }, msg;
    function addDigestAlgorithmIds() {
      var mds = {};
      for (var i5 = 0;i5 < msg.signers.length; ++i5) {
        var signer = msg.signers[i5], oid = signer.digestAlgorithm;
        if (!(oid in mds))
          mds[oid] = forge.md[forge.pki.oids[oid]].create();
        if (signer.authenticatedAttributes.length === 0)
          signer.md = mds[oid];
        else
          signer.md = forge.md[forge.pki.oids[oid]].create();
      }
      msg.digestAlgorithmIdentifiers = [];
      for (var oid in mds)
        msg.digestAlgorithmIdentifiers.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(oid).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
        ]));
      return mds;
    }
    function addSignerInfos(mds) {
      var content;
      if (msg.detachedContent)
        content = msg.detachedContent;
      else
        content = msg.contentInfo.value[1], content = content.value[0];
      if (!content)
        throw Error("Could not sign PKCS#7 message; there is no content to sign.");
      var contentType = asn1.derToOid(msg.contentInfo.value[0].value), bytes = asn1.toDer(content);
      bytes.getByte(), asn1.getBerValueLength(bytes), bytes = bytes.getBytes();
      for (var oid in mds)
        mds[oid].start().update(bytes);
      var signingTime = /* @__PURE__ */ new Date;
      for (var i5 = 0;i5 < msg.signers.length; ++i5) {
        var signer = msg.signers[i5];
        if (signer.authenticatedAttributes.length === 0) {
          if (contentType !== forge.pki.oids.data)
            throw Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.");
        } else {
          signer.authenticatedAttributesAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, []);
          var attrsAsn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, []);
          for (var ai = 0;ai < signer.authenticatedAttributes.length; ++ai) {
            var attr = signer.authenticatedAttributes[ai];
            if (attr.type === forge.pki.oids.messageDigest)
              attr.value = mds[signer.digestAlgorithm].digest();
            else if (attr.type === forge.pki.oids.signingTime) {
              if (!attr.value)
                attr.value = signingTime;
            }
            attrsAsn1.value.push(_attributeToAsn1(attr)), signer.authenticatedAttributesAsn1.value.push(_attributeToAsn1(attr));
          }
          bytes = asn1.toDer(attrsAsn1).getBytes(), signer.md.start().update(bytes);
        }
        signer.signature = signer.key.sign(signer.md, "RSASSA-PKCS1-V1_5");
      }
      msg.signerInfos = _signersToAsn1(msg.signers);
    }
  };
  p7.createEncryptedData = function() {
    var msg = null;
    return msg = {
      type: forge.pki.oids.encryptedData,
      version: 0,
      encryptedContent: {
        algorithm: forge.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(obj) {
        _fromAsn1(msg, obj, p7.asn1.encryptedDataValidator);
      },
      decrypt: function(key2) {
        if (key2 !== void 0)
          msg.encryptedContent.key = key2;
        _decryptContent(msg);
      }
    }, msg;
  };
  p7.createEnvelopedData = function() {
    var msg = null;
    return msg = {
      type: forge.pki.oids.envelopedData,
      version: 0,
      recipients: [],
      encryptedContent: {
        algorithm: forge.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(obj) {
        var capture = _fromAsn1(msg, obj, p7.asn1.envelopedDataValidator);
        msg.recipients = _recipientsFromAsn1(capture.recipientInfos.value);
      },
      toAsn1: function() {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(msg.type).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(msg.version).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, _recipientsToAsn1(msg.recipients)),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, _encryptedContentToAsn1(msg.encryptedContent))
            ])
          ])
        ]);
      },
      findRecipient: function(cert) {
        var sAttr = cert.issuer.attributes;
        for (var i5 = 0;i5 < msg.recipients.length; ++i5) {
          var r4 = msg.recipients[i5], rAttr = r4.issuer;
          if (r4.serialNumber !== cert.serialNumber)
            continue;
          if (rAttr.length !== sAttr.length)
            continue;
          var match = !0;
          for (var j4 = 0;j4 < sAttr.length; ++j4)
            if (rAttr[j4].type !== sAttr[j4].type || rAttr[j4].value !== sAttr[j4].value) {
              match = !1;
              break;
            }
          if (match)
            return r4;
        }
        return null;
      },
      decrypt: function(recipient, privKey) {
        if (msg.encryptedContent.key === void 0 && recipient !== void 0 && privKey !== void 0)
          switch (recipient.encryptedContent.algorithm) {
            case forge.pki.oids.rsaEncryption:
            case forge.pki.oids.desCBC:
              var key2 = privKey.decrypt(recipient.encryptedContent.content);
              msg.encryptedContent.key = forge.util.createBuffer(key2);
              break;
            default:
              throw Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
          }
        _decryptContent(msg);
      },
      addRecipient: function(cert) {
        msg.recipients.push({
          version: 0,
          issuer: cert.issuer.attributes,
          serialNumber: cert.serialNumber,
          encryptedContent: {
            algorithm: forge.pki.oids.rsaEncryption,
            key: cert.publicKey
          }
        });
      },
      encrypt: function(key2, cipher) {
        if (msg.encryptedContent.content === void 0) {
          cipher = cipher || msg.encryptedContent.algorithm, key2 = key2 || msg.encryptedContent.key;
          var keyLen, ivLen, ciphFn;
          switch (cipher) {
            case forge.pki.oids["aes128-CBC"]:
              keyLen = 16, ivLen = 16, ciphFn = forge.aes.createEncryptionCipher;
              break;
            case forge.pki.oids["aes192-CBC"]:
              keyLen = 24, ivLen = 16, ciphFn = forge.aes.createEncryptionCipher;
              break;
            case forge.pki.oids["aes256-CBC"]:
              keyLen = 32, ivLen = 16, ciphFn = forge.aes.createEncryptionCipher;
              break;
            case forge.pki.oids["des-EDE3-CBC"]:
              keyLen = 24, ivLen = 8, ciphFn = forge.des.createEncryptionCipher;
              break;
            default:
              throw Error("Unsupported symmetric cipher, OID " + cipher);
          }
          if (key2 === void 0)
            key2 = forge.util.createBuffer(forge.random.getBytes(keyLen));
          else if (key2.length() != keyLen)
            throw Error("Symmetric key has wrong length; got " + key2.length() + " bytes, expected " + keyLen + ".");
          msg.encryptedContent.algorithm = cipher, msg.encryptedContent.key = key2, msg.encryptedContent.parameter = forge.util.createBuffer(forge.random.getBytes(ivLen));
          var ciph = ciphFn(key2);
          if (ciph.start(msg.encryptedContent.parameter.copy()), ciph.update(msg.content), !ciph.finish())
            throw Error("Symmetric encryption failed.");
          msg.encryptedContent.content = ciph.output;
        }
        for (var i5 = 0;i5 < msg.recipients.length; ++i5) {
          var recipient = msg.recipients[i5];
          if (recipient.encryptedContent.content !== void 0)
            continue;
          switch (recipient.encryptedContent.algorithm) {
            case forge.pki.oids.rsaEncryption:
              recipient.encryptedContent.content = recipient.encryptedContent.key.encrypt(msg.encryptedContent.key.data);
              break;
            default:
              throw Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
          }
        }
      }
    }, msg;
  };
  function _recipientFromAsn1(obj) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, p7.asn1.recipientInfoValidator, capture, errors8)) {
      var error44 = Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
      throw error44.errors = errors8, error44;
    }
    return {
      version: capture.version.charCodeAt(0),
      issuer: forge.pki.RDNAttributesAsArray(capture.issuer),
      serialNumber: forge.util.createBuffer(capture.serial).toHex(),
      encryptedContent: {
        algorithm: asn1.derToOid(capture.encAlgorithm),
        parameter: capture.encParameter ? capture.encParameter.value : void 0,
        content: capture.encKey
      }
    };
  }
  function _recipientToAsn1(obj) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(obj.version).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, forge.util.hexToBytes(obj.serialNumber))
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(obj.encryptedContent.algorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, obj.encryptedContent.content)
    ]);
  }
  function _recipientsFromAsn1(infos) {
    var ret = [];
    for (var i5 = 0;i5 < infos.length; ++i5)
      ret.push(_recipientFromAsn1(infos[i5]));
    return ret;
  }
  function _recipientsToAsn1(recipients) {
    var ret = [];
    for (var i5 = 0;i5 < recipients.length; ++i5)
      ret.push(_recipientToAsn1(recipients[i5]));
    return ret;
  }
  function _signerToAsn1(obj) {
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(obj.version).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, forge.util.hexToBytes(obj.serialNumber))
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(obj.digestAlgorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
      ])
    ]);
    if (obj.authenticatedAttributesAsn1)
      rval.value.push(obj.authenticatedAttributesAsn1);
    if (rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(obj.signatureAlgorithm).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
    ])), rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, obj.signature)), obj.unauthenticatedAttributes.length > 0) {
      var attrsAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, !0, []);
      for (var i5 = 0;i5 < obj.unauthenticatedAttributes.length; ++i5) {
        var attr = obj.unauthenticatedAttributes[i5];
        attrsAsn1.values.push(_attributeToAsn1(attr));
      }
      rval.value.push(attrsAsn1);
    }
    return rval;
  }
  function _signersToAsn1(signers) {
    var ret = [];
    for (var i5 = 0;i5 < signers.length; ++i5)
      ret.push(_signerToAsn1(signers[i5]));
    return ret;
  }
  function _attributeToAsn1(attr) {
    var value;
    if (attr.type === forge.pki.oids.contentType)
      value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(attr.value).getBytes());
    else if (attr.type === forge.pki.oids.messageDigest)
      value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, attr.value.bytes());
    else if (attr.type === forge.pki.oids.signingTime) {
      var jan_1_1950 = /* @__PURE__ */ new Date("1950-01-01T00:00:00Z"), jan_1_2050 = /* @__PURE__ */ new Date("2050-01-01T00:00:00Z"), date5 = attr.value;
      if (typeof date5 === "string") {
        var timestamp = Date.parse(date5);
        if (!isNaN(timestamp))
          date5 = new Date(timestamp);
        else if (date5.length === 13)
          date5 = asn1.utcTimeToDate(date5);
        else
          date5 = asn1.generalizedTimeToDate(date5);
      }
      if (date5 >= jan_1_1950 && date5 < jan_1_2050)
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, !1, asn1.dateToUtcTime(date5));
      else
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, !1, asn1.dateToGeneralizedTime(date5));
    }
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(attr.type).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, [
        value
      ])
    ]);
  }
  function _encryptedContentToAsn1(ec2) {
    return [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(forge.pki.oids.data).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(ec2.algorithm).getBytes()),
        !ec2.parameter ? void 0 : asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, ec2.parameter.getBytes())
      ]),
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, ec2.content.getBytes())
      ])
    ];
  }
  function _fromAsn1(msg, obj, validator) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, validator, capture, errors8)) {
      var error44 = Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
      throw error44.errors = error44, error44;
    }
    var contentType = asn1.derToOid(capture.contentType);
    if (contentType !== forge.pki.oids.data)
      throw Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
    if (capture.encryptedContent) {
      var content = "";
      if (forge.util.isArray(capture.encryptedContent))
        for (var i5 = 0;i5 < capture.encryptedContent.length; ++i5) {
          if (capture.encryptedContent[i5].type !== asn1.Type.OCTETSTRING)
            throw Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
          content += capture.encryptedContent[i5].value;
        }
      else
        content = capture.encryptedContent;
      msg.encryptedContent = {
        algorithm: asn1.derToOid(capture.encAlgorithm),
        parameter: forge.util.createBuffer(capture.encParameter.value),
        content: forge.util.createBuffer(content)
      };
    }
    if (capture.content) {
      var content = "";
      if (forge.util.isArray(capture.content))
        for (var i5 = 0;i5 < capture.content.length; ++i5) {
          if (capture.content[i5].type !== asn1.Type.OCTETSTRING)
            throw Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
          content += capture.content[i5].value;
        }
      else
        content = capture.content;
      msg.content = forge.util.createBuffer(content);
    }
    return msg.version = capture.version.charCodeAt(0), msg.rawCapture = capture, capture;
  }
  function _decryptContent(msg) {
    if (msg.encryptedContent.key === void 0)
      throw Error("Symmetric key not available.");
    if (msg.content === void 0) {
      var ciph;
      switch (msg.encryptedContent.algorithm) {
        case forge.pki.oids["aes128-CBC"]:
        case forge.pki.oids["aes192-CBC"]:
        case forge.pki.oids["aes256-CBC"]:
          ciph = forge.aes.createDecryptionCipher(msg.encryptedContent.key);
          break;
        case forge.pki.oids.desCBC:
        case forge.pki.oids["des-EDE3-CBC"]:
          ciph = forge.des.createDecryptionCipher(msg.encryptedContent.key);
          break;
        default:
          throw Error("Unsupported symmetric cipher, OID " + msg.encryptedContent.algorithm);
      }
      if (ciph.start(msg.encryptedContent.parameter), ciph.update(msg.encryptedContent.content), !ciph.finish())
        throw Error("Symmetric decryption failed.");
      msg.content = ciph.output;
    }
  }
});
