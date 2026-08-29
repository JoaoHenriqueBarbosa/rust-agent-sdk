// var: require_x509
var require_x509 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_md();
  require_mgf();
  require_oids();
  require_pem();
  require_pss();
  require_rsa();
  require_util3();
  var asn1 = forge.asn1, pki = module.exports = forge.pki = forge.pki || {}, oids = pki.oids, _shortNames = {};
  _shortNames.CN = oids.commonName;
  _shortNames.commonName = "CN";
  _shortNames.C = oids.countryName;
  _shortNames.countryName = "C";
  _shortNames.L = oids.localityName;
  _shortNames.localityName = "L";
  _shortNames.ST = oids.stateOrProvinceName;
  _shortNames.stateOrProvinceName = "ST";
  _shortNames.O = oids.organizationName;
  _shortNames.organizationName = "O";
  _shortNames.OU = oids.organizationalUnitName;
  _shortNames.organizationalUnitName = "OU";
  _shortNames.E = oids.emailAddress;
  _shortNames.emailAddress = "E";
  var publicKeyValidator = forge.pki.rsa.publicKeyValidator, x509CertificateValidator = {
    name: "Certificate",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "Certificate.TBSCertificate",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "tbsCertificate",
      value: [
        {
          name: "Certificate.TBSCertificate.version",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.version.integer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: !1,
            capture: "certVersion"
          }]
        },
        {
          name: "Certificate.TBSCertificate.serialNumber",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: !1,
          capture: "certSerialNumber"
        },
        {
          name: "Certificate.TBSCertificate.signature",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "Certificate.TBSCertificate.signature.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: !1,
            capture: "certinfoSignatureOid"
          }, {
            name: "Certificate.TBSCertificate.signature.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            optional: !0,
            captureAsn1: "certinfoSignatureParams"
          }]
        },
        {
          name: "Certificate.TBSCertificate.issuer",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "certIssuer"
        },
        {
          name: "Certificate.TBSCertificate.validity",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "Certificate.TBSCertificate.validity.notBefore (utc)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity1UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity2GeneralizedTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (utc)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity3UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity4GeneralizedTime"
          }]
        },
        {
          name: "Certificate.TBSCertificate.subject",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "certSubject"
        },
        publicKeyValidator,
        {
          name: "Certificate.TBSCertificate.issuerUniqueID",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.issuerUniqueID.id",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: !1,
            captureBitStringValue: "certIssuerUniqueId"
          }]
        },
        {
          name: "Certificate.TBSCertificate.subjectUniqueID",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 2,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.subjectUniqueID.id",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: !1,
            captureBitStringValue: "certSubjectUniqueId"
          }]
        },
        {
          name: "Certificate.TBSCertificate.extensions",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 3,
          constructed: !0,
          captureAsn1: "certExtensions",
          optional: !0
        }
      ]
    }, {
      name: "Certificate.signatureAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "Certificate.signatureAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "certSignatureOid"
      }, {
        name: "Certificate.TBSCertificate.signature.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        optional: !0,
        captureAsn1: "certSignatureParams"
      }]
    }, {
      name: "Certificate.signatureValue",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.BITSTRING,
      constructed: !1,
      captureBitStringValue: "certSignature"
    }]
  }, rsassaPssParameterValidator = {
    name: "rsapss",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "rsapss.hashAlgorithm",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: !0,
      value: [{
        name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.SEQUENCE,
        constructed: !0,
        optional: !0,
        value: [{
          name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: !1,
          capture: "hashOid"
        }]
      }]
    }, {
      name: "rsapss.maskGenAlgorithm",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: !0,
      value: [{
        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.SEQUENCE,
        constructed: !0,
        optional: !0,
        value: [{
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: !1,
          capture: "maskGenOid"
        }, {
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: !1,
            capture: "maskGenHashOid"
          }]
        }]
      }]
    }, {
      name: "rsapss.saltLength",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 2,
      optional: !0,
      value: [{
        name: "rsapss.saltLength.saltLength",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.INTEGER,
        constructed: !1,
        capture: "saltLength"
      }]
    }, {
      name: "rsapss.trailerField",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 3,
      optional: !0,
      value: [{
        name: "rsapss.trailer.trailer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.INTEGER,
        constructed: !1,
        capture: "trailer"
      }]
    }]
  }, certificationRequestInfoValidator = {
    name: "CertificationRequestInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "certificationRequestInfo",
    value: [
      {
        name: "CertificationRequestInfo.integer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: !1,
        capture: "certificationRequestInfoVersion"
      },
      {
        name: "CertificationRequestInfo.subject",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "certificationRequestInfoSubject"
      },
      publicKeyValidator,
      {
        name: "CertificationRequestInfo.attributes",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: !0,
        optional: !0,
        capture: "certificationRequestInfoAttributes",
        value: [{
          name: "CertificationRequestInfo.attributes",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "CertificationRequestInfo.attributes.type",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: !1
          }, {
            name: "CertificationRequestInfo.attributes.value",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SET,
            constructed: !0
          }]
        }]
      }
    ]
  }, certificationRequestValidator = {
    name: "CertificationRequest",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "csr",
    value: [
      certificationRequestInfoValidator,
      {
        name: "CertificationRequest.signatureAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "CertificationRequest.signatureAlgorithm.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: !1,
          capture: "csrSignatureOid"
        }, {
          name: "CertificationRequest.signatureAlgorithm.parameters",
          tagClass: asn1.Class.UNIVERSAL,
          optional: !0,
          captureAsn1: "csrSignatureParams"
        }]
      },
      {
        name: "CertificationRequest.signature",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "csrSignature"
      }
    ]
  };
  pki.RDNAttributesAsArray = function(rdn, md) {
    var rval = [], set2, attr, obj;
    for (var si = 0;si < rdn.value.length; ++si) {
      set2 = rdn.value[si];
      for (var i5 = 0;i5 < set2.value.length; ++i5) {
        if (obj = {}, attr = set2.value[i5], obj.type = asn1.derToOid(attr.value[0].value), obj.value = attr.value[1].value, obj.valueTagClass = attr.value[1].type, obj.type in oids) {
          if (obj.name = oids[obj.type], obj.name in _shortNames)
            obj.shortName = _shortNames[obj.name];
        }
        if (md)
          md.update(obj.type), md.update(obj.value);
        rval.push(obj);
      }
    }
    return rval;
  };
  pki.CRIAttributesAsArray = function(attributes) {
    var rval = [];
    for (var si = 0;si < attributes.length; ++si) {
      var seq = attributes[si], type = asn1.derToOid(seq.value[0].value), values3 = seq.value[1].value;
      for (var vi = 0;vi < values3.length; ++vi) {
        var obj = {};
        if (obj.type = type, obj.value = values3[vi].value, obj.valueTagClass = values3[vi].type, obj.type in oids) {
          if (obj.name = oids[obj.type], obj.name in _shortNames)
            obj.shortName = _shortNames[obj.name];
        }
        if (obj.type === oids.extensionRequest) {
          obj.extensions = [];
          for (var ei = 0;ei < obj.value.length; ++ei)
            obj.extensions.push(pki.certificateExtensionFromAsn1(obj.value[ei]));
        }
        rval.push(obj);
      }
    }
    return rval;
  };
  function _getAttribute(obj, options) {
    if (typeof options === "string")
      options = { shortName: options };
    var rval = null, attr;
    for (var i5 = 0;rval === null && i5 < obj.attributes.length; ++i5)
      if (attr = obj.attributes[i5], options.type && options.type === attr.type)
        rval = attr;
      else if (options.name && options.name === attr.name)
        rval = attr;
      else if (options.shortName && options.shortName === attr.shortName)
        rval = attr;
    return rval;
  }
  var _readSignatureParameters = function(oid, obj, fillDefaults) {
    var params = {};
    if (oid !== oids["RSASSA-PSS"])
      return params;
    if (fillDefaults)
      params = {
        hash: {
          algorithmOid: oids.sha1
        },
        mgf: {
          algorithmOid: oids.mgf1,
          hash: {
            algorithmOid: oids.sha1
          }
        },
        saltLength: 20
      };
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, rsassaPssParameterValidator, capture, errors8)) {
      var error44 = Error("Cannot read RSASSA-PSS parameter block.");
      throw error44.errors = errors8, error44;
    }
    if (capture.hashOid !== void 0)
      params.hash = params.hash || {}, params.hash.algorithmOid = asn1.derToOid(capture.hashOid);
    if (capture.maskGenOid !== void 0)
      params.mgf = params.mgf || {}, params.mgf.algorithmOid = asn1.derToOid(capture.maskGenOid), params.mgf.hash = params.mgf.hash || {}, params.mgf.hash.algorithmOid = asn1.derToOid(capture.maskGenHashOid);
    if (capture.saltLength !== void 0)
      params.saltLength = capture.saltLength.charCodeAt(0);
    return params;
  }, _createSignatureDigest = function(options) {
    switch (oids[options.signatureOid]) {
      case "sha1WithRSAEncryption":
      case "sha1WithRSASignature":
        return forge.md.sha1.create();
      case "md5WithRSAEncryption":
        return forge.md.md5.create();
      case "sha256WithRSAEncryption":
        return forge.md.sha256.create();
      case "sha384WithRSAEncryption":
        return forge.md.sha384.create();
      case "sha512WithRSAEncryption":
        return forge.md.sha512.create();
      case "RSASSA-PSS":
        return forge.md.sha256.create();
      default:
        var error44 = Error("Could not compute " + options.type + " digest. Unknown signature OID.");
        throw error44.signatureOid = options.signatureOid, error44;
    }
  }, _verifySignature = function(options) {
    var cert = options.certificate, scheme;
    switch (cert.signatureOid) {
      case oids.sha1WithRSAEncryption:
      case oids.sha1WithRSASignature:
        break;
      case oids["RSASSA-PSS"]:
        var hash, mgf;
        if (hash = oids[cert.signatureParameters.mgf.hash.algorithmOid], hash === void 0 || forge.md[hash] === void 0) {
          var error44 = Error("Unsupported MGF hash function.");
          throw error44.oid = cert.signatureParameters.mgf.hash.algorithmOid, error44.name = hash, error44;
        }
        if (mgf = oids[cert.signatureParameters.mgf.algorithmOid], mgf === void 0 || forge.mgf[mgf] === void 0) {
          var error44 = Error("Unsupported MGF function.");
          throw error44.oid = cert.signatureParameters.mgf.algorithmOid, error44.name = mgf, error44;
        }
        if (mgf = forge.mgf[mgf].create(forge.md[hash].create()), hash = oids[cert.signatureParameters.hash.algorithmOid], hash === void 0 || forge.md[hash] === void 0) {
          var error44 = Error("Unsupported RSASSA-PSS hash function.");
          throw error44.oid = cert.signatureParameters.hash.algorithmOid, error44.name = hash, error44;
        }
        scheme = forge.pss.create(forge.md[hash].create(), mgf, cert.signatureParameters.saltLength);
        break;
    }
    return cert.publicKey.verify(options.md.digest().getBytes(), options.signature, scheme);
  };
  pki.certificateFromPem = function(pem, computeHash, strict) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
      var error44 = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
      throw error44.headerType = msg.type, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert certificate from PEM; PEM is encrypted.");
    var obj = asn1.fromDer(msg.body, strict);
    return pki.certificateFromAsn1(obj, computeHash);
  };
  pki.certificateToPem = function(cert, maxline) {
    var msg = {
      type: "CERTIFICATE",
      body: asn1.toDer(pki.certificateToAsn1(cert)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.publicKeyFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "PUBLIC KEY" && msg.type !== "RSA PUBLIC KEY") {
      var error44 = Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
      throw error44.headerType = msg.type, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert public key from PEM; PEM is encrypted.");
    var obj = asn1.fromDer(msg.body);
    return pki.publicKeyFromAsn1(obj);
  };
  pki.publicKeyToPem = function(key2, maxline) {
    var msg = {
      type: "PUBLIC KEY",
      body: asn1.toDer(pki.publicKeyToAsn1(key2)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.publicKeyToRSAPublicKeyPem = function(key2, maxline) {
    var msg = {
      type: "RSA PUBLIC KEY",
      body: asn1.toDer(pki.publicKeyToRSAPublicKey(key2)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.getPublicKeyFingerprint = function(key2, options) {
    options = options || {};
    var md = options.md || forge.md.sha1.create(), type = options.type || "RSAPublicKey", bytes;
    switch (type) {
      case "RSAPublicKey":
        bytes = asn1.toDer(pki.publicKeyToRSAPublicKey(key2)).getBytes();
        break;
      case "SubjectPublicKeyInfo":
        bytes = asn1.toDer(pki.publicKeyToAsn1(key2)).getBytes();
        break;
      default:
        throw Error('Unknown fingerprint type "' + options.type + '".');
    }
    md.start(), md.update(bytes);
    var digest = md.digest();
    if (options.encoding === "hex") {
      var hex = digest.toHex();
      if (options.delimiter)
        return hex.match(/.{2}/g).join(options.delimiter);
      return hex;
    } else if (options.encoding === "binary")
      return digest.getBytes();
    else if (options.encoding)
      throw Error('Unknown encoding "' + options.encoding + '".');
    return digest;
  };
  pki.certificationRequestFromPem = function(pem, computeHash, strict) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "CERTIFICATE REQUEST") {
      var error44 = Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
      throw error44.headerType = msg.type, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert certification request from PEM; PEM is encrypted.");
    var obj = asn1.fromDer(msg.body, strict);
    return pki.certificationRequestFromAsn1(obj, computeHash);
  };
  pki.certificationRequestToPem = function(csr, maxline) {
    var msg = {
      type: "CERTIFICATE REQUEST",
      body: asn1.toDer(pki.certificationRequestToAsn1(csr)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.createCertificate = function() {
    var cert = {};
    return cert.version = 2, cert.serialNumber = "00", cert.signatureOid = null, cert.signature = null, cert.siginfo = {}, cert.siginfo.algorithmOid = null, cert.validity = {}, cert.validity.notBefore = /* @__PURE__ */ new Date, cert.validity.notAfter = /* @__PURE__ */ new Date, cert.issuer = {}, cert.issuer.getField = function(sn) {
      return _getAttribute(cert.issuer, sn);
    }, cert.issuer.addField = function(attr) {
      _fillMissingFields([attr]), cert.issuer.attributes.push(attr);
    }, cert.issuer.attributes = [], cert.issuer.hash = null, cert.subject = {}, cert.subject.getField = function(sn) {
      return _getAttribute(cert.subject, sn);
    }, cert.subject.addField = function(attr) {
      _fillMissingFields([attr]), cert.subject.attributes.push(attr);
    }, cert.subject.attributes = [], cert.subject.hash = null, cert.extensions = [], cert.publicKey = null, cert.md = null, cert.setSubject = function(attrs, uniqueId) {
      if (_fillMissingFields(attrs), cert.subject.attributes = attrs, delete cert.subject.uniqueId, uniqueId)
        cert.subject.uniqueId = uniqueId;
      cert.subject.hash = null;
    }, cert.setIssuer = function(attrs, uniqueId) {
      if (_fillMissingFields(attrs), cert.issuer.attributes = attrs, delete cert.issuer.uniqueId, uniqueId)
        cert.issuer.uniqueId = uniqueId;
      cert.issuer.hash = null;
    }, cert.setExtensions = function(exts) {
      for (var i5 = 0;i5 < exts.length; ++i5)
        _fillMissingExtensionFields(exts[i5], { cert });
      cert.extensions = exts;
    }, cert.getExtension = function(options) {
      if (typeof options === "string")
        options = { name: options };
      var rval = null, ext;
      for (var i5 = 0;rval === null && i5 < cert.extensions.length; ++i5)
        if (ext = cert.extensions[i5], options.id && ext.id === options.id)
          rval = ext;
        else if (options.name && ext.name === options.name)
          rval = ext;
      return rval;
    }, cert.sign = function(key2, md) {
      cert.md = md || forge.md.sha1.create();
      var algorithmOid = oids[cert.md.algorithm + "WithRSAEncryption"];
      if (!algorithmOid) {
        var error44 = Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
        throw error44.algorithm = cert.md.algorithm, error44;
      }
      cert.signatureOid = cert.siginfo.algorithmOid = algorithmOid, cert.tbsCertificate = pki.getTBSCertificate(cert);
      var bytes = asn1.toDer(cert.tbsCertificate);
      cert.md.update(bytes.getBytes()), cert.signature = key2.sign(cert.md);
    }, cert.verify = function(child) {
      var rval = !1;
      if (!cert.issued(child)) {
        var issuer = child.issuer, subject = cert.subject, error44 = Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
        throw error44.expectedIssuer = subject.attributes, error44.actualIssuer = issuer.attributes, error44;
      }
      var md = child.md;
      if (md === null) {
        md = _createSignatureDigest({
          signatureOid: child.signatureOid,
          type: "certificate"
        });
        var tbsCertificate = child.tbsCertificate || pki.getTBSCertificate(child), bytes = asn1.toDer(tbsCertificate);
        md.update(bytes.getBytes());
      }
      if (md !== null)
        rval = _verifySignature({
          certificate: cert,
          md,
          signature: child.signature
        });
      return rval;
    }, cert.isIssuer = function(parent2) {
      var rval = !1, i5 = cert.issuer, s2 = parent2.subject;
      if (i5.hash && s2.hash)
        rval = i5.hash === s2.hash;
      else if (i5.attributes.length === s2.attributes.length) {
        rval = !0;
        var iattr, sattr;
        for (var n5 = 0;rval && n5 < i5.attributes.length; ++n5)
          if (iattr = i5.attributes[n5], sattr = s2.attributes[n5], iattr.type !== sattr.type || iattr.value !== sattr.value)
            rval = !1;
      }
      return rval;
    }, cert.issued = function(child) {
      return child.isIssuer(cert);
    }, cert.generateSubjectKeyIdentifier = function() {
      return pki.getPublicKeyFingerprint(cert.publicKey, { type: "RSAPublicKey" });
    }, cert.verifySubjectKeyIdentifier = function() {
      var oid = oids.subjectKeyIdentifier;
      for (var i5 = 0;i5 < cert.extensions.length; ++i5) {
        var ext = cert.extensions[i5];
        if (ext.id === oid) {
          var ski = cert.generateSubjectKeyIdentifier().getBytes();
          return forge.util.hexToBytes(ext.subjectKeyIdentifier) === ski;
        }
      }
      return !1;
    }, cert;
  };
  pki.certificateFromAsn1 = function(obj, computeHash) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, x509CertificateValidator, capture, errors8)) {
      var error44 = Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
      throw error44.errors = errors8, error44;
    }
    var oid = asn1.derToOid(capture.publicKeyOid);
    if (oid !== pki.oids.rsaEncryption)
      throw Error("Cannot read public key. OID is not RSA.");
    var cert = pki.createCertificate();
    cert.version = capture.certVersion ? capture.certVersion.charCodeAt(0) : 0;
    var serial = forge.util.createBuffer(capture.certSerialNumber);
    cert.serialNumber = serial.toHex(), cert.signatureOid = forge.asn1.derToOid(capture.certSignatureOid), cert.signatureParameters = _readSignatureParameters(cert.signatureOid, capture.certSignatureParams, !0), cert.siginfo.algorithmOid = forge.asn1.derToOid(capture.certinfoSignatureOid), cert.siginfo.parameters = _readSignatureParameters(cert.siginfo.algorithmOid, capture.certinfoSignatureParams, !1), cert.signature = capture.certSignature;
    var validity = [];
    if (capture.certValidity1UTCTime !== void 0)
      validity.push(asn1.utcTimeToDate(capture.certValidity1UTCTime));
    if (capture.certValidity2GeneralizedTime !== void 0)
      validity.push(asn1.generalizedTimeToDate(capture.certValidity2GeneralizedTime));
    if (capture.certValidity3UTCTime !== void 0)
      validity.push(asn1.utcTimeToDate(capture.certValidity3UTCTime));
    if (capture.certValidity4GeneralizedTime !== void 0)
      validity.push(asn1.generalizedTimeToDate(capture.certValidity4GeneralizedTime));
    if (validity.length > 2)
      throw Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
    if (validity.length < 2)
      throw Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
    if (cert.validity.notBefore = validity[0], cert.validity.notAfter = validity[1], cert.tbsCertificate = capture.tbsCertificate, computeHash) {
      cert.md = _createSignatureDigest({
        signatureOid: cert.signatureOid,
        type: "certificate"
      });
      var bytes = asn1.toDer(cert.tbsCertificate);
      cert.md.update(bytes.getBytes());
    }
    var imd = forge.md.sha1.create(), ibytes = asn1.toDer(capture.certIssuer);
    if (imd.update(ibytes.getBytes()), cert.issuer.getField = function(sn) {
      return _getAttribute(cert.issuer, sn);
    }, cert.issuer.addField = function(attr) {
      _fillMissingFields([attr]), cert.issuer.attributes.push(attr);
    }, cert.issuer.attributes = pki.RDNAttributesAsArray(capture.certIssuer), capture.certIssuerUniqueId)
      cert.issuer.uniqueId = capture.certIssuerUniqueId;
    cert.issuer.hash = imd.digest().toHex();
    var smd = forge.md.sha1.create(), sbytes = asn1.toDer(capture.certSubject);
    if (smd.update(sbytes.getBytes()), cert.subject.getField = function(sn) {
      return _getAttribute(cert.subject, sn);
    }, cert.subject.addField = function(attr) {
      _fillMissingFields([attr]), cert.subject.attributes.push(attr);
    }, cert.subject.attributes = pki.RDNAttributesAsArray(capture.certSubject), capture.certSubjectUniqueId)
      cert.subject.uniqueId = capture.certSubjectUniqueId;
    if (cert.subject.hash = smd.digest().toHex(), capture.certExtensions)
      cert.extensions = pki.certificateExtensionsFromAsn1(capture.certExtensions);
    else
      cert.extensions = [];
    return cert.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo), cert;
  };
  pki.certificateExtensionsFromAsn1 = function(exts) {
    var rval = [];
    for (var i5 = 0;i5 < exts.value.length; ++i5) {
      var extseq = exts.value[i5];
      for (var ei = 0;ei < extseq.value.length; ++ei)
        rval.push(pki.certificateExtensionFromAsn1(extseq.value[ei]));
    }
    return rval;
  };
  pki.certificateExtensionFromAsn1 = function(ext) {
    var e = {};
    if (e.id = asn1.derToOid(ext.value[0].value), e.critical = !1, ext.value[1].type === asn1.Type.BOOLEAN)
      e.critical = ext.value[1].value.charCodeAt(0) !== 0, e.value = ext.value[2].value;
    else
      e.value = ext.value[1].value;
    if (e.id in oids) {
      if (e.name = oids[e.id], e.name === "keyUsage") {
        var ev = asn1.fromDer(e.value), b22 = 0, b3 = 0;
        if (ev.value.length > 1)
          b22 = ev.value.charCodeAt(1), b3 = ev.value.length > 2 ? ev.value.charCodeAt(2) : 0;
        e.digitalSignature = (b22 & 128) === 128, e.nonRepudiation = (b22 & 64) === 64, e.keyEncipherment = (b22 & 32) === 32, e.dataEncipherment = (b22 & 16) === 16, e.keyAgreement = (b22 & 8) === 8, e.keyCertSign = (b22 & 4) === 4, e.cRLSign = (b22 & 2) === 2, e.encipherOnly = (b22 & 1) === 1, e.decipherOnly = (b3 & 128) === 128;
      } else if (e.name === "basicConstraints") {
        var ev = asn1.fromDer(e.value);
        if (ev.value.length > 0 && ev.value[0].type === asn1.Type.BOOLEAN)
          e.cA = ev.value[0].value.charCodeAt(0) !== 0;
        else
          e.cA = !1;
        var value = null;
        if (ev.value.length > 0 && ev.value[0].type === asn1.Type.INTEGER)
          value = ev.value[0].value;
        else if (ev.value.length > 1)
          value = ev.value[1].value;
        if (value !== null)
          e.pathLenConstraint = asn1.derToInteger(value);
      } else if (e.name === "extKeyUsage") {
        var ev = asn1.fromDer(e.value);
        for (var vi = 0;vi < ev.value.length; ++vi) {
          var oid = asn1.derToOid(ev.value[vi].value);
          if (oid in oids)
            e[oids[oid]] = !0;
          else
            e[oid] = !0;
        }
      } else if (e.name === "nsCertType") {
        var ev = asn1.fromDer(e.value), b22 = 0;
        if (ev.value.length > 1)
          b22 = ev.value.charCodeAt(1);
        e.client = (b22 & 128) === 128, e.server = (b22 & 64) === 64, e.email = (b22 & 32) === 32, e.objsign = (b22 & 16) === 16, e.reserved = (b22 & 8) === 8, e.sslCA = (b22 & 4) === 4, e.emailCA = (b22 & 2) === 2, e.objCA = (b22 & 1) === 1;
      } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
        e.altNames = [];
        var gn, ev = asn1.fromDer(e.value);
        for (var n5 = 0;n5 < ev.value.length; ++n5) {
          gn = ev.value[n5];
          var altName = {
            type: gn.type,
            value: gn.value
          };
          switch (e.altNames.push(altName), gn.type) {
            case 1:
            case 2:
            case 6:
              break;
            case 7:
              altName.ip = forge.util.bytesToIP(gn.value);
              break;
            case 8:
              altName.oid = asn1.derToOid(gn.value);
              break;
            default:
          }
        }
      } else if (e.name === "subjectKeyIdentifier") {
        var ev = asn1.fromDer(e.value);
        e.subjectKeyIdentifier = forge.util.bytesToHex(ev.value);
      }
    }
    return e;
  };
  pki.certificationRequestFromAsn1 = function(obj, computeHash) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(obj, certificationRequestValidator, capture, errors8)) {
      var error44 = Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
      throw error44.errors = errors8, error44;
    }
    var oid = asn1.derToOid(capture.publicKeyOid);
    if (oid !== pki.oids.rsaEncryption)
      throw Error("Cannot read public key. OID is not RSA.");
    var csr = pki.createCertificationRequest();
    if (csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0, csr.signatureOid = forge.asn1.derToOid(capture.csrSignatureOid), csr.signatureParameters = _readSignatureParameters(csr.signatureOid, capture.csrSignatureParams, !0), csr.siginfo.algorithmOid = forge.asn1.derToOid(capture.csrSignatureOid), csr.siginfo.parameters = _readSignatureParameters(csr.siginfo.algorithmOid, capture.csrSignatureParams, !1), csr.signature = capture.csrSignature, csr.certificationRequestInfo = capture.certificationRequestInfo, computeHash) {
      csr.md = _createSignatureDigest({
        signatureOid: csr.signatureOid,
        type: "certification request"
      });
      var bytes = asn1.toDer(csr.certificationRequestInfo);
      csr.md.update(bytes.getBytes());
    }
    var smd = forge.md.sha1.create();
    return csr.subject.getField = function(sn) {
      return _getAttribute(csr.subject, sn);
    }, csr.subject.addField = function(attr) {
      _fillMissingFields([attr]), csr.subject.attributes.push(attr);
    }, csr.subject.attributes = pki.RDNAttributesAsArray(capture.certificationRequestInfoSubject, smd), csr.subject.hash = smd.digest().toHex(), csr.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo), csr.getAttribute = function(sn) {
      return _getAttribute(csr, sn);
    }, csr.addAttribute = function(attr) {
      _fillMissingFields([attr]), csr.attributes.push(attr);
    }, csr.attributes = pki.CRIAttributesAsArray(capture.certificationRequestInfoAttributes || []), csr;
  };
  pki.createCertificationRequest = function() {
    var csr = {};
    return csr.version = 0, csr.signatureOid = null, csr.signature = null, csr.siginfo = {}, csr.siginfo.algorithmOid = null, csr.subject = {}, csr.subject.getField = function(sn) {
      return _getAttribute(csr.subject, sn);
    }, csr.subject.addField = function(attr) {
      _fillMissingFields([attr]), csr.subject.attributes.push(attr);
    }, csr.subject.attributes = [], csr.subject.hash = null, csr.publicKey = null, csr.attributes = [], csr.getAttribute = function(sn) {
      return _getAttribute(csr, sn);
    }, csr.addAttribute = function(attr) {
      _fillMissingFields([attr]), csr.attributes.push(attr);
    }, csr.md = null, csr.setSubject = function(attrs) {
      _fillMissingFields(attrs), csr.subject.attributes = attrs, csr.subject.hash = null;
    }, csr.setAttributes = function(attrs) {
      _fillMissingFields(attrs), csr.attributes = attrs;
    }, csr.sign = function(key2, md) {
      csr.md = md || forge.md.sha1.create();
      var algorithmOid = oids[csr.md.algorithm + "WithRSAEncryption"];
      if (!algorithmOid) {
        var error44 = Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
        throw error44.algorithm = csr.md.algorithm, error44;
      }
      csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid, csr.certificationRequestInfo = pki.getCertificationRequestInfo(csr);
      var bytes = asn1.toDer(csr.certificationRequestInfo);
      csr.md.update(bytes.getBytes()), csr.signature = key2.sign(csr.md);
    }, csr.verify = function() {
      var rval = !1, md = csr.md;
      if (md === null) {
        md = _createSignatureDigest({
          signatureOid: csr.signatureOid,
          type: "certification request"
        });
        var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr), bytes = asn1.toDer(cri);
        md.update(bytes.getBytes());
      }
      if (md !== null)
        rval = _verifySignature({
          certificate: csr,
          md,
          signature: csr.signature
        });
      return rval;
    }, csr;
  };
  function _dnToAsn1(obj) {
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []), attr, set2, attrs = obj.attributes;
    for (var i5 = 0;i5 < attrs.length; ++i5) {
      attr = attrs[i5];
      var value = attr.value, valueTagClass = asn1.Type.PRINTABLESTRING;
      if ("valueTagClass" in attr) {
        if (valueTagClass = attr.valueTagClass, valueTagClass === asn1.Type.UTF8)
          value = forge.util.encodeUtf8(value);
      }
      set2 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(attr.type).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, valueTagClass, !1, value)
        ])
      ]), rval.value.push(set2);
    }
    return rval;
  }
  function _fillMissingFields(attrs) {
    var attr;
    for (var i5 = 0;i5 < attrs.length; ++i5) {
      if (attr = attrs[i5], typeof attr.name > "u") {
        if (attr.type && attr.type in pki.oids)
          attr.name = pki.oids[attr.type];
        else if (attr.shortName && attr.shortName in _shortNames)
          attr.name = pki.oids[_shortNames[attr.shortName]];
      }
      if (typeof attr.type > "u")
        if (attr.name && attr.name in pki.oids)
          attr.type = pki.oids[attr.name];
        else {
          var error44 = Error("Attribute type not specified.");
          throw error44.attribute = attr, error44;
        }
      if (typeof attr.shortName > "u") {
        if (attr.name && attr.name in _shortNames)
          attr.shortName = _shortNames[attr.name];
      }
      if (attr.type === oids.extensionRequest) {
        if (attr.valueConstructed = !0, attr.valueTagClass = asn1.Type.SEQUENCE, !attr.value && attr.extensions) {
          attr.value = [];
          for (var ei = 0;ei < attr.extensions.length; ++ei)
            attr.value.push(pki.certificateExtensionToAsn1(_fillMissingExtensionFields(attr.extensions[ei])));
        }
      }
      if (typeof attr.value > "u") {
        var error44 = Error("Attribute value not specified.");
        throw error44.attribute = attr, error44;
      }
    }
  }
  function _fillMissingExtensionFields(e, options) {
    if (options = options || {}, typeof e.name > "u") {
      if (e.id && e.id in pki.oids)
        e.name = pki.oids[e.id];
    }
    if (typeof e.id > "u")
      if (e.name && e.name in pki.oids)
        e.id = pki.oids[e.name];
      else {
        var error44 = Error("Extension ID not specified.");
        throw error44.extension = e, error44;
      }
    if (typeof e.value < "u")
      return e;
    if (e.name === "keyUsage") {
      var unused = 0, b22 = 0, b3 = 0;
      if (e.digitalSignature)
        b22 |= 128, unused = 7;
      if (e.nonRepudiation)
        b22 |= 64, unused = 6;
      if (e.keyEncipherment)
        b22 |= 32, unused = 5;
      if (e.dataEncipherment)
        b22 |= 16, unused = 4;
      if (e.keyAgreement)
        b22 |= 8, unused = 3;
      if (e.keyCertSign)
        b22 |= 4, unused = 2;
      if (e.cRLSign)
        b22 |= 2, unused = 1;
      if (e.encipherOnly)
        b22 |= 1, unused = 0;
      if (e.decipherOnly)
        b3 |= 128, unused = 7;
      var value = String.fromCharCode(unused);
      if (b3 !== 0)
        value += String.fromCharCode(b22) + String.fromCharCode(b3);
      else if (b22 !== 0)
        value += String.fromCharCode(b22);
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, value);
    } else if (e.name === "basicConstraints") {
      if (e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []), e.cA)
        e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, !1, String.fromCharCode(255)));
      if ("pathLenConstraint" in e)
        e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(e.pathLenConstraint).getBytes()));
    } else if (e.name === "extKeyUsage") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
      var seq = e.value.value;
      for (var key2 in e) {
        if (e[key2] !== !0)
          continue;
        if (key2 in oids)
          seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(oids[key2]).getBytes()));
        else if (key2.indexOf(".") !== -1)
          seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(key2).getBytes()));
      }
    } else if (e.name === "nsCertType") {
      var unused = 0, b22 = 0;
      if (e.client)
        b22 |= 128, unused = 7;
      if (e.server)
        b22 |= 64, unused = 6;
      if (e.email)
        b22 |= 32, unused = 5;
      if (e.objsign)
        b22 |= 16, unused = 4;
      if (e.reserved)
        b22 |= 8, unused = 3;
      if (e.sslCA)
        b22 |= 4, unused = 2;
      if (e.emailCA)
        b22 |= 2, unused = 1;
      if (e.objCA)
        b22 |= 1, unused = 0;
      var value = String.fromCharCode(unused);
      if (b22 !== 0)
        value += String.fromCharCode(b22);
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, value);
    } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
      var altName;
      for (var n5 = 0;n5 < e.altNames.length; ++n5) {
        altName = e.altNames[n5];
        var value = altName.value;
        if (altName.type === 7 && altName.ip) {
          if (value = forge.util.bytesFromIP(altName.ip), value === null) {
            var error44 = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            throw error44.extension = e, error44;
          }
        } else if (altName.type === 8)
          if (altName.oid)
            value = asn1.oidToDer(asn1.oidToDer(altName.oid));
          else
            value = asn1.oidToDer(value);
        e.value.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, !1, value));
      }
    } else if (e.name === "nsComment" && options.cert) {
      if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128)
        throw Error('Invalid "nsComment" content.');
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.IA5STRING, !1, e.comment);
    } else if (e.name === "subjectKeyIdentifier" && options.cert) {
      var ski = options.cert.generateSubjectKeyIdentifier();
      e.subjectKeyIdentifier = ski.toHex(), e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, ski.getBytes());
    } else if (e.name === "authorityKeyIdentifier" && options.cert) {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
      var seq = e.value.value;
      if (e.keyIdentifier) {
        var keyIdentifier = e.keyIdentifier === !0 ? options.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier;
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !1, keyIdentifier));
      }
      if (e.authorityCertIssuer) {
        var authorityCertIssuer = [
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, !0, [
            _dnToAsn1(e.authorityCertIssuer === !0 ? options.cert.issuer : e.authorityCertIssuer)
          ])
        ];
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, !0, authorityCertIssuer));
      }
      if (e.serialNumber) {
        var serialNumber = forge.util.hexToBytes(e.serialNumber === !0 ? options.cert.serialNumber : e.serialNumber);
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, !1, serialNumber));
      }
    } else if (e.name === "cRLDistributionPoints") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
      var seq = e.value.value, subSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []), fullNameGeneralNames = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, []), altName;
      for (var n5 = 0;n5 < e.altNames.length; ++n5) {
        altName = e.altNames[n5];
        var value = altName.value;
        if (altName.type === 7 && altName.ip) {
          if (value = forge.util.bytesFromIP(altName.ip), value === null) {
            var error44 = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            throw error44.extension = e, error44;
          }
        } else if (altName.type === 8)
          if (altName.oid)
            value = asn1.oidToDer(asn1.oidToDer(altName.oid));
          else
            value = asn1.oidToDer(value);
        fullNameGeneralNames.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, !1, value));
      }
      subSeq.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [fullNameGeneralNames])), seq.push(subSeq);
    }
    if (typeof e.value > "u") {
      var error44 = Error("Extension value not specified.");
      throw error44.extension = e, error44;
    }
    return e;
  }
  function _signatureParametersToAsn1(oid, params) {
    switch (oid) {
      case oids["RSASSA-PSS"]:
        var parts = [];
        if (params.hash.algorithmOid !== void 0)
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(params.hash.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
            ])
          ]));
        if (params.mgf.algorithmOid !== void 0)
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(params.mgf.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
              ])
            ])
          ]));
        if (params.saltLength !== void 0)
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(params.saltLength).getBytes())
          ]));
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, parts);
      default:
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "");
    }
  }
  function _CRIAttributesToAsn1(csr) {
    var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, []);
    if (csr.attributes.length === 0)
      return rval;
    var attrs = csr.attributes;
    for (var i5 = 0;i5 < attrs.length; ++i5) {
      var attr = attrs[i5], value = attr.value, valueTagClass = asn1.Type.UTF8;
      if ("valueTagClass" in attr)
        valueTagClass = attr.valueTagClass;
      if (valueTagClass === asn1.Type.UTF8)
        value = forge.util.encodeUtf8(value);
      var valueConstructed = !1;
      if ("valueConstructed" in attr)
        valueConstructed = attr.valueConstructed;
      var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(attr.type).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, !0, [
          asn1.create(asn1.Class.UNIVERSAL, valueTagClass, valueConstructed, value)
        ])
      ]);
      rval.value.push(seq);
    }
    return rval;
  }
  var jan_1_1950 = /* @__PURE__ */ new Date("1950-01-01T00:00:00Z"), jan_1_2050 = /* @__PURE__ */ new Date("2050-01-01T00:00:00Z");
  function _dateToAsn1(date5) {
    if (date5 >= jan_1_1950 && date5 < jan_1_2050)
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, !1, asn1.dateToUtcTime(date5));
    else
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, !1, asn1.dateToGeneralizedTime(date5));
  }
  pki.getTBSCertificate = function(cert) {
    var notBefore = _dateToAsn1(cert.validity.notBefore), notAfter = _dateToAsn1(cert.validity.notAfter), tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(cert.version).getBytes())
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, forge.util.hexToBytes(cert.serialNumber)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()),
        _signatureParametersToAsn1(cert.siginfo.algorithmOid, cert.siginfo.parameters)
      ]),
      _dnToAsn1(cert.issuer),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        notBefore,
        notAfter
      ]),
      _dnToAsn1(cert.subject),
      pki.publicKeyToAsn1(cert.publicKey)
    ]);
    if (cert.issuer.uniqueId)
      tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, String.fromCharCode(0) + cert.issuer.uniqueId)
      ]));
    if (cert.subject.uniqueId)
      tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, String.fromCharCode(0) + cert.subject.uniqueId)
      ]));
    if (cert.extensions.length > 0)
      tbs.value.push(pki.certificateExtensionsToAsn1(cert.extensions));
    return tbs;
  };
  pki.getCertificationRequestInfo = function(csr) {
    var cri = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(csr.version).getBytes()),
      _dnToAsn1(csr.subject),
      pki.publicKeyToAsn1(csr.publicKey),
      _CRIAttributesToAsn1(csr)
    ]);
    return cri;
  };
  pki.distinguishedNameToAsn1 = function(dn) {
    return _dnToAsn1(dn);
  };
  pki.certificateToAsn1 = function(cert) {
    var tbsCertificate = cert.tbsCertificate || pki.getTBSCertificate(cert);
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      tbsCertificate,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(cert.signatureOid).getBytes()),
        _signatureParametersToAsn1(cert.signatureOid, cert.signatureParameters)
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, String.fromCharCode(0) + cert.signature)
    ]);
  };
  pki.certificateExtensionsToAsn1 = function(exts) {
    var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, !0, []), seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
    rval.value.push(seq);
    for (var i5 = 0;i5 < exts.length; ++i5)
      seq.value.push(pki.certificateExtensionToAsn1(exts[i5]));
    return rval;
  };
  pki.certificateExtensionToAsn1 = function(ext) {
    var extseq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
    if (extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(ext.id).getBytes())), ext.critical)
      extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, !1, String.fromCharCode(255)));
    var value = ext.value;
    if (typeof ext.value !== "string")
      value = asn1.toDer(value).getBytes();
    return extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, value)), extseq;
  };
  pki.certificationRequestToAsn1 = function(csr) {
    var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      cri,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(csr.signatureOid).getBytes()),
        _signatureParametersToAsn1(csr.signatureOid, csr.signatureParameters)
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, String.fromCharCode(0) + csr.signature)
    ]);
  };
  pki.createCaStore = function(certs) {
    var caStore = {
      certs: {}
    };
    caStore.getIssuer = function(cert2) {
      var rval = getBySubject(cert2.issuer);
      return rval;
    }, caStore.addCertificate = function(cert2) {
      if (typeof cert2 === "string")
        cert2 = forge.pki.certificateFromPem(cert2);
      if (ensureSubjectHasHash(cert2.subject), !caStore.hasCertificate(cert2))
        if (cert2.subject.hash in caStore.certs) {
          var tmp = caStore.certs[cert2.subject.hash];
          if (!forge.util.isArray(tmp))
            tmp = [tmp];
          tmp.push(cert2), caStore.certs[cert2.subject.hash] = tmp;
        } else
          caStore.certs[cert2.subject.hash] = cert2;
    }, caStore.hasCertificate = function(cert2) {
      if (typeof cert2 === "string")
        cert2 = forge.pki.certificateFromPem(cert2);
      var match = getBySubject(cert2.subject);
      if (!match)
        return !1;
      if (!forge.util.isArray(match))
        match = [match];
      var der1 = asn1.toDer(pki.certificateToAsn1(cert2)).getBytes();
      for (var i6 = 0;i6 < match.length; ++i6) {
        var der2 = asn1.toDer(pki.certificateToAsn1(match[i6])).getBytes();
        if (der1 === der2)
          return !0;
      }
      return !1;
    }, caStore.listAllCertificates = function() {
      var certList = [];
      for (var hash in caStore.certs)
        if (caStore.certs.hasOwnProperty(hash)) {
          var value = caStore.certs[hash];
          if (!forge.util.isArray(value))
            certList.push(value);
          else
            for (var i6 = 0;i6 < value.length; ++i6)
              certList.push(value[i6]);
        }
      return certList;
    }, caStore.removeCertificate = function(cert2) {
      var result;
      if (typeof cert2 === "string")
        cert2 = forge.pki.certificateFromPem(cert2);
      if (ensureSubjectHasHash(cert2.subject), !caStore.hasCertificate(cert2))
        return null;
      var match = getBySubject(cert2.subject);
      if (!forge.util.isArray(match))
        return result = caStore.certs[cert2.subject.hash], delete caStore.certs[cert2.subject.hash], result;
      var der1 = asn1.toDer(pki.certificateToAsn1(cert2)).getBytes();
      for (var i6 = 0;i6 < match.length; ++i6) {
        var der2 = asn1.toDer(pki.certificateToAsn1(match[i6])).getBytes();
        if (der1 === der2)
          result = match[i6], match.splice(i6, 1);
      }
      if (match.length === 0)
        delete caStore.certs[cert2.subject.hash];
      return result;
    };
    function getBySubject(subject) {
      return ensureSubjectHasHash(subject), caStore.certs[subject.hash] || null;
    }
    function ensureSubjectHasHash(subject) {
      if (!subject.hash) {
        var md = forge.md.sha1.create();
        subject.attributes = pki.RDNAttributesAsArray(_dnToAsn1(subject), md), subject.hash = md.digest().toHex();
      }
    }
    if (certs)
      for (var i5 = 0;i5 < certs.length; ++i5) {
        var cert = certs[i5];
        caStore.addCertificate(cert);
      }
    return caStore;
  };
  pki.certificateError = {
    bad_certificate: "forge.pki.BadCertificate",
    unsupported_certificate: "forge.pki.UnsupportedCertificate",
    certificate_revoked: "forge.pki.CertificateRevoked",
    certificate_expired: "forge.pki.CertificateExpired",
    certificate_unknown: "forge.pki.CertificateUnknown",
    unknown_ca: "forge.pki.UnknownCertificateAuthority"
  };
  pki.verifyCertificateChain = function(caStore, chain4, options) {
    if (typeof options === "function")
      options = { verify: options };
    options = options || {}, chain4 = chain4.slice(0);
    var certs = chain4.slice(0), validityCheckDate = options.validityCheckDate;
    if (typeof validityCheckDate > "u")
      validityCheckDate = /* @__PURE__ */ new Date;
    var first = !0, error44 = null, depth = 0;
    do {
      var cert = chain4.shift(), parent2 = null, selfSigned = !1;
      if (validityCheckDate) {
        if (validityCheckDate < cert.validity.notBefore || validityCheckDate > cert.validity.notAfter)
          error44 = {
            message: "Certificate is not valid yet or has expired.",
            error: pki.certificateError.certificate_expired,
            notBefore: cert.validity.notBefore,
            notAfter: cert.validity.notAfter,
            now: validityCheckDate
          };
      }
      if (error44 === null) {
        if (parent2 = chain4[0] || caStore.getIssuer(cert), parent2 === null) {
          if (cert.isIssuer(cert))
            selfSigned = !0, parent2 = cert;
        }
        if (parent2) {
          var parents = parent2;
          if (!forge.util.isArray(parents))
            parents = [parents];
          var verified = !1;
          while (!verified && parents.length > 0) {
            parent2 = parents.shift();
            try {
              verified = parent2.verify(cert);
            } catch (ex) {}
          }
          if (!verified)
            error44 = {
              message: "Certificate signature is invalid.",
              error: pki.certificateError.bad_certificate
            };
        }
        if (error44 === null && (!parent2 || selfSigned) && !caStore.hasCertificate(cert))
          error44 = {
            message: "Certificate is not trusted.",
            error: pki.certificateError.unknown_ca
          };
      }
      if (error44 === null && parent2 && !cert.isIssuer(parent2))
        error44 = {
          message: "Certificate issuer is invalid.",
          error: pki.certificateError.bad_certificate
        };
      if (error44 === null) {
        var se = {
          keyUsage: !0,
          basicConstraints: !0
        };
        for (var i5 = 0;error44 === null && i5 < cert.extensions.length; ++i5) {
          var ext = cert.extensions[i5];
          if (ext.critical && !(ext.name in se))
            error44 = {
              message: "Certificate has an unsupported critical extension.",
              error: pki.certificateError.unsupported_certificate
            };
        }
      }
      if (error44 === null && (!first || chain4.length === 0 && (!parent2 || selfSigned))) {
        var bcExt = cert.getExtension("basicConstraints"), keyUsageExt = cert.getExtension("keyUsage");
        if (keyUsageExt !== null) {
          if (!keyUsageExt.keyCertSign || bcExt === null)
            error44 = {
              message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
              error: pki.certificateError.bad_certificate
            };
        }
        if (error44 === null && bcExt === null)
          error44 = {
            message: "Certificate is missing basicConstraints extension and cannot be used as a CA.",
            error: pki.certificateError.bad_certificate
          };
        if (error44 === null && bcExt !== null && !bcExt.cA)
          error44 = {
            message: "Certificate basicConstraints indicates the certificate is not a CA.",
            error: pki.certificateError.bad_certificate
          };
        if (error44 === null && keyUsageExt !== null && "pathLenConstraint" in bcExt) {
          var pathLen = depth - 1;
          if (pathLen > bcExt.pathLenConstraint)
            error44 = {
              message: "Certificate basicConstraints pathLenConstraint violated.",
              error: pki.certificateError.bad_certificate
            };
        }
      }
      var vfd = error44 === null ? !0 : error44.error, ret = options.verify ? options.verify(vfd, depth, certs) : vfd;
      if (ret === !0)
        error44 = null;
      else {
        if (vfd === !0)
          error44 = {
            message: "The application rejected the certificate.",
            error: pki.certificateError.bad_certificate
          };
        if (ret || ret === 0) {
          if (typeof ret === "object" && !forge.util.isArray(ret)) {
            if (ret.message)
              error44.message = ret.message;
            if (ret.error)
              error44.error = ret.error;
          } else if (typeof ret === "string")
            error44.error = ret;
        }
        throw error44;
      }
      first = !1, ++depth;
    } while (chain4.length > 0);
    return !0;
  };
});
