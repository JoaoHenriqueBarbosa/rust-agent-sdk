// var: init_node3
var init_node3 = __esm(() => {
  init_URLSearchParams();
  init_FormData();
  ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  }, node_default = {
    isNode: !0,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: typeof Blob < "u" && Blob || null
    },
    ALPHABET,
    generateString,
    protocols: ["http", "https", "file", "data"]
  };
});
