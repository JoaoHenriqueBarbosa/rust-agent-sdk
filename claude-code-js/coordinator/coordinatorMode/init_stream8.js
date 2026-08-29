// var: init_stream8
var init_stream8 = __esm(() => {
  init_dist8();
  EventSourceParserStream = class EventSourceParserStream extends TransformStream {
    constructor({ onError, onRetry, onComment } = {}) {
      let parser2;
      super({
        start(controller) {
          parser2 = createParser({
            onEvent: (event) => {
              controller.enqueue(event);
            },
            onError(error44) {
              onError === "terminate" ? controller.error(error44) : typeof onError == "function" && onError(error44);
            },
            onRetry,
            onComment
          });
        },
        transform(chunk) {
          parser2.feed(chunk);
        }
      });
    }
  };
});
