// Original: src/utils/todo/types.ts
var TodoStatusSchema, TodoItemSchema, TodoListSchema;
var init_types19 = __esm(() => {
  init_v4();
  TodoStatusSchema = lazySchema(() => exports_external.enum(["pending", "in_progress", "completed"])), TodoItemSchema = lazySchema(() => exports_external.object({
    content: exports_external.string().min(1, "Content cannot be empty"),
    status: TodoStatusSchema(),
    activeForm: exports_external.string().min(1, "Active form cannot be empty")
  })), TodoListSchema = lazySchema(() => exports_external.array(TodoItemSchema()));
});
