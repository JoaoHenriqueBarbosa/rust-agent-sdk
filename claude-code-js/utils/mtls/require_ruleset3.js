// var: require_ruleset3
var require_ruleset3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ruleSet = void 0;
  var F2 = "required", G3 = "type", H2 = "fn", I2 = "argv", J = "ref", a2 = !1, b = !0, c3 = "booleanEquals", d = "stringEquals", e = "sigv4", f = "sts", g = "us-east-1", h2 = "endpoint", i2 = "https://sts.{Region}.{PartitionResult#dnsSuffix}", j2 = "tree", k = "error", l = "getAttr", m = { [F2]: !1, [G3]: "string" }, n2 = { [F2]: !0, default: !1, [G3]: "boolean" }, o2 = { [J]: "Endpoint" }, p = { [H2]: "isSet", [I2]: [{ [J]: "Region" }] }, q = { [J]: "Region" }, r = { [H2]: "aws.partition", [I2]: [q], assign: "PartitionResult" }, s = { [J]: "UseFIPS" }, t = { [J]: "UseDualStack" }, u4 = {
    url: "https://sts.amazonaws.com",
    properties: { authSchemes: [{ name: e, signingName: f, signingRegion: g }] },
    headers: {}
  }, v = {}, w = { conditions: [{ [H2]: d, [I2]: [q, "aws-global"] }], [h2]: u4, [G3]: h2 }, x2 = { [H2]: c3, [I2]: [s, !0] }, y = { [H2]: c3, [I2]: [t, !0] }, z = { [H2]: l, [I2]: [{ [J]: "PartitionResult" }, "supportsFIPS"] }, A = { [J]: "PartitionResult" }, B = { [H2]: c3, [I2]: [!0, { [H2]: l, [I2]: [A, "supportsDualStack"] }] }, C2 = [{ [H2]: "isSet", [I2]: [o2] }], D = [x2], E = [y], _data = {
    version: "1.0",
    parameters: { Region: m, UseDualStack: n2, UseFIPS: n2, Endpoint: m, UseGlobalEndpoint: n2 },
    rules: [
      {
        conditions: [
          { [H2]: c3, [I2]: [{ [J]: "UseGlobalEndpoint" }, b] },
          { [H2]: "not", [I2]: C2 },
          p,
          r,
          { [H2]: c3, [I2]: [s, a2] },
          { [H2]: c3, [I2]: [t, a2] }
        ],
        rules: [
          { conditions: [{ [H2]: d, [I2]: [q, "ap-northeast-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "ap-south-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "ap-southeast-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "ap-southeast-2"] }], endpoint: u4, [G3]: h2 },
          w,
          { conditions: [{ [H2]: d, [I2]: [q, "ca-central-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "eu-central-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "eu-north-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "eu-west-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "eu-west-2"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "eu-west-3"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "sa-east-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, g] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "us-east-2"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "us-west-1"] }], endpoint: u4, [G3]: h2 },
          { conditions: [{ [H2]: d, [I2]: [q, "us-west-2"] }], endpoint: u4, [G3]: h2 },
          {
            endpoint: {
              url: i2,
              properties: { authSchemes: [{ name: e, signingName: f, signingRegion: "{Region}" }] },
              headers: v
            },
            [G3]: h2
          }
        ],
        [G3]: j2
      },
      {
        conditions: C2,
        rules: [
          { conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G3]: k },
          { conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G3]: k },
          { endpoint: { url: o2, properties: v, headers: v }, [G3]: h2 }
        ],
        [G3]: j2
      },
      {
        conditions: [p],
        rules: [
          {
            conditions: [r],
            rules: [
              {
                conditions: [x2, y],
                rules: [
                  {
                    conditions: [{ [H2]: c3, [I2]: [b, z] }, B],
                    rules: [
                      {
                        endpoint: {
                          url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: v,
                          headers: v
                        },
                        [G3]: h2
                      }
                    ],
                    [G3]: j2
                  },
                  { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G3]: k }
                ],
                [G3]: j2
              },
              {
                conditions: D,
                rules: [
                  {
                    conditions: [{ [H2]: c3, [I2]: [z, b] }],
                    rules: [
                      {
                        conditions: [{ [H2]: d, [I2]: [{ [H2]: l, [I2]: [A, "name"] }, "aws-us-gov"] }],
                        endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v },
                        [G3]: h2
                      },
                      {
                        endpoint: {
                          url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                          properties: v,
                          headers: v
                        },
                        [G3]: h2
                      }
                    ],
                    [G3]: j2
                  },
                  { error: "FIPS is enabled but this partition does not support FIPS", [G3]: k }
                ],
                [G3]: j2
              },
              {
                conditions: E,
                rules: [
                  {
                    conditions: [B],
                    rules: [
                      {
                        endpoint: {
                          url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: v,
                          headers: v
                        },
                        [G3]: h2
                      }
                    ],
                    [G3]: j2
                  },
                  { error: "DualStack is enabled but this partition does not support DualStack", [G3]: k }
                ],
                [G3]: j2
              },
              w,
              { endpoint: { url: i2, properties: v, headers: v }, [G3]: h2 }
            ],
            [G3]: j2
          }
        ],
        [G3]: j2
      },
      { error: "Invalid Configuration: Missing Region", [G3]: k }
    ]
  };
  exports.ruleSet = _data;
});
