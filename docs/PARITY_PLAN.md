# Plano de paridade final — transporte nativo vs claude-code-js (CLI 2.1.90)

Data: 2026-08-29. Baseline: main `cd2576a`, suíte 596 testes verdes (~69s; gargalo
`test_subprocess_buffering` 60s — filtrar nas iterações).

## Escopo

Paridade é medida contra o **domínio de SDK/headless** do CLI decompilado
(`backup/claude-code-js-reference`): agent loop, control protocol, hooks,
permissões, tools, compaction, persistência, custo. UI ink/vim/voice/screens,
telemetria tengu/datadog, swarms/teammates, remote/coordinator mode e fast mode
ficam fora — não são superfície de SDK. "Independente de hot path" = tudo que a
superfície pública (`ClaudeAgentOptions`, métodos do `ClaudeSDKClient`, tools
default) promete tem que FUNCIONAR no caminho nativo, não só no subprocess.

## Estado atual (levantado)

Nativo já tem: loop fiel ao queryLoop (ordem budget→micro→auto→blocking→request),
retry (10x, overload por corpo, x-should-retry, unified-reset, mid-stream 3x),
fallback de modelo (abertura e mid-stream) com yieldMissingToolResultBlocks,
max_tokens overflow recovery, microcompact idempotente, autocompact com contagem
híbrida e circuit breaker, restauração pós-compact de arquivos, breakpoints de
cache redistribuídos no envio (âncoras 1h em tools/system, cauda 5m nas duas
últimas mensagens, a regra do jai), normalização/pareamento de tool_results, persistência
JSONL idêntica ao CLI + mirror, resume/fork, interrupt por turno, set_model,
can_use_tool round-trip com steering, PostToolUse hook, MCP in-process,
persist de tool result >50k, custo por modelo.

## Gaps → itens do plano

### Fase A — opções e controle que hoje são mentira no nativo (P0)

- **A1. `permission_mode` honrado + `set_permission_mode` funcional.**
  `ToolContext.permission_mode` hardcoded `Default` (`native.rs:849`); o control
  responde `{}` sem efeito (`native.rs:324`). Implementar semântica local:
  `default` (tudo via can_use_tool), `acceptEdits` (Edit/Write/NotebookEdit
  auto-allow), `bypassPermissions` (tudo auto-allow), `plan` (só read-only
  auto-allow, mutação nega), `dontAsk` (auto-deny do que pediria). Mode mutável
  em runtime via control e via ExitPlanMode.
- **A2. `allowed_tools`/`disallowed_tools` aplicados.** Hoje ignorados no nativo.
  Deny filtra o registry antes do request (como `filterToolsByDenyRules`);
  allow vira regra always-allow que pula o can_use_tool.
- **A3. Hooks além de PostToolUse.** Via `hook_callback` ids do initialize:
  `PreToolUse` (permissionDecision allow/deny/ask + updatedInput +
  additionalContext, antes do can_use_tool, como `resolveHookPermissionDecision`),
  `UserPromptSubmit` (additionalContext + block), `Stop` (blockingErrors →
  re-loop; preventContinuation → result stop_hook_prevented — ligar o
  `stop_hook` já existente do AgenticLoop ao roundtrip), `PreCompact`,
  `PostToolUseFailure`, `SessionStart`/`SessionEnd`, `Notification`.
- **A4. Compaction sobrevive entre turnos.** O engine reconstrói `history`
  não-compactado (limitação declarada em `native.rs:26`). Track do evento
  `compact_boundary`/`microcompact` no `track_history`: aplicar o boundary e as
  substituições ao histórico mantido.
- **A5. Controls reais:** `mcp_status` lista os sdk_mcp_servers com tools;
  `get_context_usage` devolve estimativa real (token_estimation + breakdown
  mínimo: system prompt, tools, mensagens); `rewind_files`/`mcp_reconnect`/
  `mcp_toggle`/`stop_task` respondem erro claro (não suportado) em vez de
  genérico — exceto `stop_task` se B4 sair.
- **A6. System prompt preset mínimo + `append`.** Preset `claude_code` no nativo
  gera um prompt base coerente (identidade + tone + tools + env block com cwd/
  platform/data) em vez de vazio; `append` continua concatenando. `File` mantém.

### Fase B — tools stub → funcionais (P1)

- **B1. TodoWrite real** com estado por sessão (oldTodos/newTodos no output).
- **B2. Task v2 tools reais** (TaskCreate/Get/List/Update/Stop/Output) sobre um
  task store in-process por sessão.
- **B3. AgentTool (Task) real:** subagente in-process = AgenticLoop aninhado com
  registry próprio (subagent_type de `options.agents` + `general-purpose`/
  `explore` builtin), tools restringíveis, eventos `parent_tool_use_id`
  propagados, resultado sintetizado no tool_result. Sem background na v1
  (run_in_background → executa foreground com aviso no output).
- **B4. Bash `run_in_background` + TaskOutput/TaskStop** integrados ao task
  store (processo tokio, output em arquivo, kill).
- **B5. Plan mode tools com efeito:** EnterPlanMode muda o mode do contexto pra
  `plan`; ExitPlanMode pede aprovação via can_use_tool e, aprovado, volta pra
  `default`/`acceptEdits`.
- **B6. WebSearch via server tool da API** (`web_search_20250305`) quando o
  backend suporta — a tool deixa de ser stub e vira tool de servidor no request.
- **B7. Stubs restantes com erro honesto e fora dos defaults:** AskUserQuestion,
  SendMessage, Skill, Cron, Worktree — mensagem explica que exigem o CLI;
  removidos de `register_defaults` (paridade honesta > fingir).

### Fase C — superfície de request e resultado (P2)

- **C1. `betas` das options → header** (`context-1m-2025-08-07` é o allowed do
  SDK; extra_args/env `CLAUDE_CODE_EXTRA_BETAS` não).
- **C2. `include_partial_messages`** → `include_stream_events: true` e frames
  `stream_event` com uuid/session_id.
- **C3. `max_budget_usd`** checado por turno no engine → result
  `error_max_budget_usd`.
- **C4. `user` (structured output `json_schema`)** — fora: beta não disponível
  no gateway de teste; registrar como não-suportado explícito se pedido.
- **C5. `env` extra do options no Bash tool** (herdar `options.env`).
- **C6. `add_dirs`** → additional working directories na validação de path das
  tools de arquivo.

### Fase D — validação (critério: TUDO FUNCIONA)

- **D1.** Testes mock (MockApi) por item novo — o padrão de
  `test_native_transport.rs`; nada de rede nos testes de CI.
- **D2.** Suíte completa verde com tempos medidos (filtrar o arquivo de 60s
  durante o desenvolvimento; rodada final completa).
- **D3.** Smoke real contra `https://jai.johnenrique.tech` (credenciais da
  sessão): um cenário multi-turno com tool use + permission + hook + resume.
  Rodadas caras acumuladas em levas, cronometradas.

## Ordem de execução

A1→A2→A3 (mexem no mesmo miolo build_executor/framework), A4, A5, A6, depois
B1→B2→B4→B3→B5→B6→B7, depois C1→C2→C3→C5→C6, D contínuo (mock junto de cada
item; suíte por leva; smoke real no fim).

## Status da execução (2026-08-29)

- **Fase A — CONCLUÍDA.** A1 (5 modos com semântica local + set_permission_mode
  efetivo), A2 (regras `Tool(pattern)` com glob, deny incondicional filtra o
  registry), A3 (PreToolUse com permissionDecision/updatedInput,
  UserPromptSubmit com block/additionalContext, Stop via stop_hook do loop,
  PreCompact, PostToolUseFailure, SessionStart/End), A4 (on_history_rewrite +
  aplicação no evento de boundary), A5 (mcp_status real, get_context_usage com
  estimativa, erros claros para rewind_files/mcp_reconnect/mcp_toggle/stop_task),
  A6 (preset claude_code com identidade+env, append concatena).
- **Fase B — CONCLUÍDA com um ajuste.** B1 (TodoWrite persiste e devolve
  old/new), B2 (Task v2 sobre TaskStore por sessão), B3 (subagente in-process
  `Task`/`Agent` com AgenticLoop aninhado, permissões herdadas, agents das
  options), B4 (Bash run_in_background + TaskOutput/TaskStop), B5 (plan mode
  tools com efeito; ExitPlanMode passa pela aprovação e volta a acceptEdits),
  B7 (AskUserQuestion REAL via can_use_tool/updatedInput.answers; SendMessage/
  Skill/Cron/Worktree com erro honesto apontando o transporte CLI).
  **B6 ajustado:** WebSearch continua stub de comportamento definido (erro
  claro) — o server tool `web_search` exigiria suporte a blocos
  `server_tool_use` no acumulador SSE, e o valor não paga o risco agora; o
  gateway de teste tampouco o anuncia. Fica registrado como próximo passo
  opcional.
- **Fase C — CONCLUÍDA.** C1 (betas → header + janela 1M), C2
  (include_partial_messages → stream_event), C3 (max_budget_usd →
  error_max_budget_usd), C5 (env extra no Bash), C6 (add_dirs plumbado no
  ToolContext; as file tools não impõem sandbox, então não há o que restringir).
  C4 (structured output) segue não-suportado explícito, como planejado.
- **Fase D — CONCLUÍDA.** 11 testes novos de conformidade em
  `tests/test_native_parity.rs` (modos, hooks, tasks, background, preset,
  context usage) + suíte completa verde (28 alvos, ~70s). Smoke real contra
  `jai.johnenrique.tech`: tool Read executada com segredo imprevisível,
  memória entre turnos, custo rastreado (~$0.005/turno).

## Pendências fechadas (2026-08-29, segunda passada)

Todas as pendências que a primeira passada deixou documentadas estão fechadas.

- **B6 — WebSearch como server tool: FEITO.** A medição inicial contra o
  gateway falhou com uma chave/modelo antigos; com a chave nova e
  `claude-sonnet-5` o endpoint devolve `server_tool_use` +
  `web_search_tool_result`, então o suporte foi implementado de verdade:
  - `ContentBlock::ServerToolUse` / `WebSearchToolResult` no tipo da API, com
    passagem intacta pelo histórico e pelas requests seguintes;
  - `ToolDefinition` ganhou `type` + `max_uses` e omite `input_schema` para
    server tools (a API rejeita o schema nelas);
  - `Tool::api_definition()` deixa a tool escolher a definição enviada; a
    `WebSearchTool` manda `web_search_20250305` e nunca executa localmente —
    se `execute` for chamado, a mensagem diz que o backend não suporta;
  - `cache_control` nunca é posto numa server tool (a API recusa);
  - o acumulador SSE trata os blocos novos e **um tipo de bloco desconhecido
    passa a ser descartado em vez de matar a sessão** (gateway fora de spec).
  - Validado na API real: `server_tool_use{query}` + resposta correta.
- **Truncamento in-place do `apply_tool_result_budget`: FEITO.** Existe agora
  `apply_tool_result_budget_persisting`: acima do teto, o conteúdo INTEIRO vai
  para `<dir>/<tool_use_id>.txt` e o bloco vira `<persisted-output>` com
  preview + caminho. É idempotente por construção (nome derivado do
  `tool_use_id`, bloco já persistido não é reprocessado), que é o que preserva
  o prompt cache entre turnos. Sem diretório, cai no truncamento UTF-8-safe de
  antes. O loop passa o `tool_results_dir` do executor.
- **C4 — `output_format` e amigos: FEITO (aviso explícito).** Nada mais é
  ignorado em silêncio: o engine emite `system/unsupported_options` nomeando
  cada opção sem tradução nativa (output_format, effort, plugins, settings,
  setting_sources, skills, sandbox, permission_prompt_tool_name, task_budget,
  continue_conversation, mcp_servers externos).
- **`thinking: adaptive` deixou de ser ignorado.** Vira thinking habilitado com
  budget real, e `max_thinking_tokens` das options passa a ser honrado (vence o
  budget do ThinkingConfig; `disabled` continua desligando).

Validação desta passada: 5 testes novos em `test_native_parity.rs` (server tool
declarada/não executada, bloco desconhecido tolerado, tool result grande
persistido com arquivo completo em disco, unsupported_options anunciadas,
adaptive→budget) + 4 em `normalize.rs` (persistência, idempotência, fallback,
no-op sob o teto). Suíte completa verde (~73s) e smoke real com Read multi-turno
e `web_search` server-side.

### O que continua fora de escopo (deliberado, não pendência)

`output_format`/structured output, effort, plugins, settings/setting_sources,
skills, sandbox, permission_prompt_tool_name, task_budget e MCP externo
(stdio/HTTP) seguem sendo território do transporte subprocess — agora
**anunciados** em vez de silenciosos. SendMessage/Skill/Cron/Worktree
permanecem com erro honesto pelo mesmo motivo.
