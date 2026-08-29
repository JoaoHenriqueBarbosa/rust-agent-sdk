// Original: src/tools/WebFetchTool/preapproved.ts
function isPreapprovedHost(hostname2, pathname) {
  if (HOSTNAME_ONLY.has(hostname2))
    return !0;
  let prefixes = PATH_PREFIXES.get(hostname2);
  if (prefixes) {
    for (let p4 of prefixes)
      if (pathname === p4 || pathname.startsWith(p4 + "/"))
        return !0;
  }
  return !1;
}
var PREAPPROVED_HOSTS, HOSTNAME_ONLY, PATH_PREFIXES;
var init_preapproved = __esm(() => {
  PREAPPROVED_HOSTS = /* @__PURE__ */ new Set([
    "platform.claude.com",
    "code.claude.com",
    "modelcontextprotocol.io",
    "github.com/anthropics",
    "agentskills.io",
    "docs.python.org",
    "en.cppreference.com",
    "docs.oracle.com",
    "learn.microsoft.com",
    "developer.mozilla.org",
    "go.dev",
    "pkg.go.dev",
    "www.php.net",
    "docs.swift.org",
    "kotlinlang.org",
    "ruby-doc.org",
    "doc.rust-lang.org",
    "www.typescriptlang.org",
    "react.dev",
    "angular.io",
    "vuejs.org",
    "nextjs.org",
    "expressjs.com",
    "nodejs.org",
    "bun.sh",
    "jquery.com",
    "getbootstrap.com",
    "tailwindcss.com",
    "d3js.org",
    "threejs.org",
    "redux.js.org",
    "webpack.js.org",
    "jestjs.io",
    "reactrouter.com",
    "docs.djangoproject.com",
    "flask.palletsprojects.com",
    "fastapi.tiangolo.com",
    "pandas.pydata.org",
    "numpy.org",
    "www.tensorflow.org",
    "pytorch.org",
    "scikit-learn.org",
    "matplotlib.org",
    "requests.readthedocs.io",
    "jupyter.org",
    "laravel.com",
    "symfony.com",
    "wordpress.org",
    "docs.spring.io",
    "hibernate.org",
    "tomcat.apache.org",
    "gradle.org",
    "maven.apache.org",
    "asp.net",
    "dotnet.microsoft.com",
    "nuget.org",
    "blazor.net",
    "reactnative.dev",
    "docs.flutter.dev",
    "developer.apple.com",
    "developer.android.com",
    "keras.io",
    "spark.apache.org",
    "huggingface.co",
    "www.kaggle.com",
    "www.mongodb.com",
    "redis.io",
    "www.postgresql.org",
    "dev.mysql.com",
    "www.sqlite.org",
    "graphql.org",
    "prisma.io",
    "docs.aws.amazon.com",
    "cloud.google.com",
    "learn.microsoft.com",
    "kubernetes.io",
    "www.docker.com",
    "www.terraform.io",
    "www.ansible.com",
    "vercel.com/docs",
    "docs.netlify.com",
    "devcenter.heroku.com",
    "cypress.io",
    "selenium.dev",
    "docs.unity.com",
    "docs.unrealengine.com",
    "git-scm.com",
    "nginx.org",
    "httpd.apache.org"
  ]), { HOSTNAME_ONLY, PATH_PREFIXES } = (() => {
    let hosts = /* @__PURE__ */ new Set, paths2 = /* @__PURE__ */ new Map;
    for (let entry of PREAPPROVED_HOSTS) {
      let slash = entry.indexOf("/");
      if (slash === -1)
        hosts.add(entry);
      else {
        let host = entry.slice(0, slash), path19 = entry.slice(slash), prefixes = paths2.get(host);
        if (prefixes)
          prefixes.push(path19);
        else
          paths2.set(host, [path19]);
      }
    }
    return { HOSTNAME_ONLY: hosts, PATH_PREFIXES: paths2 };
  })();
});
