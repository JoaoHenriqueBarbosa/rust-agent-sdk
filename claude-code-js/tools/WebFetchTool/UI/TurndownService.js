// function: TurndownService
function TurndownService(options2) {
  if (!(this instanceof TurndownService))
    return new TurndownService(options2);
  var defaults2 = {
    rules,
    headingStyle: "setext",
    hr: "* * *",
    bulletListMarker: "*",
    codeBlockStyle: "indented",
    fence: "```",
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
    br: "  ",
    preformattedCode: !1,
    blankReplacement: function(content, node2) {
      return node2.isBlock ? `

` : "";
    },
    keepReplacement: function(content, node2) {
      return node2.isBlock ? `

` + node2.outerHTML + `

` : node2.outerHTML;
    },
    defaultReplacement: function(content, node2) {
      return node2.isBlock ? `

` + content + `

` : content;
    }
  };
  this.options = extend4({}, defaults2, options2), this.rules = new Rules(this.options);
}
