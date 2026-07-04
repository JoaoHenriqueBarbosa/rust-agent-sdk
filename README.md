# rust-agent-sdk

**An unofficial Rust port of Anthropic's [`claude-agent-sdk`](https://github.com/anthropics/claude-agent-sdk-python), for driving the `claude` CLI as an agent from Rust.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-edition%202021-orange.svg)](https://www.rust-lang.org)
[![Tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/JoaoHenriqueBarbosa/rust-agent-sdk/main/.github/badges/tests.json)](https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk/actions)
[![Lines of code](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/JoaoHenriqueBarbosa/rust-agent-sdk/main/.github/badges/loc.json)](#architecture)

> **Status — exploratory spike.** This is a from-scratch reimplementation, in Rust, of
> the Python `claude-agent-sdk`. It is not an official Anthropic SDK and is not affiliated
> with Anthropic. The core is functional and heavily tested, but the crate is `0.1.0`,
> unpublished, and the public API may still shift. See [Scope & honesty](#scope--honesty).

## What it is

`rust-agent-sdk` lets a Rust program *drive* Claude Code the same way the official Python
SDK does: it does **not** talk to the Anthropic HTTP API directly. Instead it spawns the
`claude` command-line binary as a child process and speaks its `--input-format stream-json`
/ `--output-format stream-json` control protocol over stdin/stdout — sending prompts and
control requests, and parsing the streamed events back into typed Rust values.

If you have the `claude` CLI installed and want to build an agentic tool, batch job, or
service in Rust that delegates to it, this crate gives you a typed, `async`/`tokio`-native
surface over that protocol.

## Highlights

- **Two entry points, mirroring the Python SDK.**
  - `query()` / `query_collect()` — fire a one-shot prompt and consume the resulting
    `Message` stream (or collect it into a `Vec`).
  - `ClaudeSDKClient` — a persistent, bidirectional session you `connect()` once and then
    drive: `query`, `receive_messages`, `interrupt`, `set_model`, `set_permission_mode`,
    `rewind_files`, MCP controls, and more.
- **Typed protocol.** The stream-json wire format is parsed into a `Message` enum
  (10 variants: user / assistant / system / result / stream events / rate-limit /
  task-started / task-progress / task-notification / mirror-error) built from `ContentBlock`
  values (text, thinking, tool-use, tool-result, and server tool-use / tool-result).
- **A large `ClaudeAgentOptions`.** Roughly 50 fields covering model, fallback model,
  allowed / disallowed tools, permission mode, system prompt, MCP servers, budget and turn
  limits, working directory, extra CLI args, hooks, and a `can_use_tool` callback.
- **Sessions, as a first-class concern.** List and inspect sessions and subagents; fork,
  rename, tag, and delete them; resume or continue a prior session; import external JSONL
  transcripts into a store; and fold an incremental per-session summary as messages arrive.
- **Pluggable persistence via the `SessionStore` trait.** The crate ships one concrete
  implementation, `InMemorySessionStore`; the trait is the extension point for your own
  backend. (See [Scope & honesty](#scope--honesty) for what is *not* included.)
- **MCP configuration & runtime control.** Configure stdio / SSE / HTTP / in-SDK MCP
  servers, and at runtime reconnect a server, toggle one on/off, or query MCP status.
- **Hooks & tool permissions.** Register hook matchers and gate tool use through a
  `can_use_tool` callback.
- **Pluggable transport via the `Transport` trait.** The default `SubprocessCLITransport`
  drives the real binary; a custom `Transport` lets you feed the client scripted responses,
  which is exactly how most of the test suite runs without the CLI present.

## Requirements

- **Rust** (stable) with `edition = "2021"`.
- The **`claude` CLI** (`>= 2.0.0`) on your `PATH` for anything that actually talks to
  Claude. The library itself compiles and its unit-level logic is testable without it.

## Install

This crate is **not published to crates.io**. Depend on it by Git:

```toml
[dependencies]
rust-agent-sdk = { git = "https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk" }
tokio = { version = "1", features = ["full"] }
```

## Usage

### One-shot query

```rust
use rust_agent_sdk::{query_collect, Message, ContentBlock};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Passing `None` for options uses defaults; `None` for the transport
    // spawns the real `claude` CLI from your PATH.
    let messages = query_collect("What is 2 + 2?", None, None).await?;

    for msg in messages {
        match msg {
            Message::Assistant(a) => {
                for block in a.content {
                    if let ContentBlock::Text(t) = block {
                        println!("{}", t.text);
                    }
                }
            }
            Message::Result(r) => {
                if let Some(cost) = r.total_cost_usd {
                    eprintln!("done in {} turns (${:.4})", r.num_turns, cost);
                }
            }
            _ => {}
        }
    }
    Ok(())
}
```

Prefer streaming? `query()` returns a `Stream<Item = Result<Message>>` you can pull from
with `futures::StreamExt` instead of collecting eagerly.

### A persistent session

```rust
use rust_agent_sdk::{ClaudeSDKClient, ClaudeAgentOptions, PermissionMode};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let options = ClaudeAgentOptions {
        model: Some("claude-sonnet-4-5".to_string()),
        permission_mode: Some(PermissionMode::AcceptEdits),
        ..Default::default()
    };

    let mut client = ClaudeSDKClient::new(options);
    client.connect().await?;

    client.query("List the files in the current directory.").await?;
    let response = client.receive_response().await?;
    for msg in response {
        println!("{msg:?}");
    }

    // Steer the live session without reconnecting.
    client.set_model(Some("claude-opus-4-1")).await?;

    client.disconnect().await?;
    Ok(())
}
```

### Custom transport (no CLI needed)

Because the client is generic over the `Transport` trait, you can inject a scripted
transport instead of spawning the binary — useful for tests and for embedding the protocol
in an environment where `claude` isn't on the path:

```rust
let client = ClaudeSDKClient::new(options).with_transport(my_transport);
```

## How it works

```text
  your Rust program
        │  query() / ClaudeSDKClient
        ▼
  rust-agent-sdk
        │  ClaudeAgentOptions ─▶ CLI args
        │  Message  ◀─ parse ── stream-json
        ▼
  Transport  (default: SubprocessCLITransport)
        │  stdin  ──▶  --input-format  stream-json
        │  stdout ◀──  --output-format stream-json
        ▼
  `claude` CLI  ──▶  Claude / Anthropic
```

The crate never opens an HTTP connection to Anthropic itself. All model access,
authentication, tool execution, and MCP orchestration happen inside the `claude` process;
this library is a typed driver for that process's control protocol. Message parsing is
resilient to unknown fields, session path resolution normalizes Unicode (NFC/NFKC) so keys
stay stable across platforms, and the transport layer handles line-buffered stream-json
framing (including large tool outputs).

## Development

```sh
cargo build                    # build the crate
cargo test                     # run the test suite
cargo fmt --all                # format
cargo clippy --all-targets -- -D warnings   # lint
cargo doc --no-deps --open     # browse the API docs
```

The test suite is integration-style and lives entirely under `tests/`. The large majority
of tests run against in-process fakes and pass with **no external dependencies**; a smaller
set of integration tests exercise the real `claude` binary (`>= 2.0.0`) — or a mock that
drives the control-response channel — and require it on `PATH`. The test and LOC badges
above are refreshed by CI so the counts stay honest as the code evolves.

## Architecture

```text
rust-agent-sdk/
├── src/
│   ├── lib.rs            # crate root, public re-exports
│   ├── query.rs          # query() / query_collect()
│   ├── client.rs         # ClaudeSDKClient
│   ├── types.rs          # options, Message, ContentBlock, ~50-field options struct
│   ├── errors.rs         # ClaudeSDKError + Result
│   └── internal/         # implementation detail (not public API)
│       ├── transport.rs      # Transport trait + subprocess CLI transport
│       ├── query.rs          # control protocol / message pump
│       ├── message_parser.rs # stream-json -> Message
│       ├── session_store.rs  # SessionStore trait + InMemorySessionStore
│       ├── sessions.rs       # list / info / messages
│       ├── session_mutations.rs  # fork / rename / tag / delete
│       ├── session_resume.rs     # resume / continue
│       ├── session_import.rs     # import JSONL transcripts
│       ├── session_summary.rs    # incremental summary folding
│       ├── transcript_mirror.rs  # mirror a live transcript into a store
│       └── task.rs               # detached task helper
└── tests/                # integration tests
```

Only the items re-exported from `lib.rs` are the public API; the `internal` module may
change at any time.

## Scope & honesty

This is a spike, and it's worth being precise about where the edges are:

- **It's an unofficial port**, not the Anthropic SDK, and not affiliated with Anthropic. It
  targets the same protocol and mirrors the Python SDK's shape.
- **`InMemorySessionStore` is the only bundled store.** `SessionStore` is a trait so you can
  back it with anything, but there is **no** Postgres / Redis / S3 implementation in this
  crate — those names appear only in tests that exercise the trait against an in-memory
  stand-in.
- **No ReAct loop, no bespoke HTTP/SSE client, no `#[tool]` macro.** Agent reasoning, tool
  execution, and transport to the model all live in the `claude` CLI. "SSE" here refers only
  to a variant of MCP server *configuration*, not an HTTP client this crate implements.
- **One known TODO:** wiring the transcript-mirror batcher into the streaming client
  (`client.rs`) is not finished yet, so live sessions don't auto-persist to a `SessionStore`
  through that path.

The engineering conclusion of the spike: the protocol, type model, session tooling, and
transport abstraction port cleanly to Rust and are well covered by tests; the remaining work
is integration polish (the batcher hookup) and picking up real persistence backends behind
the existing trait.

## License

Licensed under the [MIT License](LICENSE).
