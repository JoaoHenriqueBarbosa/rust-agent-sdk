// var: require_directives
var require_directives = __commonJS((exports) => {
  var identity16 = require_identity(), visit2 = require_visit(), escapeChars = {
    "!": "%21",
    ",": "%2C",
    "[": "%5B",
    "]": "%5D",
    "{": "%7B",
    "}": "%7D"
  }, escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);

  class Directives {
    constructor(yaml, tags) {
      this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, Directives.defaultYaml, yaml), this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
      let copy = new Directives(this.yaml, this.tags);
      return copy.docStart = this.docStart, copy;
    }
    atDocument() {
      let res = new Directives(this.yaml, this.tags);
      switch (this.yaml.version) {
        case "1.1":
          this.atNextDocument = !0;
          break;
        case "1.2":
          this.atNextDocument = !1, this.yaml = {
            explicit: Directives.defaultYaml.explicit,
            version: "1.2"
          }, this.tags = Object.assign({}, Directives.defaultTags);
          break;
      }
      return res;
    }
    add(line, onError) {
      if (this.atNextDocument)
        this.yaml = { explicit: Directives.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, Directives.defaultTags), this.atNextDocument = !1;
      let parts = line.trim().split(/[ \t]+/), name3 = parts.shift();
      switch (name3) {
        case "%TAG": {
          if (parts.length !== 2) {
            if (onError(0, "%TAG directive should contain exactly two parts"), parts.length < 2)
              return !1;
          }
          let [handle, prefix] = parts;
          return this.tags[handle] = prefix, !0;
        }
        case "%YAML": {
          if (this.yaml.explicit = !0, parts.length !== 1)
            return onError(0, "%YAML directive should contain exactly one part"), !1;
          let [version5] = parts;
          if (version5 === "1.1" || version5 === "1.2")
            return this.yaml.version = version5, !0;
          else {
            let isValid = /^\d+\.\d+$/.test(version5);
            return onError(6, `Unsupported YAML version ${version5}`, isValid), !1;
          }
        }
        default:
          return onError(0, `Unknown directive ${name3}`, !0), !1;
      }
    }
    tagName(source, onError) {
      if (source === "!")
        return "!";
      if (source[0] !== "!")
        return onError(`Not a valid tag: ${source}`), null;
      if (source[1] === "<") {
        let verbatim = source.slice(2, -1);
        if (verbatim === "!" || verbatim === "!!")
          return onError(`Verbatim tags aren't resolved, so ${source} is invalid.`), null;
        if (source[source.length - 1] !== ">")
          onError("Verbatim tags must end with a >");
        return verbatim;
      }
      let [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
      if (!suffix)
        onError(`The ${source} tag has no suffix`);
      let prefix = this.tags[handle];
      if (prefix)
        try {
          return prefix + decodeURIComponent(suffix);
        } catch (error44) {
          return onError(String(error44)), null;
        }
      if (handle === "!")
        return source;
      return onError(`Could not resolve tag: ${source}`), null;
    }
    tagString(tag) {
      for (let [handle, prefix] of Object.entries(this.tags))
        if (tag.startsWith(prefix))
          return handle + escapeTagName(tag.substring(prefix.length));
      return tag[0] === "!" ? tag : `!<${tag}>`;
    }
    toString(doc2) {
      let lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], tagEntries = Object.entries(this.tags), tagNames;
      if (doc2 && tagEntries.length > 0 && identity16.isNode(doc2.contents)) {
        let tags = {};
        visit2.visit(doc2.contents, (_key, node) => {
          if (identity16.isNode(node) && node.tag)
            tags[node.tag] = !0;
        }), tagNames = Object.keys(tags);
      } else
        tagNames = [];
      for (let [handle, prefix] of tagEntries) {
        if (handle === "!!" && prefix === "tag:yaml.org,2002:")
          continue;
        if (!doc2 || tagNames.some((tn) => tn.startsWith(prefix)))
          lines.push(`%TAG ${handle} ${prefix}`);
      }
      return lines.join(`
`);
    }
  }
  Directives.defaultYaml = { explicit: !1, version: "1.2" };
  Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
  exports.Directives = Directives;
});
