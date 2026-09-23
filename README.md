# prana

**An unofficial Rust port of Anthropic's [`claude-agent-sdk`](https://github.com/anthropics/claude-agent-sdk-python), for running Claude agents from Rust: drive the `claude` CLI, or run the agent loop natively, in-process.**

*Prāṇa*, in Vedānta, is the vital breath that animates the body from within. The crate's
native transport is exactly that: the agent loop breathing inside your own process.

[![Crates.io](https://img.shields.io/crates/v/prana.svg)](https://crates.io/crates/prana)
[![Docs.rs](https://docs.rs/prana/badge.svg)](https://docs.rs/prana)
[![CI](https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-edition%202021-orange.svg)](https://www.rust-lang.org)
[![Tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/JoaoHenriqueBarbosa/rust-agent-sdk/badges/tests.json)](https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk/actions)
[![Lines of code](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/JoaoHenriqueBarbosa/rust-agent-sdk/badges/loc.json)](#architecture)

> **Status: young but used in production.** This is a from-scratch reimplementation, in
> Rust, of the Python `claude-agent-sdk`. It is not an official Anthropic SDK and is not
> affiliated with Anthropic. It is heavily tested and runs a production chat service, but
> the crate is `0.x` and the public API may still shift. See [Scope & honesty](#scope--honesty).

## What it is

`prana` lets a Rust program run Claude agents, with two interchangeable transports behind
the same typed API:

- **Subprocess** (`SubprocessCLITransport`): spawns the `claude` command-line binary and
  speaks its `--input-format stream-json` / `--output-format stream-json` control protocol
  over stdin/stdout, exactly like the official Python SDK.
- **Native** (`NativeApiTransport`): no `claude` binary at all. The agent loop, the builtin
  tools, permissions, hooks, memories (`CLAUDE.md`), transcripts and sessions run inside
  your process and talk to the Anthropic Messages API directly (or to any compatible
  endpoint via `ANTHROPIC_BASE_URL`). It is kept in parity with the Claude Code CLI 2.1.90,
  down to the tool descriptions, the transcript format and the retry behavior.

Either way you get the same `Message` stream, the same `ClaudeAgentOptions` and the same
`ClaudeSDKClient`, so you can switch transports without touching the rest of your code.

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
- **Pluggable persistence via the `SessionStore` trait.** `InMemorySessionStore` ships by
  default; **Postgres** (`--features postgres`) and **Redis** (`--features redis-store`)
  backends are available behind opt-in features, each a faithful port of the Python SDK's
  example adapters that passes the same conformance contracts. An S3 backend is on the
  roadmap. The trait remains the extension point for your own backend.
- **MCP configuration & runtime control.** Configure stdio / SSE / HTTP / in-SDK MCP
  servers, and at runtime reconnect a server, toggle one on/off, or query MCP status.
- **Hooks & tool permissions.** Register hook matchers and gate tool use through a
  `can_use_tool` callback.
- **Pluggable transport via the `Transport` trait.** The default `SubprocessCLITransport`
  drives the real binary; a custom `Transport` lets you feed the client scripted responses,
  which is exactly how most of the test suite runs without the CLI present.

## Requirements

- **Rust 1.94 or newer.**
- For the subprocess transport: the **`claude` CLI** (`>= 2.0.0`) on your `PATH`.
- For the native transport: an `ANTHROPIC_API_KEY`, and `poppler-utils` installed if your
  agent reads PDFs with the `Read` tool (it is what renders and extracts their text).

## Install

Add it to your project with one command:

```sh
cargo add prana
cargo add tokio --features full
```

Optional session-store backends are opt-in features: `--features postgres` for Postgres,
`--features redis-store` for Redis.

## Usage

### One-shot query

```rust
use prana::{query_collect, Message, ContentBlock};

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
use prana::{ClaudeSDKClient, ClaudeAgentOptions, PermissionMode};

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
  prana
        │  ClaudeAgentOptions ─▶ CLI args
        │  Message  ◀─ parse ── stream-json
        ▼
  Transport  (default: SubprocessCLITransport)
        │  stdin  ──▶  --input-format  stream-json
        │  stdout ◀──  --output-format stream-json
        ▼
  `claude` CLI  ──▶  Claude / Anthropic
```

That is the subprocess transport: all model access, authentication, tool execution, and MCP
orchestration happen inside the `claude` process, and the library is a typed driver for its
control protocol. With the native transport, the same `Message` stream is produced by the
agent loop running in-process, which calls the Messages API itself. Message parsing is
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
prana/
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
├── stores/               # optional SessionStore backends (feature-gated)
│   ├── postgres.rs           # --features postgres
│   └── redis.rs              # --features redis-store
└── tests/                # integration tests
```

Only the items re-exported from `lib.rs` are the public API; the `internal` module may
change at any time.

## Development

```bash
cargo build                                   # default (no optional backends)
cargo test                                    # unit + integration suite
cargo build --features postgres,redis-store   # with the optional stores
```

The Postgres and Redis backends are verified against real servers. Bring them up
(e.g. via Docker) and run the live conformance tests:

```bash
docker run -d --name pg    -e POSTGRES_PASSWORD=test -e POSTGRES_DB=sessions -p 5433:5432 postgres:16-alpine
docker run -d --name redis -p 6380:6379 redis:7-alpine

RUST_AGENT_SDK_TEST_PG=postgres://postgres:test@127.0.0.1:5433/sessions \
RUST_AGENT_SDK_TEST_REDIS=redis://127.0.0.1:6380 \
  cargo test --features postgres,redis-store --test test_stores_live -- --ignored
```

## Scope & honesty

This is a spike, and it's worth being precise about where the edges are:

- **It's an unofficial port**, not the Anthropic SDK, and not affiliated with Anthropic. It
  targets the same protocol and mirrors the Python SDK's shape.
- **Session stores:** `InMemorySessionStore` is always available; **Postgres** and **Redis**
  backends ship behind the `postgres` / `redis-store` features and are verified against real
  servers by `tests/test_stores_live.rs`. **S3 is not implemented yet** — it's on the roadmap.
- **No ReAct loop of its own on the CLI path, and no `#[tool]` macro.** With the subprocess
  transport, agent reasoning, tool execution, and transport to the model all live in the
  `claude` CLI. The native transport (`NativeApiTransport`) runs the loop in-process and
  ships its own MCP client: `stdio`, `sse` and streamable `http` servers are connected once
  per session, with the CLI's timeouts, session renewal and reconnection behavior.
- **One known TODO:** wiring the transcript-mirror batcher into the streaming client
  (`client.rs`) is not finished yet, so live sessions don't auto-persist to a `SessionStore`
  through that path.

The engineering conclusion of the spike: the protocol, type model, session tooling, and
transport abstraction port cleanly to Rust and are well covered by tests; the remaining work
is integration polish (the batcher hookup) and picking up real persistence backends behind
the existing trait.

## License

Licensed under the [MIT License](LICENSE).
