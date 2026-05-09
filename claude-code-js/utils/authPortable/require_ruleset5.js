// var: require_ruleset5
var require_ruleset5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ruleSet = void 0;
  var w2 = "required", x3 = "fn", y2 = "argv", z2 = "ref", a2 = !0, b = "isSet", c3 = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h4 = "getAttr", i4 = "stringEquals", j4 = { [w2]: !1, type: "string" }, k3 = { [w2]: !0, default: !1, type: "boolean" }, l3 = { [z2]: "Endpoint" }, m4 = { [x3]: c3, [y2]: [{ [z2]: "UseFIPS" }, !0] }, n5 = { [x3]: c3, [y2]: [{ [z2]: "UseDualStack" }, !0] }, o5 = {}, p4 = { [z2]: "Region" }, q4 = { [x3]: h4, [y2]: [{ [z2]: g }, "supportsFIPS"] }, r4 = { [z2]: g }, s2 = { [x3]: c3, [y2]: [!0, { [x3]: h4, [y2]: [r4, "supportsDualStack"] }] }, t2 = [m4], u5 = [n5], v2 = [p4], _data4 = {
    version: "1.0",
    parameters: { Region: j4, UseDualStack: k3, UseFIPS: k3, Endpoint: j4 },
    rules: [
      {
        conditions: [{ [x3]: b, [y2]: [l3] }],
        rules: [
          { conditions: t2, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d },
          { conditions: u5, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d },
          { endpoint: { url: l3, properties: o5, headers: o5 }, type: e }
        ],
        type: f
      },
      {
        conditions: [{ [x3]: b, [y2]: v2 }],
        rules: [
          {
            conditions: [{ [x3]: "aws.partition", [y2]: v2, assign: g }],
            rules: [
              {
                conditions: [m4, n5],
                rules: [
                  {
                    conditions: [{ [x3]: c3, [y2]: [a2, q4] }, s2],
                    rules: [
                      {
                        conditions: [{ [x3]: i4, [y2]: [p4, "us-east-1"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      },
                      {
                        conditions: [{ [x3]: i4, [y2]: [p4, "us-east-2"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      },
                      {
                        conditions: [{ [x3]: i4, [y2]: [p4, "us-west-1"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      },
                      {
                        conditions: [{ [x3]: i4, [y2]: [p4, "us-west-2"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      },
                      {
                        endpoint: {
                          url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      }
                    ],
                    type: f
                  },
                  { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }
                ],
                type: f
              },
              {
                conditions: t2,
                rules: [
                  {
                    conditions: [{ [x3]: c3, [y2]: [q4, a2] }],
                    rules: [
                      {
                        endpoint: {
                          url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      }
                    ],
                    type: f
                  },
                  { error: "FIPS is enabled but this partition does not support FIPS", type: d }
                ],
                type: f
              },
              {
                conditions: u5,
                rules: [
                  {
                    conditions: [s2],
                    rules: [
                      {
                        conditions: [{ [x3]: i4, [y2]: ["aws", { [x3]: h4, [y2]: [r4, "name"] }] }],
                        endpoint: { url: "https://cognito-identity.{Region}.amazonaws.com", properties: o5, headers: o5 },
                        type: e
                      },
                      {
                        endpoint: {
                          url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: o5,
                          headers: o5
                        },
                        type: e
                      }
                    ],
                    type: f
                  },
                  { error: "DualStack is enabled but this partition does not support DualStack", type: d }
                ],
                type: f
              },
              {
                endpoint: {
                  url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
                  properties: o5,
                  headers: o5
                },
                type: e
              }
            ],
            type: f
          }
        ],
        type: f
      },
      { error: "Invalid Configuration: Missing Region", type: d }
    ]
  };
  exports.ruleSet = _data4;
});
