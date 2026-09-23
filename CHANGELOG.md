# Changelog

Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Versões ainda não publicadas ficam em `Unreleased`.

## [Unreleased]

## [0.1.1](https://github.com/JoaoHenriqueBarbosa/rust-agent-sdk/compare/v0.1.0...v0.1.1) - 2026-09-23

### Fixed

- *(ci)* clippy do Rust 1.98 e teste que depende do CLI real

### Adicionado: `ClaudeSDKClient::with_native_transport()`

Monta o `NativeApiTransport` dentro do `connect`, a partir das mesmas opções
que o subprocess receberia, em vez de o chamador montar o transporte à parte
com `with_transport`. A diferença que importa é o `session_store`: um
transporte pronto de fora pulava a materialização do resume, e com
`resume` + `session_store` a sessão era lida do disco local e não do store.
Agora ela é carregada do store para um `CLAUDE_CONFIG_DIR` temporário, como o
`materialize_resume_session` do SDK Python faz antes de abrir o CLI, e o
diretório some no `disconnect`. O transporte recebe junto o store (para os
frames `transcript_mirror`), os servidores MCP in-process e o `can_use_tool`.

### Adicionado: `ClientHandle`, controle da sessão durante a leitura

`ClaudeSDKClient::handle()` devolve um handle clonável que manda mensagem de
usuário, `interrupt`, `set_model`, `set_permission_mode` e fecha a entrada
ENQUANTO outra tarefa consome `next_message`. O cliente lê com `&mut self`, e
sem o handle ninguém conseguia interromper nem mandar a próxima mensagem no
meio de um turno, o que o SDK Python faz porque lê numa tarefa de fundo. Por
baixo, `Transport::concurrent_writer()` (default `None`) devolve um
`TransportWriter` que escreve sem disputar a leitura; o transporte nativo
oferece um.

### Corrigido: `control_request` atendido em paralelo com a leitura

O `Query` atendia `can_use_tool`, `hook_callback` e `mcp_message` em linha,
dentro do `next_message`. Um `can_use_tool` que espera o usuário responder um
formulário travava a leitura inteira: a resposta de um `interrupt` ou
`set_model` mandado pelo `ClientHandle` nesse meio tempo nunca era lida e o
pedido estourava o prazo. Como o SDK Python (`start_soon(self._handle_control_request, ...)`),
o atendimento agora roda numa tarefa própria quando o transporte oferece
escritor concorrente; sem ele, segue em linha. A tarefa é filha do `Query`:
o `close` (e o `disconnect`) a cancela, como o task group do Python cancela
um atendimento pendente, então um callback parado esperando o usuário não
sobrevive à sessão.

### Mudado: transcript, mensagens por bloco e resume do transporte nativo iguais aos do CLI

Uma sessão gravada pelo CLI é retomada pelo nativo e vice-versa, no mesmo
`~/.claude` (compartilhado em produção), e o `session_store` recebe as mesmas
entradas que o CLI espelharia.

- **Caminho** (`src/internal/sessions.rs`, `src/session.rs`): a raiz é a que o
  CLI subprocesso veria com o `env` das opções mesclado ao do processo
  (`CLAUDE_CONFIG_DIR`, senão `$HOME/.claude`, e agora o `HOME` das opções
  também vale), em NFC como o `getClaudeConfigHomeDir`. O diretório do projeto
  segue o `sanitizePath` do CLI empacotado: unidades UTF-16 e, acima de 200
  caracteres, o sufixo do `Bun.hash` (port do `std.hash.Wyhash` do Zig,
  conferido contra o Bun). Um diretório com o mesmo prefixo que já exista (o
  CLI em Node, ou o SDK Python materializando um resume) é reaproveitado.
- **Entradas** (`src/session.rs`): cada mensagem sai como no
  `insertMessageChain` (`sessionStorage/Project.js`), com as chaves na mesma
  ordem: `parentUuid`, `logicalParentUuid` (compact boundary), `isSidechain`,
  `promptId` (nas de usuário), a mensagem interna (`type`, `message`, `uuid`,
  `timestamp`, `requestId`, `toolUseResult`, `sourceToolAssistantUUID`,
  `isMeta`...) e `userType`, `entrypoint` (`sdk-rs`, ou o
  `CLAUDE_CODE_ENTRYPOINT` das opções), `cwd` canonicalizado, `sessionId`,
  `version` (`2.1.90`) e `gitBranch` (o `computeBranch`: nome do branch ou
  `HEAD`). O resultado de tool aponta para o bloco que pediu a tool, o prompt
  vai com o conteúdo como veio (string) e o `uuid` do frame, o contexto de um
  hook UserPromptSubmit vira o anexo `hook_additional_context`, e o compact
  boundary grava a marca do `createCompactBoundaryMessage` e o resumo
  (`isCompactSummary`). A escrita agora faz `flush` antes de espelhar.
- **Assistente por bloco** (`src/agentic.rs`, `src/native.rs`): como o
  `queryModel` (`services/api/claude/_shared.js`), cada `content_block_stop`
  entrega uma mensagem de assistente com o `message` do `message_start` e o
  `content` trocado pelo bloco, todas com o mesmo `message.id`,
  `stop_reason` nulo e o `usage` do início; o `requestId` vem do header
  `request-id`. O `message_delta` fecha a resposta: o último bloco vai ao
  transcript com o `stop_reason` e o `usage` do `updateUsage`, como o CLI
  grava. O histórico que vai à API junta os blocos do mesmo id numa mensagem
  só. A mensagem que parou em `max_tokens` sai sempre, e o erro sintético
  `API Error: ... output token maximum` só aparece quando a recuperação se
  esgota (o `isWithheldMaxOutputTokens` do `query.js`). Os resultados de erro
  do `yieldMissingToolResultBlocks` levam `toolUseResult` e o bloco de origem,
  a mensagem de Stop hook sai `isMeta`, e os frames de usuário ganham
  `timestamp` e `tool_use_result`.
- **Resume** (`src/internal/transcript_load.rs`): port do
  `loadTranscriptFile` (ponte de `progress` legado,
  `applyPreservedSegmentRelinks`, `applySnipRemovals`), da folha do
  `getLastSessionLog`, do `buildConversationChain` com
  `recoverOrphanedParallelToolResults` e do
  `deserializeMessagesWithInterruptDetection` (turno interrompido ganha o
  `Continue from where you left off.`, prompt sem resposta ganha o
  `No response requested.`). O request vê a conversa pelo
  `normalizeMessagesForAPI`: anexos sobem com o `reorderAttachmentsForAPI` e
  viram `<system-reminder>`, blocos do mesmo `message.id` se juntam, mensagens
  de usuário se fundem com o `joinTextAtSeam`. Sidechains, `system` e
  entradas de metadados ficam fora. As mensagens que o arquivo ainda não tem
  (as sintéticas do resume; no fork, a conversa inteira) são gravadas junto
  com o primeiro prompt, encadeadas da última entrada existente. Resume de
  sessão inexistente falha com `No conversation found with session ID`, como
  o CLI.
- Testes em `tests/test_native_transcript.rs`, com um transcript real do CLI
  2.1.247 (`tests/fixtures/transcripts/cli_2_1_247_sdk_tool_chain.jsonl`) e um
  montado a partir do código do CLI (`cli_chain_features.jsonl`).

### Mudado: as tools builtin do transporte nativo em paridade com o CLI 2.1.90

A referência é o CLI 2.1.90 de verdade, não só o código decompilado: cada
descrição, schema e resultado foi conferido contra o que o CLI mandou a um
servidor local no lugar da API (sessão `-p`, `--setting-sources project`,
modo SDK). As definições capturadas viraram fixtures em
`tests/fixtures/cli_2_1_90/tools/`, e `tests/test_native_tools_js_parity.rs`
exige que descrição e `input_schema` saiam idênticos, inclusive o `$schema` e
a ordem das chaves.

**Framework** (`src/tools/framework.rs`, `permission.rs`,
`schema_validation.rs`, `file_state.rs`):

- A ordem do `checkPermissionsAndCallTool` e do `runToolUse`
  (`services/tools/toolExecution/*.js`): tool inexistente
  (`<tool_use_error>Error: No such tool available: X</tool_use_error>`), turno
  cancelado (`CANCEL_MESSAGE`), validação de schema ANTES da permissão com os
  issues do zod v4 e o texto do `formatZodValidationError`
  (`utils/toolErrors.js`), `validateInput` da tool, hook PreToolUse
  (`resolveHookPermissionDecision` de `services/tools/toolHooks.js`),
  permissão e execução. Tool MCP é validada só como objeto, como o
  `z.object({}).passthrough()` do MCPTool.
- A decisão de permissão do `hasPermissionsToUseTool`
  (`utils/permissions/permissions.js`): regra deny (`Permission to use X has
  been denied.`), regra ask, `checkPermissions` de cada tool,
  `requiresUserInteraction`, bypass, regra allow, `passthrough` virando
  pergunta, e `dontAsk` com o `DONT_ASK_REJECT_MESSAGE`. Tool read-only NÃO é
  mais autoaprovada por ser read-only, e plan mode NÃO recusa mais mutação
  por conta própria: como no CLI, a pergunta chega ao `can_use_tool`.
- Regras no formato do `permissionRuleParser.js` (escapes, `Tool(*)`, nomes
  antigos como `Task`), curinga `mcp__servidor` e `mcp__servidor__*`, regras
  de caminho `Read(...)`/`Edit(...)` com as raízes e a semântica gitignore do
  CLI, e as checagens de leitura e escrita por caminho
  (`utils/permissions/filesystem/checkReadPermissionForTool.js` e
  `checkWritePermissionForTool.js`): leitura livre dentro dos diretórios de
  trabalho, pergunta fora deles com `decision_reason` e sugestões.
- O pedido ao callback leva o que o `can_use_tool` do CLI manda
  (`cli/structuredIO.js`): `permission_suggestions`, `blocked_path`,
  `decision_reason`, `tool_use_id` e `agent_id`. `updatedInput` vazio mantém o
  input original, e a recusa com `interrupt` (`DenyAndInterrupt`) marca o
  resultado para o loop encerrar o turno.
- O resultado carrega o `tool_use_result` estruturado de cada tool, o
  `content` em string quando o JS devolve string, e as mensagens meta que o JS
  anexa depois do tool_result (`newMessages`). Resultado vazio vira
  `(<tool> completed with no output)` e resultado grande é persistido no
  formato do `buildLargeToolResultMessage` (`utils/toolResultStorage.js`),
  com o limiar de cada tool.
- As tools vão ao request na ordem do `assembleToolPool`
  (`utils/toolPool.js`): builtins pelo `localeCompare`, MCP depois.
  `register_defaults` registra o conjunto default do CLI numa sessão SDK não
  interativa; TaskCreate/TaskGet/TaskList/TaskUpdate (TodoV2) saíram dele e
  continuam registráveis pelo nome.
- `readFileState` da sessão (`utils/fileStateCache.js`), compartilhado entre
  Read, Edit e Write.
- `serde_json` com `preserve_order`, para as chaves saírem na ordem do JS.

**Read** (`tools/FileReadTool/**`, `utils/readFileInRange.js`,
`utils/notebook.js`, `utils/imageResizer.js`, `utils/pdf.js`,
`utils/pdfUtils.js`): descrição e schema literais com o suporte a PDF
conforme o modelo, `semanticNumber` em `offset`/`limit`, validações antes da
permissão, prefixo `N\t` sem corte de linha, limites de 256KB e 25000 tokens,
`Did you mean`, stub de arquivo inalterado, lembrete de malware conforme o
modelo, notebook, imagem com a detecção pelos magic bytes e a sequência de
redimensionamento do CLI (dependências novas `image`, `png`, `color_quant`),
e PDF com `pages`, `pdfinfo`, `pdftoppm -jpeg -r 100`, os limites do CLI e o
documento inteiro como bloco `document` numa mensagem meta separada.

**WebFetch e WebSearch** (`tools/WebFetchTool/*.js`,
`tools/WebSearchTool/*.js`, `services/api/claude/queryHaiku.js`): WebFetch
com a URL normalizada, hosts pré-aprovados e regras `WebFetch(domain:...)`,
upgrade para https, headers e limites do CLI, redirects só no mesmo host com o
aviso `REDIRECT DETECTED`, cache de 15 minutos, HTML para Markdown por um
port do turndown (`src/tools/html_to_markdown.rs`; medido no 2.1.90, o
Readability não chega a ser aplicado) e o resumo pelo modelo pequeno com o
`makeSecondaryModelPrompt` literal. WebSearch virou a tool CLIENTE
`WebSearch` do CLI: chamada aninhada, com streaming, com a server tool
`web_search_20250305` (`max_uses` 8, domínios) e o texto `Web search results
for query: ...`. Dependências novas: `url`, `html5ever`,
`markup5ever_rcdom` e as features `gzip`, `deflate` e `brotli` do
`reqwest`.

**Bash, Edit, Write, Glob, Grep e NotebookEdit**
(`tools/BashTool/**`, `tools/FileEditTool/**`, `tools/FileWriteTool/**`,
`tools/GlobTool/*.js`, `tools/GrepTool/*.js`, `tools/NotebookEditTool/*.js`,
`utils/Shell.js`, `utils/diff.js`, `utils/ripgrep.js`): Edit e Write exigem
leitura prévia e recusam arquivo modificado depois dela, aceitam aspas
curvas, preservam codificação e fim de linha e devolvem o `structuredPatch`
do jsdiff; Glob e Grep usam o ripgrep com os argumentos do CLI; o Bash
executa como o CLI (cwd persistente, semântica de código de saída, timeout
que manda para o background) e segue o `bashToolHasPermission` no que é
viável sem o tree-sitter, perguntando no resto.

**Agent, AskUserQuestion, Skill, worktree, plan mode, TaskOutput, TaskStop,
TodoWrite e MCP** (`tools/AgentTool/**`, `tools/AskUserQuestionTool/*.js`,
`tools/SkillTool/*.js`, `tools/EnterWorktreeTool/*.js`,
`tools/ExitWorktreeTool/*.js`, `tools/EnterPlanModeTool/*.js`,
`tools/ExitPlanModeTool/*.js`, `tools/TaskOutputTool/**`,
`tools/TaskStopTool/*.js`, `tools/TodoWriteTool/*.js`,
`services/mcp/client/*.js`): o `AgentTool` real com o prompt, o schema, os
agentes builtin do modo SDK e o resultado do CLI (o stub que só dava erro
saiu); AskUserQuestion com o refinamento de unicidade e o resultado
`User has answered your questions: ...`; Skill lendo `SKILL.md` dos
diretórios de skills; worktree via git em processo; plan mode com o arquivo
de plano e a volta ao modo anterior; TaskOutput em tags; TodoWrite com
`{oldTodos,newTodos,verificationNudgeNeeded}`; e `tools::mcp_result`, que
converte o `tools/call` MCP no tool_result do CLI e corta a descrição em
2048 com `… [truncated]`.

**Bugs da referência corrigidos** (reproduzidos no CLI 2.1.90 real):

- Read de arquivo vazio: o CLI respondia `Warning: the file exists but is
  shorter than the provided offset (1). The file has 1 lines.`; agora vem o
  aviso de arquivo vazio que o próprio prompt do Read promete.
- Read de notebook com `output_type` desconhecido: o CLI falhava com
  `Cannot read properties of undefined (reading 'text')`; agora a saída
  desconhecida é pulada e o notebook é lido.

### Corrigido: stream quebrado repete a chamada sem streaming, como no CLI

Quando o stream quebra depois que a resposta abriu, o transporte nativo passa
a repetir a MESMA chamada uma vez sem streaming, na regra do `queryModel` do
CLI, e é essa resposta que conclui o turno. Isso cobre o model-router atrás de
`ANTHROPIC_BASE_URL` que responde a chamada streaming com HTTP 200 e um
`event: error` no SSE quando o provider primário cai, e manda a chamada sem
streaming para o provider de fallback. Antes o erro que chegava antes do
primeiro evento subia direto, e o loop repetia a chamada STREAMING três vezes
até desistir, sem nunca tentar a não-streaming.

Os gatilhos são os do CLI: qualquer erro na leitura do stream, antes ou depois
do primeiro evento (`event: error`, conexão cortada, JSON inválido), o stream
que termina sem `message_start` ou sem nenhum bloco completo e sem
`stop_reason`, o watchdog de inatividade (`CLAUDE_ENABLE_STREAM_WATCHDOG`, com
`CLAUDE_STREAM_IDLE_TIMEOUT_MS`, 90s por padrão) e o 404 na abertura do
stream. Não caem no fallback o timeout do próprio cliente HTTP nem nada com
`CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK` ligado (o 404 cai mesmo assim). O
stream que termina com blocos ou `stop_reason` mas sem `message_stop` segue
com o que chegou, sem fallback.

A chamada sem streaming leva os mesmos parâmetros e headers, com `max_tokens`
limitado a 64000 (e o orçamento de thinking abaixo dele), timeout por
tentativa de `API_TIMEOUT_MS` ou 300s (120s com `CLAUDE_CODE_REMOTE`), e o
retry de sempre, que já conta o primeiro 529 quando foi uma sobrecarga que
quebrou o stream. O que o stream já entregou fica órfão, como no tombstone do
CLI: o `tool_use` completo que veio antes do erro não roda, e a resposta da
não-streaming sai inteira numa mensagem de assistente. O erro que chega ao
loop (a não-streaming também falhou) encerra o turno, sem as três repetições
streaming de antes. O `AnthropicClient` ganha `StreamFallbackConfig`
(`with_stream_fallback`), que o transporte nativo monta do env das opções, e
o `StreamUpdate::NonStreamingFallback` que marca a troca.

### Mudado: o motor nativo entrega às tools e ao `can_use_tool` o que o CLI entrega

O `ToolContext` das tools nativas passa a vir preenchido como o
`toolUseContext` do CLI 2.1.90: `model_call` com o cliente da sessão (mesma
chave, base URL e headers; `stream: true` sai com streaming, como o
`queryModelWithStreaming` da busca do WebSearch, e `stream: false` sem, como o
`queryHaiku` do resumo do WebFetch), `main_model` com o modelo do turno,
`small_fast_model` do `ANTHROPIC_SMALL_FAST_MODEL`/`ANTHROPIC_DEFAULT_HAIKU_MODEL`
das options, `skill_directories` das fontes de `setting_sources` (todas sem a
opção) e `abort` com o token do turno. No subagente, como o `runAgent` de um
agente síncrono: `main_model` é o modelo resolvido dele, `agent_id` é novo (o
`createAgentId`, `a` e 16 dígitos hexadecimais), o cancelamento é o do pai e o
`readFileState` nasce vazio. Antes disso WebFetch e WebSearch respondiam erro
por falta de modelo, e o Read de PDF não sabia o modelo da sessão.

O Read é registrado com `FileReadTool::for_model` (sem a linha de PDF no
prompt para os modelos que não leem PDF) e o Bash com o modelo na linha de
atribuição, tanto na lista nomeada quanto no conjunto default. Os nomes
seguem o CLI: o subagente é só `Agent` (`Task` continua aceito na lista de
tools como alias, mas não vira uma segunda tool no request), o WebSearch só
`WebSearch` (`web_search` não é nome de tool do CLI), e aliases como
`KillShell` resolvem para a builtin sem registrar duas vezes.

O `can_use_tool` leva `permission_suggestions`, `blocked_path`,
`decision_reason` e `agent_id`, só quando existem (o `JSON.stringify` do
`createCanUseTool` descarta `undefined`). Um deny com `interrupt: true` vira
`PermissionOutcome::DenyAndInterrupt` e aborta o turno na hora: as tools em
paralelo param, nenhum pedido novo sai à API, o loop emite a mensagem
`[Request interrupted by user for tool use]` (o `abort()` desse caso não tem o
motivo `interrupt`, então o CLI a emite) e o result é `error_during_execution`.

As mensagens que uma tool anexa depois do tool_result (`result.newMessages`,
como o documento do Read de PDF, as páginas extraídas e a nota da imagem
redimensionada) passam a chegar ao modelo: vão ao histórico depois do bloco
de tool_results, saem ao cliente como `user` com `isSynthetic: true` e ao
transcript como `isMeta`. Como o `normalizeMessage` do CLI, uma mensagem de
usuário com vários blocos sai ao cliente partida em um frame por bloco, com o
uuid do `deriveUUID`.

### Adicionado: memórias (`CLAUDE.md`) e contexto de usuário no transporte nativo

`setting_sources` deixou de ser opção "sem tradução" no transporte nativo. As
memórias são carregadas como o `getMemoryFiles` do CLI 2.1.90: a gerenciada
(`/etc/claude-code`) sempre, a do usuário (`CLAUDE_CONFIG_DIR` ou `~/.claude`)
só com `user`, as de projeto (`CLAUDE.md`, `.claude/CLAUDE.md`,
`.claude/rules`) do cwd subindo até a raiz só com `project`, `CLAUDE.local.md`
só com `local`, e o `MEMORY.md` da memória automática conforme
`isAutoMemoryEnabled` (que não depende das fontes). Sem `setting_sources`
valem todas as fontes, que é o CLI sem `--setting-sources` (o SDK Python
0.2.93 não passa a flag quando a opção é `None`); `[]` deixa só a gerenciada e
a memória automática.

O texto (`claudeMd` + `currentDate`) vira a mensagem meta com
`<system-reminder>` do `prependUserContext`, posta na frente das mensagens de
CADA chamada ao modelo (inclusive nas dos subagentes e depois de uma
compactação) e nunca gravada no transcript. Como o `getUserContext` do CLI, o
valor é memoizado pela sessão: um `CLAUDE.md` reescrito no meio só é relido
depois de uma compactação da conversa principal (`runPostCompactCleanup`).

A auditoria do `src/memory.rs` contra o JS corrigiu: o filtro de regra
condicional (`paths:` no frontmatter) vale para cada arquivo devolvido,
inclusive os trazidos por `@include`; links simbólicos em `.claude/rules` são
seguidos pelo caminho resolvido; `~` dos includes é o home do usuário, não o
pai do `CLAUDE_CONFIG_DIR`; a memória automática respeita
`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` e usa a raiz canônica do repositório
(a do principal, num worktree). API nova: `memory::UserContextCache` e os
campos `MemoryConfig::home`, `MemoryConfig::auto_memory_override` e
`MemoryFile::conditional`.

### Mudado: `system` do transporte nativo igual ao do CLI numa sessão SDK

O `system` agora sai como o `services/api/claude` do CLI monta: o cabeçalho
de atribuição (`x-anthropic-billing-header: cc_version=2.1.90.<fp>;
cc_entrypoint=<entrypoint>;`, com a impressão digital calculada da primeira
mensagem de usuário como no `computeFingerprint`), o prefixo de identidade do
SDK (`You are a Claude agent, built on Anthropic's Claude Agent SDK.`, ou a
variante `running within the Claude Agent SDK` quando o preset tem `append`) e
o prompt num bloco só (`custom`, ou preset + `append` unidos por linha em
branco). Sem `system_prompt` o `system` fica só com cabeçalho e prefixo, como
o CLI com `--system-prompt ""`. O entrypoint é `sdk-rs` (o que o transporte
subprocess dá ao CLI) ou o `CLAUDE_CODE_ENTRYPOINT` do `env` das opções, e
`CLAUDE_CODE_ATTRIBUTION_HEADER` falso desliga o cabeçalho. O preset nativo
perdeu a linha de identidade própria, que agora é o bloco de prefixo.

### Mudado: frame `system`/`init` do transporte nativo com os campos do CLI

O `init` (um por consulta, como no CLI) passou de quatro campos para os de
`buildSystemInitMessage`: `cwd`, `tools` (a tool de agente como `Task`),
`mcp_servers` (`{name, status}`), `model`, `permissionMode` (o valor do
protocolo, `default`, `bypassPermissions`..., e não mais o `Debug` do enum),
`slash_commands`, `apiKeySource` (`ANTHROPIC_API_KEY`), `betas` (quando há),
`claude_code_version`, `output_style`, `agents`, `skills`, `plugins` e
`fast_mode_state`. O `AgenticLoopOptions` ganhou `init_info`, `system_prefix`,
`user_context` e `clear_user_context_on_compact`.

### Mudado: `skills=[]` e `permission_prompt_tool_name="stdio"` sem aviso

No transporte nativo, `skills=[]` é o "nenhuma skill" do SDK Python e não gera
mais `unsupported_options`; só `"all"` ou uma lista com nomes avisa. O
`permission_prompt_tool_name = "stdio"` que o cliente põe quando há
`can_use_tool` (inclusive via `with_native_transport()`) também é o caminho
normal; só outro nome avisa.

### Corrigido: a espera pelo `can_use_tool` não estoura mais em 10 minutos

O transporte nativo punha um teto de 600 s em toda resposta do cliente a um
`control_request`, e um formulário (o `AskUserQuestion` do serviço, por
exemplo) aberto por mais tempo virava recusa. Agora a espera segue o
`StructuredIO.sendRequest` do CLI:

- `can_use_tool` não tem teto; só o interrupt do turno encerra a espera, com a
  recusa que o CLI produz (`Tool permission request failed: AbortError`);
- `hook_callback` usa o `timeout` (segundos) do seu `HookMatcher`, ou os
  10 minutos do `TOOL_HOOK_EXECUTION_TIMEOUT_MS`, somado ao interrupt; estourar
  ou ser cancelado vale como hook que não fez nada (`{}`);
- toda espera cancelada ou estourada avisa o cliente com um
  `control_cancel_request`.

O token de cancelamento do turno passou a nascer na chegada do prompt, para o
interrupt de um turno anterior não cancelar os hooks do `UserPromptSubmit` do
seguinte, e o `SessionEnd` roda com um token novo.

### Adicionado: `deferred_tool_use`, `api_error_status` e `HookEventMessage`

Paridade com o `message_parser.py` do SDK Python 0.2.93: o `ResultMessage`
ganhou `deferred_tool_use: Option<DeferredToolUse>` (`id`, `name`, `input`;
objeto vazio ou nulo é ausência, faltar campo é erro de parse) e
`api_error_status: Option<i64>`. Frames `system` com `subtype`
`hook_started`/`hook_response` viram `Message::HookEvent(HookEventMessage)`,
com `hook_event_name` tirado de `hook_event`, `hook_name` ou `hook_event_name`,
e contam como mensagem de sistema em `Message::is_system`.

### Mudado: breakpoints de prompt cache no transporte nativo seguem a regra do jai

O transporte nativo marcava três pontos, todos com TTL de 5 minutos: a última
tool, o último bloco de system e o último bloco da última mensagem. Agora o
`AnthropicClient` redistribui os breakpoints no corpo de toda chamada a
`/v1/messages` (loop principal, subagentes, compactação, título) com o mesmo
layout do `cache_opt` do jai, validado ao vivo numa request real de 308k tokens:

- limpa todo `cache_control` que vier no request;
- âncoras com TTL de 1h em `tools[-1]` e `system[-1]`, que seguram o prefixo
  grande nas pausas de uma sessão de código;
- cauda com TTL de 5m em `messages[-2]` e `messages[-1]`: a última cacheia a
  conversa inteira, a penúltima o prefixo que o próximo turno vai ler;
- nunca mais de 4, e sempre 1h antes de 5m na ordem do prefixo (a API devolve
  400 no contrário).

O beta `extended-cache-ttl-2025-04-11`, exigido pelo TTL de 1h, entrou nos
betas default do cliente. Como no jai, marcações de cache feitas à mão
(`ContentBlock::text_cached`, `SystemBlock::text_cached`) são descartadas no
envio. `messages::inject_cache_control` foi removida: a marcação que ela fazia
era apagada pela redistribuição.

### Adicionado: `JsonLineFramer` público

O enquadramento dos frames stream-json (uma linha, um objeto; objeto partido
entre linhas bufferizado; ruído do CLI descartado; teto de buffer; bytes
parciais que sobrevivem a um cancelamento no meio da leitura) era um detalhe
privado do `SubprocessCLITransport`. Só que essas regras não têm nada de
específico de subprocess: qualquer transporte que receba o protocolo por um
fluxo de bytes precisa exatamente delas, e quem implementa `Transport` por fora
só tinha a opção de copiá-las, bug por bug, e ver as cópias divergirem na
primeira correção.

Agora são um tipo próprio, `JsonLineFramer`, com dois modos de alimentação:
`line_buffer()` como destino de `read_until` para fontes `AsyncBufRead` (é o
que o subprocess usa, e é o que preserva o parcial no cancelamento), e
`push_chunk()` para fontes que entregam pedaços soltos, como o stream
multiplexado de um `docker exec` ou frames de WebSocket. O
`SubprocessCLITransport` passou a delegar para ele, então não existe mais uma
segunda implementação para sair de sincronia.

### Adicionado: `tool_env_denylist` nas opções

`options.env` acumula dois papéis que só coincidem no caso simples: configurar
o MOTOR (`ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`) e preparar o ambiente dos
processos que as tools spawnam, porque o `Bash` repassa o env inteiro para o
comando. Quem embute o motor num sandbox multi-inquilino quer o primeiro sem o
segundo: senão um `env` digitado pelo modelo no shell revela a credencial da
sessão.

`tool_env_denylist` é uma lista de prefixos que não chegam às tools que
executam processo. O default é vazio, ou seja, o comportamento histórico de
repassar tudo continua idêntico para quem não configurar nada.

### Adicionado: `PostgresSessionStore` é `Clone`

`PgPool` é um handle contado, então clonar o store custa um `Arc` e não abre
conexão nova. É o que permite a um servidor com muitas sessões vivas dar um
store a cada uma reusando o pool da aplicação, em vez de repetir o
`create_schema` de `with_pool` a cada sessão.

### Adicionado — `get_projects_dir` é público

A raiz em que o `claude` grava os transcripts canônicos
(`~/.claude/projects`, ou `$CLAUDE_CONFIG_DIR/projects`) já era calculada pela
crate, mas só internamente. Quem usa o `SessionStore` para espelhar transcripts
precisa dela para responder duas perguntas que o espelho não responde: *o
`<session_id>.jsonl` ainda existe?* (o `--resume` depende dele, e com transporte
customizado a materialização de sessão é pulada) e *como apago o transcript real
junto com a cópia espelhada?*. Reconstruir a fórmula do lado de fora duplicaria a
regra de nomeação e ficaria dessincronizada na primeira mudança.

`project_key_for_directory` já era público e continua sendo o nome da pasta sob
essa raiz — os dois juntos localizam o arquivo.

### Corrigido — hook declarado agora é hook executado

`ClaudeSDKClient::connect` convertia cada `HookMatcher` para JSON na fronteira
`ClaudeSDKClient` → `Query` e **descartava as closures** (cada hook virava
`Value::Null`). Só a FORMA chegava à `Query`: o `initialize` anunciava os
`hookCallbackIds` corretamente, o CLI chamava um deles e a resposta era
`No hook callback found for ID` — sem erro no `connect`, sem log, sem sintoma.
Todo hook declarado pela API tipada era decorativo.

Agora os matchers viajam inteiros (`HookMatcher`, com as `HookCallbackFn`), e o
caminho one-shot (`InternalClient::process_query`) passou a extrair e registrar
os hooks antes de as options irem para o transporte — ele os aceitava e não
registrava nenhum.

Contrato: `tests/test_streaming_hooks.rs`.

### Mudado — `sqlx` 0.9 no backend Postgres do `SessionStore`

A feature `postgres` passou a usar `sqlx` 0.9 (era 0.8), e as chamadas de SQL
montado por interpolação de nome de tabela foram envoltas em
`sqlx::AssertSqlSafe` — a API que a 0.9 exige para texto que não é literal. O
gate continua sendo `valid_identifier`, aplicado no `with_pool`: nenhum valor de
chamador chega ao texto SQL, todos são bindados.

O alinhamento de versão não é cosmético: quem embute este `SessionStore` num
projeto que já tem `sqlx` precisa que o `PgPool` seja o **mesmo tipo** dos dois
lados, senão não há como reusar o pool — e o consumidor abre um segundo pool
para o mesmo banco.

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
