// var: require_ruleset4
var require_ruleset4 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ruleSet = void 0;
  var u4 = "required", v = "fn", w = "argv", x2 = "ref", a2 = !0, b = "isSet", c3 = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h2 = "stringEquals", i2 = { [u4]: !0, default: !1, type: "boolean" }, j2 = { [u4]: !1, type: "string" }, k = { [x2]: "Endpoint" }, l = { [v]: c3, [w]: [{ [x2]: "UseFIPS" }, !0] }, m = { [v]: c3, [w]: [{ [x2]: "UseDualStack" }, !0] }, n2 = {}, o2 = { [v]: "getAttr", [w]: [{ [x2]: g }, "name"] }, p = { [v]: c3, [w]: [{ [x2]: "UseFIPS" }, !1] }, q = { [v]: c3, [w]: [{ [x2]: "UseDualStack" }, !1] }, r = { [v]: "getAttr", [w]: [{ [x2]: g }, "supportsFIPS"] }, s = { [v]: c3, [w]: [!0, { [v]: "getAttr", [w]: [{ [x2]: g }, "supportsDualStack"] }] }, t = [{ [x2]: "Region" }], _data = {
    version: "1.0",
    parameters: { UseDualStack: i2, UseFIPS: i2, Endpoint: j2, Region: j2 },
    rules: [
      {
        conditions: [{ [v]: b, [w]: [k] }],
        rules: [
          { conditions: [l], error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d },
          {
            rules: [
              {
                conditions: [m],
                error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                type: d
              },
              { endpoint: { url: k, properties: n2, headers: n2 }, type: e }
            ],
            type: f
          }
        ],
        type: f
      },
      {
        rules: [
          {
            conditions: [{ [v]: b, [w]: t }],
            rules: [
              {
                conditions: [{ [v]: "aws.partition", [w]: t, assign: g }],
                rules: [
                  {
                    conditions: [{ [v]: h2, [w]: [o2, "aws"] }, p, q],
                    endpoint: { url: "https://{Region}.signin.aws.amazon.com", properties: n2, headers: n2 },
                    type: e
                  },
                  {
                    conditions: [{ [v]: h2, [w]: [o2, "aws-cn"] }, p, q],
                    endpoint: { url: "https://{Region}.signin.amazonaws.cn", properties: n2, headers: n2 },
                    type: e
                  },
                  {
                    conditions: [{ [v]: h2, [w]: [o2, "aws-us-gov"] }, p, q],
                    endpoint: { url: "https://{Region}.signin.amazonaws-us-gov.com", properties: n2, headers: n2 },
                    type: e
                  },
                  {
                    conditions: [l, m],
                    rules: [
                      {
                        conditions: [{ [v]: c3, [w]: [a2, r] }, s],
                        rules: [
                          {
                            endpoint: {
                              url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                              properties: n2,
                              headers: n2
                            },
                            type: e
                          }
                        ],
                        type: f
                      },
                      {
                        error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                        type: d
                      }
                    ],
                    type: f
                  },
                  {
                    conditions: [l, q],
                    rules: [
                      {
                        conditions: [{ [v]: c3, [w]: [r, a2] }],
                        rules: [
                          {
                            endpoint: {
                              url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    conditions: [p, m],
                    rules: [
                      {
                        conditions: [s],
                        rules: [
                          {
                            endpoint: {
                              url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    endpoint: { url: "https://signin.{Region}.{PartitionResult#dnsSuffix}", properties: n2, headers: n2 },
                    type: e
                  }
                ],
                type: f
              }
            ],
            type: f
          },
          { error: "Invalid Configuration: Missing Region", type: d }
        ],
        type: f
      }
    ]
  };
  exports.ruleSet = _data;
});
