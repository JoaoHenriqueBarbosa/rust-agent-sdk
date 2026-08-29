# Contributing

Thanks for your interest in improving `rust-agent-sdk`! This document explains how to
get set up, how the repository is laid out, and the workflow for landing a change.

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Prerequisites

- **Rust** (stable), installed via [rustup](https://rustup.rs). The crate targets
  `edition = "2021"`.
- **`rustfmt`** and **`clippy`** components:
  ```sh
  rustup component add rustfmt clippy
  ```
- **Optional — the `claude` CLI** (`>= 2.0.0`) on your `PATH`. The bulk of the test
  suite runs against in-process fakes and needs nothing extra, but a handful of
  integration tests drive the real binary (see [Testing](#testing)).

## Getting started

```sh
git clone https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk.git
cd rust-agent-sdk
cargo build
cargo test
```

## Repository layout

```
src/
  lib.rs                    # crate root + public re-exports
  query.rs                  # query() / query_collect() one-shot entry points
  client.rs                 # ClaudeSDKClient (bidirectional streaming)
  types.rs                  # ClaudeAgentOptions, Message, ContentBlock, ...
  errors.rs                 # ClaudeSDKError + Result alias
  internal/                 # implementation details (not part of the public API)
    transport.rs            #   Transport trait + subprocess CLI transport
    query.rs                #   control protocol / message pump
    message_parser.rs       #   stream-json -> Message
    session_store.rs        #   SessionStore trait + InMemorySessionStore
    sessions.rs             #   list / info / messages
    session_mutations.rs    #   fork / rename / tag / delete
    session_resume.rs       #   resume / continue
    session_import.rs       #   import JSONL transcripts into a store
    session_summary.rs      #   incremental summary folding
    transcript_mirror.rs    #   mirror a live transcript into a store
    task.rs                 #   detached task helper
tests/                      # integration tests (the entire suite lives here)
```

Everything under `internal/` is subject to change without notice — treat only the
items re-exported from `lib.rs` as the public API.

## Testing

Tests live exclusively in `tests/` (integration style — there are no `#[cfg(test)]`
unit modules inside `src/`).

```sh
cargo test                      # run the whole suite
cargo test --test test_query    # run a single test file
cargo test some_test_name       # filter by test name
```

Most tests use in-memory fakes and pass without any external dependency. A subset of
integration tests require the real `claude` binary (`>= 2.0.0`) on your `PATH` — or a
mock that feeds the control-response channel — and will otherwise fail or be skipped.
If you are working purely on parsing, session, or type logic you generally do not need
the CLI installed.

Some tests touch process-global state and are annotated with `serial_test`, so avoid
introducing hidden global mutable state in new tests.

## Formatting & linting

Before opening a PR:

```sh
cargo fmt --all
cargo clippy --all-targets -- -D warnings
```

Both are expected to be clean.

## Pull request workflow

1. **Fork** the repository and create a topic branch off `main`:
   ```sh
   git checkout -b feat/short-description
   ```
2. Make your change, with tests where it makes sense.
3. Run `cargo fmt`, `cargo clippy`, and `cargo test` locally.
4. Commit using **[Conventional Commits](https://www.conventionalcommits.org/)**.
5. Push and open a pull request. Fill in the PR template and link any related issues.
6. Keep the PR focused — one logical change per PR is much easier to review.

### Conventional commit types

| Type       | Use for                                                             |
| ---------- | ------------------------------------------------------------------- |
| `feat`     | A new feature or public API addition                                |
| `fix`      | A bug fix                                                            |
| `docs`     | Documentation only (README, doc-comments, this file)                |
| `test`     | Adding or adjusting tests                                            |
| `refactor` | A code change that neither fixes a bug nor adds a feature           |
| `perf`     | A change that improves performance                                  |
| `style`    | Formatting / whitespace (no behavior change)                        |
| `build`    | Build system, dependencies, `Cargo.toml`                            |
| `ci`       | CI configuration and workflows                                      |
| `chore`    | Maintenance that doesn't fit the above                              |

Optionally add a scope, e.g. `feat(session): support tag filtering`.

## Reporting bugs & requesting features

Use the issue templates:

- [Bug report](.github/ISSUE_TEMPLATE/bug_report.yml)
- [Feature request](.github/ISSUE_TEMPLATE/feature_request.yml)

For anything security-related, follow [SECURITY.md](SECURITY.md) instead of opening a
public issue.
