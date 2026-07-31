# Changelog

Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Versões ainda não publicadas ficam em `Unreleased`.

## [Unreleased]

### Corrigido — servidores MCP in-process deixam de morar num registry global

O registry de servidores MCP in-process era um `static` indexado por **nome**
(`SdkMcpRegistry::global()`), onde `SdkMcpServerBuilder::register()` depositava
e do qual **nada removia**. Isso produzia dois defeitos, os dois reproduzidos
com transporte roteirizado antes do conserto:

- **Colisão entre sessões.** Duas sessões concorrentes no mesmo processo que
  declarassem servidores de mesmo nome resolviam para a **mesma** entrada — a
  última registrada. A sessão A recebia a tool da sessão B, com resposta bem
  formada e valor errado. Reprodução no desenho antigo: a sessão A recebia
  `"sou-da-sessao-b"`.
- **Vazamento.** A entrada nunca saía do `static`, então um processo de vida
  longa vazava um `SdkMcpServer` inteiro — com tudo que as closures das tools
  capturam (pools de banco, clientes HTTP) — **por sessão aberta**. Reprodução
  no desenho antigo: depois de a sessão encerrar, `Weak::strong_count()` = 1.

O conserto é de desenho: **as opções carregam o handle do servidor, não o
nome.** Não sobrou nenhum estado estático no módulo `sdk_mcp`.

#### Mudanças de API (breaking)

| Antes | Agora |
| --- | --- |
| `SdkMcpServerBuilder::register() -> McpServerConfig` | removido — use `.build()` e `ClaudeAgentOptions::add_sdk_mcp_server` |
| `SdkMcpServer::register() -> McpServerConfig` | removido — idem |
| `SdkMcpRegistry::global() -> &'static SdkMcpRegistry` | removido |
| `SdkMcpRegistry::for_options(&options) -> SdkMcpRegistry` | removido — o registry já **é** `options.sdk_mcp_servers` |
| `SdkMcpRegistry::insert(&self, SdkMcpServer)` | `insert(&mut self, impl Into<Arc<SdkMcpServer>>)` |
| `SdkMcpRegistry::remove(&self, &str)` | `remove(&mut self, &str)` |

Novidades:

- `ClaudeAgentOptions::sdk_mcp_servers: SdkMcpRegistry` — os handles desta
  sessão. É a única fonte que o `Query` consulta para `mcp_message`.
- `ClaudeAgentOptions::add_sdk_mcp_server(server) -> McpServerConfig` e
  `ClaudeAgentOptions::with_sdk_mcp_server(server) -> Self` — declaram o
  servidor no `--mcp-config` **e** guardam o handle na mesma chamada. Aceitam
  `SdkMcpServer` ou `Arc<SdkMcpServer>`.
- `SdkMcpServerBuilder::build_shared() -> Arc<SdkMcpServer>` — para quem precisa
  declarar o mesmo servidor em dois conjuntos de opções (transporte
  customizado).
- `SdkMcpRegistry::len()`.

`SdkMcpRegistry` deixou de ter `Arc<Mutex<..>>` por dentro: é um valor, e clonar
produz um mapa independente (as entradas continuam sendo `Arc`, então o clone é
barato). Assim o tipo não mente sobre partilha, e o servidor é liberado quando a
última sessão que o declarou morre.

#### Migração

```rust
// antes
let config = SdkMcpServer::builder("calc").tool(..).register();
let options = ClaudeAgentOptions {
    mcp_servers: McpServersConfig::Dict(HashMap::from([("calc".into(), config)])),
    ..Default::default()
};

// depois
let server = SdkMcpServer::builder("calc").tool(..).build();
let options = ClaudeAgentOptions::default().with_sdk_mcp_server(server);
```

Se o mesmo servidor precisa ir para dois conjuntos de opções (o caso de montar
um `SubprocessCLITransport` à mão), use `build_shared()` e passe
`Arc::clone(&server)` para cada um.

#### Comportamento preservado

Declarar apenas o **nome** em `mcp_servers`, sem entregar handle, continua sendo
erro em runtime (`No SDK MCP server found: <nome>`) — e agora não há mais
nenhum depósito global de onde cair silenciosamente no servidor de outra sessão.
