// var: parseHTML
var parseHTML = (html2, globals = null) => new DOMParser().parseFromString(html2, "text/html", globals).defaultView;
var init_esm34 = __esm(() => {
  init_parser6();
  init_document();
  init_facades();
  init_object2();
  init_parse_json();
  init_custom_event();
  init_event();
  init_event_target();
  init_input_event2();
  init_node_list();
  init_node_filter();
  init_facades();
  init_html_classes();
  setPrototypeOf(Document4, Document2).prototype = Document2.prototype;
});
