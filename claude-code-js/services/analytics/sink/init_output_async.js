// var: init_output_async
var init_output_async = __esm(() => {
  init_merge_streams();
  init_standard_stream();
  init_max_listeners();
  init_type();
  init_pipeline();
  SUBPROCESS_STREAM_PROPERTIES = ["stdin", "stdout", "stderr"];
});
