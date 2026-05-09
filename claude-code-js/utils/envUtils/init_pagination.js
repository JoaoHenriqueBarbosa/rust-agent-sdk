// var: init_pagination
var init_pagination = __esm(() => {
  init_tslib();
  init_error();
  init_parse();
  init_api_promise();
  init_values();
  AbstractPage = class AbstractPage {
    constructor(client, response, body, options) {
      _AbstractPage_client.set(this, void 0), __classPrivateFieldSet(this, _AbstractPage_client, client, "f"), this.options = options, this.response = response, this.body = body;
    }
    hasNextPage() {
      if (!this.getPaginatedItems().length)
        return !1;
      return this.nextPageRequestOptions() != null;
    }
    async getNextPage() {
      let nextOptions = this.nextPageRequestOptions();
      if (!nextOptions)
        throw new AnthropicError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
    }
    async* iterPages() {
      let page = this;
      yield page;
      while (page.hasNextPage())
        page = await page.getNextPage(), yield page;
    }
    async* [(_AbstractPage_client = /* @__PURE__ */ new WeakMap, Symbol.asyncIterator)]() {
      for await (let page of this.iterPages())
        for (let item of page.getPaginatedItems())
          yield item;
    }
  };
  PagePromise = class PagePromise extends APIPromise {
    constructor(client, request, Page) {
      super(client, request, async (client2, props) => new Page(client2, props.response, await defaultParseResponse(client2, props), props.options));
    }
    async* [Symbol.asyncIterator]() {
      let page = await this;
      for await (let item of page)
        yield item;
    }
  };
  Page = class Page extends AbstractPage {
    constructor(client, response, body, options) {
      super(client, response, body, options);
      this.data = body.data || [], this.has_more = body.has_more || !1, this.first_id = body.first_id || null, this.last_id = body.last_id || null;
    }
    getPaginatedItems() {
      return this.data ?? [];
    }
    hasNextPage() {
      if (this.has_more === !1)
        return !1;
      return super.hasNextPage();
    }
    nextPageRequestOptions() {
      if (this.options.query?.before_id) {
        let first_id = this.first_id;
        if (!first_id)
          return null;
        return {
          ...this.options,
          query: {
            ...maybeObj(this.options.query),
            before_id: first_id
          }
        };
      }
      let cursor = this.last_id;
      if (!cursor)
        return null;
      return {
        ...this.options,
        query: {
          ...maybeObj(this.options.query),
          after_id: cursor
        }
      };
    }
  };
});
