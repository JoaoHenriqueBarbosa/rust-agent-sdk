// var: require_ruleset
var require_ruleset = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ruleSet = void 0;
  var u4 = "required", v = "fn", w = "argv", x2 = "ref", a2 = !0, b = "isSet", c3 = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h2 = "getAttr", i2 = { [u4]: !1, type: "string" }, j2 = { [u4]: !0, default: !1, type: "boolean" }, k = { [x2]: "Endpoint" }, l = { [v]: c3, [w]: [{ [x2]: "UseFIPS" }, !0] }, m = { [v]: c3, [w]: [{ [x2]: "UseDualStack" }, !0] }, n2 = {}, o2 = { [v]: h2, [w]: [{ [x2]: g }, "supportsFIPS"] }, p = { [x2]: g }, q = { [v]: c3, [w]: [!0, { [v]: h2, [w]: [p, "supportsDualStack"] }] }, r = [l], s = [m], t = [{ [x2]: "Region" }], _data = {
    version: "1.0",
    parameters: { Region: i2, UseDualStack: j2, UseFIPS: j2, Endpoint: i2 },
    rules: [
      {
        conditions: [{ [v]: b, [w]: [k] }],
        rules: [
          { conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d },
          { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d },
          { endpoint: { url: k, properties: n2, headers: n2 }, type: e }
        ],
        type: f
      },
      {
        conditions: [{ [v]: b, [w]: t }],
        rules: [
          {
            conditions: [{ [v]: "aws.partition", [w]: t, assign: g }],
            rules: [
              {
                conditions: [l, m],
                rules: [
                  {
                    conditions: [{ [v]: c3, [w]: [a2, o2] }, q],
                    rules: [
                      {
                        endpoint: {
                          url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: n2,
                          headers: n2
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
                conditions: r,
                rules: [
                  {
                    conditions: [{ [v]: c3, [w]: [o2, a2] }],
                    rules: [
                      {
                        conditions: [{ [v]: "stringEquals", [w]: [{ [v]: h2, [w]: [p, "name"] }, "aws-us-gov"] }],
                        endpoint: { url: "https://oidc.{Region}.amazonaws.com", properties: n2, headers: n2 },
                        type: e
                      },
                      {
                        endpoint: {
                          url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                          properties: n2,
                          headers: n2
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
                conditions: s,
                rules: [
                  {
                    conditions: [q],
                    rules: [
                      {
                        endpoint: {
                          url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: n2,
                          headers: n2
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
                endpoint: { url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}", properties: n2, headers: n2 },
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
  exports.ruleSet = _data;
});
