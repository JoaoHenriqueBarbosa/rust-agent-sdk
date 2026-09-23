//! O framework das tools: o trait `Tool`, o registry, o contexto de execução
//! e o executor com o fluxo de validação e permissão do CLI.
//!
//! Referências JS: `Tool.js` (os defaults de cada tool),
//! `services/tools/toolExecution/checkPermissionsAndCallTool.js` e
//! `services/tools/toolExecution/_shared.js` (a ordem: tool inexistente,
//! cancelamento, schema, `validateInput`, hooks, permissão, execução),
//! `services/tools/toolHooks.js` (`resolveHookPermissionDecision`),
//! `utils/permissions/permissions.js` (`hasPermissionsToUseTool`),
//! `utils/toolResultStorage.js` (resultado vazio e persistência de
//! resultado grande), `utils/toolPool.js` (a ordem das tools no request).

use std::future::Future;
use std::path::PathBuf;
use std::pin::Pin;
use std::sync::Arc;

use async_trait::async_trait;
use futures::stream::Stream;
use serde_json::Value;

use crate::api::types::{
    ApiMessage, ApiResponse, ContentBlock, CreateMessageRequest, ToolDefinition,
    ToolResultContent as ApiToolResultContent,
};
use crate::tools::file_state::FileStateCache;
use crate::tools::permission::{
    create_permission_request_message, dont_ask_reject_message, DecisionReason, PermissionAsk,
    PermissionResult, PermissionRules, RuleBehavior,
};
use crate::types::PermissionMode;

// ---------------------------------------------------------------------------
// Mensagens fixas do CLI
// ---------------------------------------------------------------------------

/// `CANCEL_MESSAGE`: o tool_result de uma tool que não chegou a rodar porque
/// o turno foi interrompido.
pub const CANCEL_MESSAGE: &str = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed.";

/// `INTERRUPT_MESSAGE_FOR_TOOL_USE`: o tool_result de uma tool abortada no
/// meio da execução.
pub const INTERRUPT_MESSAGE_FOR_TOOL_USE: &str = "[Request interrupted by user for tool use]";

// ---------------------------------------------------------------------------
// Utilitários de texto com a semântica do JS
// ---------------------------------------------------------------------------

/// O `length` de uma string no JS (unidades UTF-16).
pub fn js_len(s: &str) -> usize {
    s.encode_utf16().count()
}

/// `s.slice(start, end)` do JS, em unidades UTF-16. Um corte no meio de um
/// par substituto recua para a fronteira de char anterior.
pub fn js_slice(s: &str, start: usize, end: usize) -> String {
    let mut units = 0usize;
    let mut out = String::new();
    for ch in s.chars() {
        let w = ch.len_utf16();
        if units >= end {
            break;
        }
        if units >= start && units + w <= end {
            out.push(ch);
        }
        units += w;
    }
    out
}

/// `formatFileSize` de `utils/format.js`.
pub fn format_file_size(size_in_bytes: u64) -> String {
    fn trim(v: f64) -> String {
        let s = format!("{v:.1}");
        s.strip_suffix(".0").map(str::to_string).unwrap_or(s)
    }
    let kb = size_in_bytes as f64 / 1024.0;
    if kb < 1.0 {
        return format!("{size_in_bytes} bytes");
    }
    if kb < 1024.0 {
        return format!("{}KB", trim(kb));
    }
    let mb = kb / 1024.0;
    if mb < 1024.0 {
        return format!("{}MB", trim(mb));
    }
    format!("{}GB", trim(mb / 1024.0))
}

/// Comparação de nomes como o `String.prototype.localeCompare` do Node (ICU,
/// locale raiz), que o `assembleToolPool` usa para ordenar as tools:
/// pontuação antes de dígitos, dígitos antes de letras, letras sem caixa no
/// nível primário e minúscula antes de maiúscula no desempate.
pub fn locale_compare(a: &str, b: &str) -> std::cmp::Ordering {
    const PUNCTUATION: &str = "_-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$";
    fn primary(c: char) -> (u8, u32) {
        if c.is_whitespace() {
            return (0, c as u32);
        }
        if let Some(pos) = PUNCTUATION.find(c) {
            return (1, pos as u32);
        }
        if c.is_ascii_digit() {
            return (3, c as u32);
        }
        if c.is_alphabetic() {
            let lower = c.to_lowercase().next().unwrap_or(c);
            return (4, lower as u32);
        }
        (2, c as u32)
    }
    let pa: Vec<(u8, u32)> = a.chars().map(primary).collect();
    let pb: Vec<(u8, u32)> = b.chars().map(primary).collect();
    match pa.cmp(&pb) {
        std::cmp::Ordering::Equal => {}
        other => return other,
    }
    for (ca, cb) in a.chars().zip(b.chars()) {
        if ca != cb {
            // Minúscula primeiro, como o nível terciário do ICU.
            return match (ca.is_lowercase(), cb.is_lowercase()) {
                (true, false) => std::cmp::Ordering::Less,
                (false, true) => std::cmp::Ordering::Greater,
                _ => ca.cmp(&cb),
            };
        }
    }
    a.len().cmp(&b.len())
}

/// A ordem das chaves de primeiro nível que o `parse` de um `z.object` do
/// zod devolve: as do shape (as `properties` do schema), na ordem do shape,
/// e depois as que o shape não conhece, na ordem em que vieram. Input que
/// não é objeto, ou schema sem `properties`, fica como está.
pub fn zod_output_order(input: Value, schema: &Value) -> Value {
    let Some(properties) = schema.get("properties").and_then(Value::as_object) else {
        return input;
    };
    let mut map = match input {
        Value::Object(map) => map,
        other => return other,
    };
    let mut ordered = serde_json::Map::with_capacity(map.len());
    for key in properties.keys() {
        if let Some(value) = map.shift_remove(key) {
            ordered.insert(key.clone(), value);
        }
    }
    ordered.extend(map);
    Value::Object(ordered)
}

// ---------------------------------------------------------------------------
// Permissão: pedido e decisão do callback
// ---------------------------------------------------------------------------

/// Permission request sent to the callback when a tool needs user approval.
///
/// Carrega o que o `can_use_tool` do CLI manda (`cli/structuredIO.js`,
/// `createCanUseTool`): `tool_name`, `input`, `permission_suggestions`,
/// `blocked_path`, `decision_reason`, `tool_use_id` e `agent_id`.
#[derive(Debug, Clone, Default)]
pub struct ToolPermissionRequest {
    pub tool_name: String,
    /// Texto do pedido (a mensagem do `ask`). O JS NÃO manda `description` no
    /// `can_use_tool` de uma tool; o campo existe para diagnóstico.
    pub description: String,
    pub input: Value,
    /// The tool_use id from the model, so the decider can correlate.
    pub tool_use_id: Option<String>,
    /// `permission_suggestions`: atualizações de permissão sugeridas (a forma
    /// do `PermissionUpdateSchema` do JS), quando a checagem as produziu.
    pub permission_suggestions: Option<Value>,
    /// `blocked_path`: o caminho que motivou o pedido, quando há.
    pub blocked_path: Option<String>,
    /// `decision_reason`: o motivo serializado (`serializeDecisionReason`).
    pub decision_reason: Option<String>,
    /// `agent_id`: o subagente que pede, `None` na thread principal.
    pub agent_id: Option<String>,
}

/// Decision returned by the permission callback.
///
/// A deny carries the MESSAGE the model will read as the tool_result; that
/// message is how a gatekeeper steers the agent (e.g. "call the commit tool
/// instead"), so collapsing this to a bool would lose the steering channel.
#[derive(Debug, Clone)]
pub enum PermissionOutcome {
    Allow {
        /// Optionally rewrite the tool input before execution. `None`, `null`
        /// ou objeto vazio mantêm o input original (o JS usa o `updatedInput`
        /// só quando ele tem chaves).
        updated_input: Option<Value>,
    },
    Deny {
        message: String,
    },
    /// Recusa com `interrupt: true`: além de recusar, o JS aborta o turno
    /// (`abortController.abort()`). O executor marca
    /// `ToolExecutionResult::interrupt` e o loop encerra o turno.
    DenyAndInterrupt {
        message: String,
    },
}

/// Async permission callback: decides whether a tool call may run.
pub type PermissionCallbackFn = Arc<
    dyn Fn(ToolPermissionRequest) -> Pin<Box<dyn Future<Output = PermissionOutcome> + Send>>
        + Send
        + Sync,
>;

/// Decision returned by a PreToolUse hook, mirroring the CLI's
/// `hookSpecificOutput.permissionDecision` contract.
#[derive(Debug, Clone, Default)]
pub struct PreToolUseDecision {
    /// `Some(Allow)` skips the permission callback; `Some(Deny)` blocks the
    /// call with the message; `Some(Ask)`/`None` fall through to the normal
    /// permission flow.
    pub permission: Option<PermissionOutcome>,
    /// Rewritten tool input (the hook's `updatedInput`).
    pub updated_input: Option<Value>,
}

/// Async PreToolUse hook: runs BEFORE the permission check and can decide it.
pub type PreToolUseFn = Arc<
    dyn Fn(ToolPermissionRequest) -> Pin<Box<dyn Future<Output = PreToolUseDecision> + Send>>
        + Send
        + Sync,
>;

/// Event handed to the post-tool-use observer after a tool executed.
#[derive(Debug, Clone)]
pub struct PostToolUseEvent {
    pub tool_name: String,
    pub tool_use_id: String,
    pub tool_input: Value,
    /// The tool result content as it will be sent to the model.
    pub tool_response: Value,
    pub is_error: bool,
}

/// Async observer invoked after each tool execution. Returned text is
/// appended to the tool_result content so it reaches the model, the same
/// channel the CLI uses for PostToolUse hook `additionalContext`.
pub type PostToolUseFn = Arc<
    dyn Fn(PostToolUseEvent) -> Pin<Box<dyn Future<Output = Option<String>> + Send>> + Send + Sync,
>;

/// Chamada de modelo que as tools fazem por conta própria: o resumo do
/// WebFetch no modelo pequeno (`queryHaiku` do JS) e a busca do WebSearch
/// no modelo principal com a server tool `web_search_20250305`
/// (`queryModelWithStreaming` do JS). O engine preenche com o cliente da
/// sessão (mesma chave, mesma base URL, mesmos headers).
pub type ModelCallFn = Arc<
    dyn Fn(
            CreateMessageRequest,
        ) -> Pin<Box<dyn Future<Output = Result<ApiResponse, String>> + Send>>
        + Send
        + Sync,
>;

/// O modelo pequeno do JS quando nada é configurado (`getDefaultHaikuModel`).
pub const DEFAULT_HAIKU_MODEL: &str = "claude-haiku-4-5-20251001";

/// Context passed to tool execution.
pub struct ToolContext {
    pub working_directory: PathBuf,
    pub permission_mode: PermissionMode,
    /// Modo compartilhado e MUTÁVEL em runtime (set_permission_mode,
    /// EnterPlanMode/ExitPlanMode). Quando presente, vence o campo estático.
    pub permission_mode_shared: Option<Arc<std::sync::RwLock<PermissionMode>>>,
    /// Callback for asking user permission.
    pub permission_callback: Option<PermissionCallbackFn>,
    /// PreToolUse hook: pode decidir a permissão ANTES do callback.
    pub pre_tool_use: Option<PreToolUseFn>,
    /// Observer called after each tool execution (PostToolUse hook channel).
    pub post_tool_use: Option<PostToolUseFn>,
    /// Diretório onde resultados de tool GRANDES são persistidos por inteiro
    /// (o maybePersistLargeToolResult do CLI): o bloco vira um
    /// `<persisted-output>` com preview + caminho, e o modelo relê com Read.
    /// `None` desliga a persistência e cai no truncamento.
    pub tool_results_dir: Option<PathBuf>,
    /// Diretórios adicionais em que as file tools podem operar (add_dirs).
    pub additional_directories: Vec<PathBuf>,
    /// Env extra herdado das options, aplicado por tools que spawnam
    /// processos (Bash).
    pub extra_env: std::collections::HashMap<String, String>,
    /// Prefixos de variável que NÃO podem chegar aos processos que as tools
    /// spawnam, nem mesmo pelo ambiente herdado deste processo.
    ///
    /// `extra_env` diz o que ACRESCENTAR; este campo diz o que REMOVER, e sem
    /// ele o corte não fecha. Um `Command` herda o ambiente do pai, então a
    /// credencial que configura o MOTOR continua visível num `env` digitado
    /// pelo modelo no shell, mesmo depois de filtrada do `extra_env`. Vazio
    /// (o default) preserva o comportamento histórico.
    pub denied_env_prefixes: Vec<String>,
    /// Store de tarefas da sessão (TodoV2 + processos de background).
    pub task_store: Option<Arc<crate::tools::task_store::TaskStore>>,
    /// Lista de todos vigente (TodoWrite v1): o output devolve old/new.
    pub todo_store: Option<Arc<std::sync::Mutex<Value>>>,
    /// Chamada de modelo para as tools que consultam o modelo (WebFetch e
    /// WebSearch). `None`: essas tools respondem com erro explícito.
    pub model_call: Option<ModelCallFn>,
    /// O modelo do loop principal (o `mainLoopModel` do JS). Decide o
    /// suporte a PDF do Read, o lembrete de malware e o modelo da busca do
    /// WebSearch.
    pub main_model: Option<String>,
    /// O modelo pequeno (`getSmallFastModel`). `None` segue o JS:
    /// `ANTHROPIC_SMALL_FAST_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL`, ou o
    /// haiku default. Ver [`ToolContext::small_fast_model_name`].
    pub small_fast_model: Option<String>,
    /// Id do subagente em execução (`agentId` do JS); `None` na thread
    /// principal. Vai no `agent_id` do pedido de permissão.
    pub agent_id: Option<String>,
    /// O `readFileState` da sessão: o que o Read leu, que o Edit/Write
    /// consultam e que produz o stub de arquivo inalterado.
    pub file_state: Arc<FileStateCache>,
    /// Diretórios de skills a carregar, na ordem de precedência (o JS lê
    /// `.claude/skills` de cada fonte de settings habilitada). O engine
    /// preenche conforme `setting_sources`.
    pub skill_directories: Vec<PathBuf>,
    /// Cancelamento do turno (o `abortController` do JS). Cancelado, as tools
    /// que não começaram devolvem `CANCEL_MESSAGE` e as que estão rodando
    /// são abortadas.
    pub abort: Option<tokio_util::sync::CancellationToken>,
    /// Sessão não interativa (SDK/`-p`), o `isNonInteractiveSession` do JS.
    /// O default é `true`: o SDK nunca tem um terminal para perguntar.
    pub non_interactive: bool,
    /// As regras de permissão da sessão (o `toolPermissionContext` do
    /// `getAppState()`). O `validateInput` do Read, do Edit e do Write
    /// recusa caminho coberto por regra deny, e o Glob e o Grep escondem da
    /// listagem o que as regras deny de `Read(...)` cobrem. O
    /// [`ToolExecutor::with_permission_rules`] preenche junto com as regras
    /// do executor.
    pub permission_rules: Arc<PermissionRules>,
    /// O cwd corrente da sessão (o `getCwd()` do JS), compartilhado por
    /// todas as tools: o `cd` do Bash na thread principal muda o cwd do Read,
    /// do Glob, do Grep, do Edit e dos subagentes. `None` dentro do
    /// [`SharedCwd`] é o cwd original ([`ToolContext::working_directory`]).
    pub cwd_state: SharedCwd,
}

/// O cwd corrente da sessão, compartilhado entre as tools e os subagentes do
/// turno (o estado de `setCwd`/`getCwd` do JS). `None` é o cwd original.
pub type SharedCwd = Arc<std::sync::RwLock<Option<PathBuf>>>;

impl ToolContext {
    /// O cwd corrente (`getCwd()` do JS): o que o `cd` do Bash deixou, ou o
    /// original. É a base dos caminhos relativos das tools; o original
    /// ([`ToolContext::working_directory`], o `getOriginalCwd`) continua
    /// sendo a raiz das regras e dos diretórios de trabalho.
    pub fn cwd(&self) -> PathBuf {
        self.cwd_state
            .read()
            .ok()
            .and_then(|guard| guard.clone())
            .unwrap_or_else(|| self.working_directory.clone())
    }

    /// Troca o cwd corrente (`setCwd` do JS). Voltar ao original guarda
    /// `None`.
    pub fn set_cwd(&self, cwd: PathBuf) {
        if let Ok(mut guard) = self.cwd_state.write() {
            *guard = if cwd == self.working_directory {
                None
            } else {
                Some(cwd)
            };
        }
    }

    /// O modo vigente: o compartilhado quando existe, senão o estático.
    pub fn mode(&self) -> PermissionMode {
        self.permission_mode_shared
            .as_ref()
            .and_then(|m| m.read().ok().map(|g| *g))
            .unwrap_or(self.permission_mode)
    }

    /// Muda o modo vigente (efetivo só quando há modo compartilhado).
    pub fn set_mode(&self, mode: PermissionMode) {
        if let Some(shared) = &self.permission_mode_shared {
            if let Ok(mut guard) = shared.write() {
                *guard = mode;
            }
        }
    }

    /// O modelo pequeno efetivo, com a precedência do `getSmallFastModel`.
    pub fn small_fast_model_name(&self) -> String {
        if let Some(model) = &self.small_fast_model {
            return model.clone();
        }
        let from_env = |key: &str| {
            self.extra_env
                .get(key)
                .cloned()
                .or_else(|| std::env::var(key).ok())
                .filter(|v| !v.is_empty())
        };
        from_env("ANTHROPIC_SMALL_FAST_MODEL")
            .or_else(|| from_env("ANTHROPIC_DEFAULT_HAIKU_MODEL"))
            .unwrap_or_else(|| DEFAULT_HAIKU_MODEL.to_string())
    }

    /// Se o turno foi cancelado.
    pub fn is_aborted(&self) -> bool {
        self.abort
            .as_ref()
            .map(|t| t.is_cancelled())
            .unwrap_or(false)
    }

    /// Prepara o ambiente de um processo filho: tira o que a sessão proíbe e
    /// põe o que ela pede.
    ///
    /// A remoção varre o ambiente DESTE processo, porque é dele que o filho
    /// herda por padrão. `env_clear` fecharia de um golpe e levaria tudo junto:
    /// sem `PATH` não há binário para executar, sem `HOME` as ferramentas
    /// perdem cache e configuração, sem `LANG` a saída muda de forma.
    ///
    /// Toda tool que spawna processo passa por aqui, e é de propósito: o corte
    /// escrito em dois lugares vira o corte esquecido em um deles.
    pub fn prepare_child_env(&self, command: &mut tokio::process::Command) {
        for (key, _) in std::env::vars() {
            if self
                .denied_env_prefixes
                .iter()
                .any(|prefix| key.starts_with(prefix.as_str()))
            {
                command.env_remove(&key);
            }
        }
        command.envs(&self.extra_env);
    }
}

impl std::fmt::Debug for ToolContext {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ToolContext")
            .field("working_directory", &self.working_directory)
            .field("permission_mode", &self.mode())
            .field(
                "has_permission_callback",
                &self.permission_callback.is_some(),
            )
            .field("has_pre_tool_use", &self.pre_tool_use.is_some())
            .field("has_post_tool_use", &self.post_tool_use.is_some())
            .field("tool_results_dir", &self.tool_results_dir)
            .field("has_model_call", &self.model_call.is_some())
            .field("main_model", &self.main_model)
            .field("agent_id", &self.agent_id)
            .finish()
    }
}

impl Default for ToolContext {
    fn default() -> Self {
        Self {
            working_directory: std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")),
            permission_mode: PermissionMode::Default,
            permission_mode_shared: None,
            permission_callback: None,
            pre_tool_use: None,
            post_tool_use: None,
            tool_results_dir: None,
            additional_directories: Vec::new(),
            extra_env: std::collections::HashMap::new(),
            denied_env_prefixes: Vec::new(),
            task_store: None,
            todo_store: None,
            model_call: None,
            main_model: None,
            small_fast_model: None,
            agent_id: None,
            file_state: Arc::new(FileStateCache::default()),
            skill_directories: Vec::new(),
            abort: None,
            non_interactive: true,
            permission_rules: Arc::new(PermissionRules::default()),
            cwd_state: Arc::new(std::sync::RwLock::new(None)),
        }
    }
}

// ---------------------------------------------------------------------------
// Resultado de uma tool
// ---------------------------------------------------------------------------

/// Result of executing a tool.
#[derive(Debug, Clone, Default)]
pub struct ToolResult {
    pub content: Vec<ToolResultContent>,
    pub is_error: bool,
    /// O `content` do bloco tool_result vai como STRING (e não como array de
    /// blocos). É o que o `mapToolResultToToolResultBlockParam` de quase
    /// todas as tools do JS faz; array só quando há imagem ou quando a tool
    /// devolve blocos (MCP). Só vale com um único bloco de texto.
    pub content_as_string: bool,
    /// Mensagens de usuário que o JS anexa DEPOIS do tool_result
    /// (`result.newMessages`), como o documento PDF inteiro do Read ou a
    /// nota de imagem redimensionada. São `isMeta` no transcript do JS.
    pub new_messages: Vec<ApiMessage>,
    /// O `tool_use_result` do frame `user` (o `data` estruturado da tool no
    /// JS, ou a string `Error: ...` das recusas e falhas). O executor sempre
    /// preenche; uma tool só precisa preencher quando o JS devolve um objeto.
    pub tool_use_result: Option<Value>,
}

/// O `content` do bloco tool_result na forma do JS.
#[derive(Debug, Clone)]
pub enum ToolResultPayload {
    Text(String),
    Blocks(Vec<ApiToolResultContent>),
}

impl From<ToolResultPayload> for crate::api::types::ToolResultBlockContent {
    fn from(payload: ToolResultPayload) -> Self {
        match payload {
            ToolResultPayload::Text(text) => Self::Text(text),
            ToolResultPayload::Blocks(blocks) => Self::Blocks(blocks),
        }
    }
}

impl ToolResult {
    /// Resultado de texto que vai como string, a forma da maioria das tools.
    pub fn text(text: impl Into<String>) -> Self {
        Self {
            content: vec![ToolResultContent::Text(text.into())],
            content_as_string: true,
            ..Default::default()
        }
    }

    /// Erro com o texto como string (a forma das falhas e recusas no JS).
    pub fn error(text: impl Into<String>) -> Self {
        Self {
            content: vec![ToolResultContent::Text(text.into())],
            is_error: true,
            content_as_string: true,
            ..Default::default()
        }
    }

    pub fn image(data: String, media_type: String) -> Self {
        Self {
            content: vec![ToolResultContent::Image { data, media_type }],
            ..Default::default()
        }
    }

    /// Blocos (vão como array).
    pub fn mixed(content: Vec<ToolResultContent>) -> Self {
        Self {
            content,
            ..Default::default()
        }
    }

    /// Define o `tool_use_result` estruturado.
    pub fn with_tool_use_result(mut self, value: Value) -> Self {
        self.tool_use_result = Some(value);
        self
    }

    /// Acrescenta mensagens a anexar depois do tool_result.
    pub fn with_new_messages(mut self, messages: Vec<ApiMessage>) -> Self {
        self.new_messages.extend(messages);
        self
    }

    /// O texto concatenado dos blocos de texto.
    pub fn text_content(&self) -> String {
        self.content
            .iter()
            .filter_map(|c| match c {
                ToolResultContent::Text(t) => Some(t.as_str()),
                _ => None,
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    /// Convert to API content blocks for the tool_result message.
    pub fn to_api_content(&self) -> Vec<ApiToolResultContent> {
        self.content
            .iter()
            .map(|c| match c {
                ToolResultContent::Text(text) => ApiToolResultContent::Text { text: text.clone() },
                ToolResultContent::Image { data, media_type } => ApiToolResultContent::Image {
                    source: crate::api::types::ImageSource {
                        r#type: "base64".to_string(),
                        media_type: media_type.clone(),
                        data: data.clone(),
                    },
                },
            })
            .collect()
    }

    /// O `content` do tool_result na forma do JS: string quando a tool
    /// devolve string (e só há um texto), blocos no resto.
    pub fn to_api_payload(&self) -> ToolResultPayload {
        if self.content_as_string {
            if let [ToolResultContent::Text(text)] = self.content.as_slice() {
                return ToolResultPayload::Text(text.clone());
            }
        }
        ToolResultPayload::Blocks(self.to_api_content())
    }
}

/// Content types that a tool can return.
#[derive(Debug, Clone)]
pub enum ToolResultContent {
    Text(String),
    Image { data: String, media_type: String },
}

// ---------------------------------------------------------------------------
// O trait Tool
// ---------------------------------------------------------------------------

/// The core trait that all tools must implement.
#[async_trait]
pub trait Tool: Send + Sync {
    /// Unique name of the tool (used in API calls).
    fn name(&self) -> &str;

    /// Description of the tool for the model.
    fn description(&self) -> &str;

    /// JSON Schema for the tool's input parameters.
    fn input_schema(&self) -> Value;

    /// `isConcurrencySafe(input)` do JS: se esta chamada pode rodar em
    /// paralelo com as vizinhas seguras. Recebe o input já validado (o
    /// `parsedInput.data` do `partitionToolCalls`), porque a resposta pode
    /// depender dele: o Bash de leitura (`ls`, `git status`) é seguro, o que
    /// escreve não.
    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        false
    }

    /// `normalizeToolInput` do JS (`utils/api.js`): o input como o CLI o
    /// grava no `tool_use` da mensagem do assistente, antes de executar, de
    /// mandar ao cliente, de gravar no transcript e de voltar à API no
    /// histórico. O default é o input como veio.
    fn normalize_input(&self, input: Value, _context: &ToolContext) -> Value {
        input
    }

    /// `normalizeToolInputForAPI` do JS: o que sai do `tool_use` gravado
    /// quando o histórico volta à API (o ExitPlanMode tira o `plan` e o
    /// `planFilePath` injetados). O default é o input como está.
    fn normalize_input_for_api(&self, input: Value) -> Value {
        input
    }

    /// Whether this tool only READS state. É informativo (o `isReadOnly`
    /// do JS); NÃO dá permissão automática: quem decide é `check_permissions`.
    fn is_read_only(&self) -> bool {
        false
    }

    /// Whether this tool is a file-edit tool. Extensão do SDK para tools
    /// próprias sem checagem de caminho: em `acceptEdits`, uma tool de edição
    /// cuja checagem responde `passthrough` é permitida.
    fn is_edit_tool(&self) -> bool {
        false
    }

    /// Nome antigo de `requires_user_interaction`, mantido por
    /// compatibilidade.
    fn always_asks(&self) -> bool {
        false
    }

    /// `requiresUserInteraction` do JS: a tool só roda com a resposta do
    /// usuário (AskUserQuestion, ExitPlanMode). Um `ask` da checagem dela
    /// SEMPRE chega ao callback, mesmo em `bypassPermissions` ou com regra
    /// allow.
    fn requires_user_interaction(&self) -> bool {
        self.always_asks()
    }

    /// Tool de servidor MCP (`isMcp`/nome `mcp__*`).
    fn is_mcp(&self) -> bool {
        self.name().starts_with("mcp__")
    }

    /// O `maxResultSizeChars` da tool: acima disso o resultado é persistido
    /// em disco e o modelo recebe preview + caminho. `None` é o `Infinity`
    /// do JS (o Read nunca persiste). O limiar efetivo é o mínimo entre este
    /// valor e 50000 (`getPersistenceThreshold`).
    fn max_result_size_chars(&self) -> Option<usize> {
        Some(100_000)
    }

    /// Definição customizada enviada à API. `None` = a definição padrão
    /// (nome/descrição/schema). Server tools sobrescrevem isto para mandar o
    /// tipo versionado que faz o SERVIDOR executar a tool.
    fn api_definition(&self) -> Option<ToolDefinition> {
        None
    }

    /// O `preprocess` do zod que algumas tools aplicam antes do parse
    /// (`semanticNumber`, `semanticBoolean`). O resultado é o input que segue
    /// para a validação, a permissão e a execução.
    fn preprocess_input(&self, input: Value) -> Value {
        input
    }

    /// Refinamentos do schema (`.refine`/`.superRefine` do zod), rodados só
    /// quando o schema base passou. Cada issue volta na forma do zod
    /// (`schema_validation::custom_issue`).
    fn refine_input(&self, _input: &Value) -> Vec<Value> {
        Vec::new()
    }

    /// `validateInput` do JS: roda depois do schema e ANTES da permissão.
    /// `Err(mensagem)` vira `<tool_use_error>mensagem</tool_use_error>`.
    async fn validate_input(&self, _input: &Value, _context: &ToolContext) -> Result<(), String> {
        Ok(())
    }

    /// `checkPermissions` do JS. O default é `passthrough` (pergunta, salvo
    /// regra allow ou modo que permita), que é o que o JS faz para tools MCP;
    /// cada builtin sobrescreve com a checagem do JS (e o default do
    /// `buildTool`, `allow`, para as que não têm checagem própria).
    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::passthrough(self.name())
    }

    /// Execute the tool with the given input.
    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult;
}

// ---------------------------------------------------------------------------
// Tool registry
// ---------------------------------------------------------------------------

/// Os nomes do conjunto default do CLI 2.1.90 numa sessão SDK não
/// interativa (`getAllBaseTools` de `tools.js` com os gates desse modo):
/// sem TodoV2 (`isTodoV2Enabled` é falso fora do modo interativo), sem
/// ToolSearch (desligado com base URL de proxy) e sem as tools de time,
/// cron e LSP. O `Agent` entra pelo engine, que tem o cliente da API.
pub const DEFAULT_TOOL_NAMES: &[&str] = &[
    "Agent",
    "AskUserQuestion",
    "Bash",
    "Edit",
    "EnterPlanMode",
    "EnterWorktree",
    "ExitPlanMode",
    "ExitWorktree",
    "Glob",
    "Grep",
    "NotebookEdit",
    "Read",
    "Skill",
    "TaskOutput",
    "TaskStop",
    "TodoWrite",
    "WebFetch",
    "WebSearch",
    "Write",
];

/// Registry that holds all available tools.
pub struct ToolRegistry {
    tools: Vec<Box<dyn Tool>>,
    shared_tools: Vec<Arc<dyn Tool>>,
}

impl ToolRegistry {
    pub fn new() -> Self {
        Self {
            tools: Vec::new(),
            shared_tools: Vec::new(),
        }
    }

    /// Register a tool (owned).
    pub fn register(&mut self, tool: Box<dyn Tool>) {
        self.tools.push(tool);
    }

    /// Register a shared tool (Arc). Useful for tools that need to be
    /// cloned across multiple registries.
    pub fn register_shared(&mut self, tool: Arc<dyn Tool>) {
        self.shared_tools.push(tool);
    }

    /// Cria a builtin pelo nome do CLI (aceita também os nomes antigos
    /// `Task`, `KillShell`, `BashOutputTool`/`AgentOutputTool`). `None` para
    /// nome sem builtin nativa, incluindo `Agent`, que o engine registra.
    pub fn builtin(name: &str) -> Option<Box<dyn Tool>> {
        use crate::tools::*;
        let tool: Box<dyn Tool> = match name {
            "Bash" => Box::new(bash::BashTool::default()),
            "Read" => Box::new(file_read::FileReadTool),
            "Write" => Box::new(file_write::FileWriteTool),
            "Edit" => Box::new(file_edit::FileEditTool),
            "Glob" => Box::new(glob_tool::GlobTool),
            "Grep" => Box::new(grep::GrepTool),
            "NotebookEdit" => Box::new(notebook::NotebookEditTool),
            "WebFetch" => Box::new(web_fetch::WebFetchTool),
            "WebSearch" => Box::new(web_search::WebSearchTool::default()),
            "AskUserQuestion" => Box::new(ask_user::AskUserQuestionTool),
            "TodoWrite" => Box::new(todo::TodoWriteTool),
            "TaskCreate" => Box::new(tasks::TaskCreateTool),
            "TaskGet" => Box::new(tasks::TaskGetTool),
            "TaskList" => Box::new(tasks::TaskListTool),
            "TaskUpdate" => Box::new(tasks::TaskUpdateTool),
            "TaskStop" | "KillShell" => Box::new(tasks::TaskStopTool),
            "TaskOutput" | "BashOutputTool" | "AgentOutputTool" => Box::new(tasks::TaskOutputTool),
            "EnterPlanMode" => Box::new(plan_mode::EnterPlanModeTool),
            "ExitPlanMode" => Box::new(plan_mode::ExitPlanModeTool),
            "EnterWorktree" => Box::new(worktree::EnterWorktreeTool),
            "ExitWorktree" => Box::new(worktree::ExitWorktreeTool),
            "Skill" => Box::new(skill::SkillTool),
            _ => return None,
        };
        Some(tool)
    }

    /// Register all default built-in tools: o conjunto default do CLI nesse
    /// modo ([`DEFAULT_TOOL_NAMES`]), menos o `Agent`, que o engine registra
    /// com o cliente da API. TaskCreate/TaskGet/TaskList/TaskUpdate (TodoV2)
    /// ficam fora, como no JS não interativo, e continuam registráveis pelo
    /// nome com [`ToolRegistry::builtin`].
    pub fn register_defaults(&mut self) {
        for name in DEFAULT_TOOL_NAMES {
            if let Some(tool) = Self::builtin(name) {
                self.register(tool);
            }
        }
    }

    /// Remove do registry as tools cujo nome não passa no predicado, usado
    /// para honrar deny rules incondicionais antes do request.
    pub fn retain(&mut self, keep: impl Fn(&str) -> bool) {
        self.tools.retain(|t| keep(t.name()));
        self.shared_tools.retain(|t| keep(t.name()));
    }

    /// Iterator over all tools (owned + shared).
    fn all_tools(&self) -> impl Iterator<Item = &dyn Tool> {
        self.tools
            .iter()
            .map(|t| t.as_ref())
            .chain(self.shared_tools.iter().map(|t| t.as_ref()))
    }

    /// Find a tool by name.
    pub fn get(&self, name: &str) -> Option<&dyn Tool> {
        self.all_tools().find(|t| t.name() == name)
    }

    /// Get all tool names.
    pub fn names(&self) -> Vec<&str> {
        self.all_tools().map(|t| t.name()).collect()
    }

    /// Number of registered tools.
    pub fn len(&self) -> usize {
        self.tools.len() + self.shared_tools.len()
    }

    pub fn is_empty(&self) -> bool {
        self.tools.is_empty() && self.shared_tools.is_empty()
    }

    /// As tools na ordem do request do CLI (`assembleToolPool` /
    /// `mergeAndFilterTools`): as builtins ordenadas por nome, depois as MCP
    /// (`mcp__*`) ordenadas por nome, com nomes repetidos descartados (vale
    /// a primeira registrada).
    fn ordered_tools(&self) -> Vec<&dyn Tool> {
        let mut seen: Vec<&str> = Vec::new();
        let mut builtins: Vec<&dyn Tool> = Vec::new();
        let mut mcp: Vec<&dyn Tool> = Vec::new();
        for tool in self.all_tools() {
            if seen.contains(&tool.name()) {
                continue;
            }
            seen.push(tool.name());
            if tool.is_mcp() {
                mcp.push(tool);
            } else {
                builtins.push(tool);
            }
        }
        builtins.sort_by(|a, b| locale_compare(a.name(), b.name()));
        mcp.sort_by(|a, b| locale_compare(a.name(), b.name()));
        builtins.extend(mcp);
        builtins
    }

    /// Os nomes na ordem do request.
    pub fn ordered_names(&self) -> Vec<&str> {
        self.ordered_tools().into_iter().map(|t| t.name()).collect()
    }

    /// Generate API tool definitions for all registered tools, na ordem do
    /// CLI. O breakpoint de cache da última tool é posto no envio, pelo
    /// `api::cache_breakpoints`, junto com os demais.
    pub fn api_definitions(&self) -> Vec<ToolDefinition> {
        self.ordered_tools()
            .into_iter()
            .map(|tool| {
                tool.api_definition().unwrap_or_else(|| ToolDefinition {
                    name: tool.name().to_string(),
                    description: Some(tool.description().to_string()),
                    input_schema: tool.input_schema(),
                    ..Default::default()
                })
            })
            .collect()
    }
}

impl Default for ToolRegistry {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// Tool executor
// ---------------------------------------------------------------------------

/// Maximum result size before truncation (100KB), quando não há diretório
/// de persistência.
const MAX_RESULT_SIZE: usize = 100 * 1024;

/// `DEFAULT_MAX_RESULT_SIZE_CHARS` de `constants/toolLimits.js`.
const DEFAULT_MAX_RESULT_SIZE_CHARS: usize = 50_000;

/// `PREVIEW_SIZE_BYTES` de `utils/toolResultStorage.js`.
const PREVIEW_SIZE_BYTES: usize = 2_000;

/// A decisão final de permissão de uma chamada.
enum FinalDecision {
    Allow(Value),
    Deny { message: String, interrupt: bool },
}

/// Manages tool execution with concurrency control and permissions.
pub struct ToolExecutor {
    pub registry: ToolRegistry,
    pub context: ToolContext,
    pub permission_rules: PermissionRules,
}

impl ToolExecutor {
    /// O executor com as regras que o contexto já carrega.
    pub fn new(registry: ToolRegistry, context: ToolContext) -> Self {
        let permission_rules = (*context.permission_rules).clone();
        Self {
            registry,
            context,
            permission_rules,
        }
    }

    /// As regras de permissão da sessão, no executor e no contexto das tools
    /// (o `validateInput` e a listagem do Glob/Grep as consultam).
    pub fn with_permission_rules(mut self, rules: PermissionRules) -> Self {
        self.context.permission_rules = Arc::new(rules.clone());
        self.permission_rules = rules;
        self
    }

    /// O `tool_use` como o `normalizeContentFromAPI` do CLI o grava: input
    /// objeto de uma tool registrada passa pelo `normalizeToolInput` dela;
    /// o resto fica como veio.
    pub fn normalize_tool_input(&self, name: &str, input: Value) -> Value {
        match self.registry.get(name) {
            Some(tool) if input.is_object() => tool.normalize_input(input, &self.context),
            _ => input,
        }
    }

    /// `normalizeToolInputForAPI`: o input do `tool_use` gravado como ele
    /// volta à API no histórico.
    pub fn normalize_tool_input_for_api(&self, name: &str, input: Value) -> Value {
        match self.registry.get(name) {
            Some(tool) => tool.normalize_input_for_api(input),
            None => input,
        }
    }

    /// Máximo de tools concorrentes num grupo safe, o mesmo teto do CLI
    /// (CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY default).
    const MAX_TOOL_CONCURRENCY: usize = 10;

    /// Agrupa os tool_uses em RUNS CONTÍGUAS de mesma classificação,
    /// preservando a ordem que o modelo pediu, como o partitionToolCalls do
    /// CLI. Particionar globalmente (todas as safe primeiro) reordenava as
    /// chamadas, o que corrompe sequências de mutação transacionais
    /// (declarar → commitar).
    fn contiguous_groups(
        &self,
        tool_uses: Vec<crate::api::streaming::ToolUseBlock>,
    ) -> Vec<(bool, Vec<crate::api::streaming::ToolUseBlock>)> {
        let mut groups: Vec<(bool, Vec<crate::api::streaming::ToolUseBlock>)> = Vec::new();
        for tu in tool_uses {
            // `partitionToolCalls`: tool inexistente ou input que não passa
            // no schema (o `safeParse`) não é seguro; o resto pergunta à tool
            // com o input já preprocessado.
            let safe = self
                .registry
                .get(&tu.name)
                .map(|t| {
                    let input = t.preprocess_input(tu.input.clone());
                    let schema = if t.is_mcp() {
                        serde_json::json!({"type": "object"})
                    } else {
                        t.input_schema()
                    };
                    crate::tools::schema_validation::validate_input(&input, &schema).is_empty()
                        && t.is_concurrency_safe(&input)
                })
                .unwrap_or(false);
            match groups.last_mut() {
                Some((last_safe, run)) if *last_safe == safe => run.push(tu),
                _ => groups.push((safe, vec![tu])),
            }
        }
        groups
    }

    /// Execute multiple tool_use blocks, respecting concurrency safety.
    pub async fn execute_all(
        &self,
        tool_uses: Vec<crate::api::streaming::ToolUseBlock>,
    ) -> Vec<ToolExecutionResult> {
        use futures::stream::StreamExt as _;
        let mut results = Vec::new();
        for (safe, run) in self.contiguous_groups(tool_uses) {
            if safe {
                // Concorrentes com teto, e `buffered` (não unordered) para os
                // resultados saírem na ordem pedida.
                let mut stream =
                    futures::stream::iter(run.into_iter().map(|tu| self.execute_one(tu)))
                        .buffered(Self::MAX_TOOL_CONCURRENCY);
                while let Some(result) = stream.next().await {
                    results.push(result);
                }
            } else {
                for tu in run {
                    results.push(self.execute_one(tu).await);
                }
            }
        }
        results
    }

    /// Execute multiple tool_use blocks, yielding results incrementally as each
    /// tool completes. Concurrency-safe tools run in parallel (via join_all);
    /// sequential tools run one-by-one in order.
    pub fn execute_all_stream(
        &self,
        tool_uses: Vec<crate::api::streaming::ToolUseBlock>,
    ) -> Pin<Box<dyn Stream<Item = ToolExecutionResult> + Send + '_>> {
        Box::pin(async_stream::stream! {
            use futures::stream::StreamExt as _;
            // Runs contíguas na ordem do modelo, mesma regra do execute_all.
            for (safe, run) in self.contiguous_groups(tool_uses) {
                if safe {
                    let mut stream = futures::stream::iter(run.into_iter().map(|tu| self.execute_one(tu)))
                        .buffered(Self::MAX_TOOL_CONCURRENCY);
                    while let Some(result) = stream.next().await {
                        yield result;
                    }
                } else {
                    for tu in run {
                        yield self.execute_one(tu).await;
                    }
                }
            }
        })
    }

    fn permission_request(
        &self,
        tool_name: &str,
        input: &Value,
        tool_use_id: &str,
        ask: Option<&PermissionAsk>,
    ) -> ToolPermissionRequest {
        ToolPermissionRequest {
            tool_name: tool_name.to_string(),
            description: ask
                .map(|a| a.message.clone())
                .unwrap_or_else(|| format!("Tool {tool_name} wants to execute")),
            input: input.clone(),
            tool_use_id: Some(tool_use_id.to_string()),
            permission_suggestions: ask.and_then(|a| a.suggestions.clone()),
            blocked_path: ask.and_then(|a| a.blocked_path.clone()),
            decision_reason: ask
                .and_then(|a| a.decision_reason.as_ref())
                .and_then(DecisionReason::serialize_for_sdk),
            agent_id: self.context.agent_id.clone(),
        }
    }

    /// `hasPermissionsToUseToolInner` + o `dontAsk` do wrapper: a decisão
    /// sem o callback (Allow, Ask ou Deny).
    async fn has_permissions_to_use_tool(
        &self,
        tool: &dyn Tool,
        input: &Value,
    ) -> PermissionResult {
        let name = tool.name();
        let rules = &self.permission_rules;
        let mode = self.context.mode();

        let result = 'inner: {
            if let Some(rule) = rules.deny_rule_for_tool(name) {
                break 'inner PermissionResult::Deny {
                    message: format!("Permission to use {name} has been denied."),
                    decision_reason: Some(DecisionReason::Rule {
                        rule: rule.clone(),
                        behavior: RuleBehavior::Deny,
                    }),
                };
            }
            // Extensão do SDK: regra deny com padrão casada pela glob genérica
            // sobre o argumento principal, para qualquer tool (as de arquivo
            // aplicam, na checagem delas, a semântica de caminho do JS).
            if let Some(rule) = rules.pattern_rule_matching(name, input, RuleBehavior::Deny) {
                break 'inner PermissionResult::Deny {
                    message: format!("Permission to use {name} has been denied."),
                    decision_reason: Some(DecisionReason::Rule {
                        rule: rule.clone(),
                        behavior: RuleBehavior::Deny,
                    }),
                };
            }
            if let Some(rule) = rules.ask_rule_for_tool(name) {
                break 'inner PermissionResult::Ask(PermissionAsk {
                    message: create_permission_request_message(name, None),
                    decision_reason: Some(DecisionReason::Rule {
                        rule: rule.clone(),
                        behavior: RuleBehavior::Ask,
                    }),
                    ..Default::default()
                });
            }
            let checked = tool.check_permissions(input, &self.context, rules).await;
            if let PermissionResult::Deny { .. } = checked {
                break 'inner checked;
            }
            if let PermissionResult::Ask(ask) = &checked {
                let forced = tool.requires_user_interaction()
                    || matches!(
                        ask.decision_reason,
                        Some(DecisionReason::Rule {
                            behavior: RuleBehavior::Ask,
                            ..
                        }) | Some(DecisionReason::SafetyCheck(_))
                    );
                if forced {
                    break 'inner checked;
                }
            }
            let fallback_input = |r: &PermissionResult| match r {
                PermissionResult::Allow { updated_input, .. } => updated_input.clone(),
                PermissionResult::Ask(a) | PermissionResult::Passthrough(a) => {
                    a.updated_input.clone()
                }
                PermissionResult::Deny { .. } => None,
            };
            // `auto` não tem o classificador do JS no nativo; segue o
            // comportamento histórico do SDK de permitir como o bypass.
            if matches!(
                mode,
                PermissionMode::BypassPermissions | PermissionMode::Auto
            ) {
                break 'inner PermissionResult::Allow {
                    updated_input: fallback_input(&checked),
                    decision_reason: Some(DecisionReason::Mode(mode)),
                };
            }
            if let Some(rule) = rules.allow_rule_for_tool(name) {
                break 'inner PermissionResult::Allow {
                    updated_input: fallback_input(&checked),
                    decision_reason: Some(DecisionReason::Rule {
                        rule: rule.clone(),
                        behavior: RuleBehavior::Allow,
                    }),
                };
            }
            match checked {
                PermissionResult::Passthrough(ask) => {
                    // Extensões do SDK para tools sem checagem própria: regra
                    // allow com padrão pela glob genérica, e `acceptEdits`
                    // para tools de edição.
                    if let Some(rule) =
                        rules.pattern_rule_matching(name, input, RuleBehavior::Allow)
                    {
                        break 'inner PermissionResult::Allow {
                            updated_input: ask.updated_input,
                            decision_reason: Some(DecisionReason::Rule {
                                rule: rule.clone(),
                                behavior: RuleBehavior::Allow,
                            }),
                        };
                    }
                    if mode == PermissionMode::AcceptEdits && tool.is_edit_tool() {
                        break 'inner PermissionResult::Allow {
                            updated_input: ask.updated_input,
                            decision_reason: Some(DecisionReason::Mode(mode)),
                        };
                    }
                    let message =
                        create_permission_request_message(name, ask.decision_reason.as_ref());
                    PermissionResult::Ask(PermissionAsk { message, ..ask })
                }
                other => other,
            }
        };

        if let PermissionResult::Ask(_) = &result {
            if mode == PermissionMode::DontAsk {
                return PermissionResult::Deny {
                    message: dont_ask_reject_message(name),
                    decision_reason: Some(DecisionReason::Mode(PermissionMode::DontAsk)),
                };
            }
        }
        result
    }

    /// O `canUseTool` do SDK (`createCanUseTool`): decide sem perguntar
    /// quando dá; senão pergunta ao callback. Sem callback, o `ask` vira
    /// recusa com a própria mensagem do pedido (o que o `-p` do JS faz).
    async fn can_use_tool(
        &self,
        tool: &dyn Tool,
        input: Value,
        tool_use_id: &str,
        forced: Option<PermissionResult>,
    ) -> FinalDecision {
        let decision = match forced {
            Some(d) => d,
            None => self.has_permissions_to_use_tool(tool, &input).await,
        };
        match decision {
            PermissionResult::Allow { updated_input, .. } => {
                FinalDecision::Allow(non_empty_input(updated_input).unwrap_or(input))
            }
            PermissionResult::Deny { message, .. } => FinalDecision::Deny {
                message,
                interrupt: false,
            },
            PermissionResult::Ask(ask) | PermissionResult::Passthrough(ask) => {
                let Some(callback) = &self.context.permission_callback else {
                    return FinalDecision::Deny {
                        message: ask.message,
                        interrupt: false,
                    };
                };
                let request = self.permission_request(tool.name(), &input, tool_use_id, Some(&ask));
                match callback(request).await {
                    PermissionOutcome::Allow { updated_input } => {
                        FinalDecision::Allow(non_empty_input(updated_input).unwrap_or(input))
                    }
                    PermissionOutcome::Deny { message } => FinalDecision::Deny {
                        message,
                        interrupt: false,
                    },
                    PermissionOutcome::DenyAndInterrupt { message } => FinalDecision::Deny {
                        message,
                        interrupt: true,
                    },
                }
            }
        }
    }

    /// `checkRuleBasedPermissions`: o que ainda vale depois de um hook que
    /// permitiu. `None` = nada impede.
    async fn check_rule_based_permissions(
        &self,
        tool: &dyn Tool,
        input: &Value,
    ) -> Option<PermissionResult> {
        let name = tool.name();
        let rules = &self.permission_rules;
        if let Some(rule) = rules.deny_rule_for_tool(name) {
            return Some(PermissionResult::Deny {
                message: format!("Permission to use {name} has been denied."),
                decision_reason: Some(DecisionReason::Rule {
                    rule: rule.clone(),
                    behavior: RuleBehavior::Deny,
                }),
            });
        }
        if let Some(rule) = rules.ask_rule_for_tool(name) {
            return Some(PermissionResult::Ask(PermissionAsk {
                message: create_permission_request_message(name, None),
                decision_reason: Some(DecisionReason::Rule {
                    rule: rule.clone(),
                    behavior: RuleBehavior::Ask,
                }),
                ..Default::default()
            }));
        }
        let checked = tool.check_permissions(input, &self.context, rules).await;
        match &checked {
            PermissionResult::Deny { .. } => Some(checked),
            PermissionResult::Ask(ask)
                if matches!(
                    ask.decision_reason,
                    Some(DecisionReason::Rule {
                        behavior: RuleBehavior::Ask,
                        ..
                    }) | Some(DecisionReason::SafetyCheck(_))
                ) =>
            {
                Some(checked)
            }
            _ => None,
        }
    }

    /// Execute a single tool_use block, na ordem do
    /// `checkPermissionsAndCallTool` do JS.
    async fn execute_one(
        &self,
        tool_use: crate::api::streaming::ToolUseBlock,
    ) -> ToolExecutionResult {
        let mut tool_use = tool_use;

        // ── Tool inexistente (`runToolUse`).
        let Some(tool) = self.registry.get(&tool_use.name) else {
            let message = format!("Error: No such tool available: {}", tool_use.name);
            return ToolExecutionResult::new(
                &tool_use.id,
                tool_error(
                    format!("<tool_use_error>{message}</tool_use_error>"),
                    Value::String(message),
                ),
            );
        };

        // ── Turno já cancelado: a tool nem começa.
        if self.context.is_aborted() {
            return ToolExecutionResult::new(
                &tool_use.id,
                tool_error(CANCEL_MESSAGE, Value::String(CANCEL_MESSAGE.to_string())),
            );
        }

        // ── Schema (o `safeParse` do zod), com o preprocess da tool.
        tool_use.input = tool.preprocess_input(tool_use.input);
        // Tool MCP: o `inputSchema` do MCPTool no JS é
        // `z.object({}).passthrough()`, que só exige um objeto; o schema do
        // servidor vai para a API mas não é validado no cliente.
        let schema = if tool.is_mcp() {
            serde_json::json!({"type": "object"})
        } else {
            tool.input_schema()
        };
        let mut issues = crate::tools::schema_validation::validate_input(&tool_use.input, &schema);
        if issues.is_empty() {
            issues = tool.refine_input(&tool_use.input);
        }
        if !issues.is_empty() {
            let formatted =
                crate::tools::schema_validation::format_zod_validation_error(tool.name(), &issues);
            let raw = crate::tools::schema_validation::zod_error_message(&issues);
            return self
                .observe_post_tool_use(
                    ToolExecutionResult::new(
                        &tool_use.id,
                        tool_error(
                            format!("<tool_use_error>InputValidationError: {formatted}</tool_use_error>"),
                            Value::String(format!("InputValidationError: {raw}")),
                        ),
                    ),
                    &tool_use,
                )
                .await;
        }
        // O que segue (hooks, `can_use_tool`, execução) recebe o
        // `parsedInput.data` do zod, cujas chaves de primeiro nível saem na
        // ordem do schema (medido no CLI 2.1.90: o WebFetch pedido com
        // `{prompt, url}` chega ao `can_use_tool` como `{url, prompt}`). Tool
        // MCP é `passthrough` sem shape: a ordem do modelo fica.
        if !tool.is_mcp() {
            tool_use.input = zod_output_order(std::mem::take(&mut tool_use.input), &schema);
        }

        // ── validateInput da tool.
        if let Err(message) = tool.validate_input(&tool_use.input, &self.context).await {
            return self
                .observe_post_tool_use(
                    ToolExecutionResult::new(
                        &tool_use.id,
                        tool_error(
                            format!("<tool_use_error>{message}</tool_use_error>"),
                            Value::String(format!("Error: {message}")),
                        ),
                    ),
                    &tool_use,
                )
                .await;
        }

        // ── PreToolUse hook: roda ANTES da permissão e pode decidi-la.
        let mut hook_permission: Option<PermissionOutcome> = None;
        let mut hook_updated_input: Option<Value> = None;
        if let Some(hook) = &self.context.pre_tool_use {
            let request =
                self.permission_request(&tool_use.name, &tool_use.input, &tool_use.id, None);
            let decision = hook(request).await;
            if let Some(new_input) = decision.updated_input {
                tool_use.input = new_input;
            }
            if let Some(PermissionOutcome::Allow { updated_input }) = &decision.permission {
                hook_updated_input = non_empty_input(updated_input.clone());
            }
            hook_permission = decision.permission;
        }

        // ── Permissão (`resolveHookPermissionDecision` + `canUseTool`).
        let decision = match hook_permission {
            Some(PermissionOutcome::Deny { message }) => FinalDecision::Deny {
                message,
                interrupt: false,
            },
            Some(PermissionOutcome::DenyAndInterrupt { message }) => FinalDecision::Deny {
                message,
                interrupt: true,
            },
            Some(PermissionOutcome::Allow { .. }) => {
                let interaction_satisfied =
                    tool.requires_user_interaction() && hook_updated_input.is_some();
                let hook_input = hook_updated_input.unwrap_or_else(|| tool_use.input.clone());
                if tool.requires_user_interaction() && !interaction_satisfied {
                    self.can_use_tool(tool, hook_input, &tool_use.id, None)
                        .await
                } else {
                    match self.check_rule_based_permissions(tool, &hook_input).await {
                        None => FinalDecision::Allow(hook_input),
                        Some(PermissionResult::Deny { message, .. }) => FinalDecision::Deny {
                            message,
                            interrupt: false,
                        },
                        Some(_) => {
                            self.can_use_tool(tool, hook_input, &tool_use.id, None)
                                .await
                        }
                    }
                }
            }
            None => {
                self.can_use_tool(tool, tool_use.input.clone(), &tool_use.id, None)
                    .await
            }
        };

        let input = match decision {
            FinalDecision::Allow(input) => input,
            FinalDecision::Deny { message, interrupt } => {
                let mut execution = ToolExecutionResult::new(
                    &tool_use.id,
                    tool_error(message.clone(), Value::String(format!("Error: {message}"))),
                );
                execution.denied = true;
                execution.interrupt = interrupt;
                return self.observe_post_tool_use(execution, &tool_use).await;
            }
        };
        tool_use.input = input;

        // ── Execução, abortável pelo cancelamento do turno.
        let run = tool.execute(tool_use.input.clone(), &self.context);
        let (result, aborted) = match &self.context.abort {
            Some(token) => {
                tokio::select! {
                    result = run => (result, false),
                    _ = token.cancelled() => {
                        let text = if tool.is_mcp() {
                            format!("({} completed with no output)", tool.name())
                        } else {
                            INTERRUPT_MESSAGE_FOR_TOOL_USE.to_string()
                        };
                        (tool_error(text.clone(), Value::String(format!("Error: {text}"))), true)
                    }
                }
            }
            None => (run.await, false),
        };

        let result = if aborted {
            result
        } else {
            self.finish_result(tool, result, &tool_use).await
        };

        let mut execution = ToolExecutionResult::new(&tool_use.id, result);
        execution.interrupt = aborted;
        self.observe_post_tool_use(execution, &tool_use).await
    }

    /// O pós-processamento do resultado de uma execução que terminou:
    /// `tool_use_result` default, conteúdo vazio e persistência de resultado
    /// grande (`maybePersistLargeToolResult`).
    async fn finish_result(
        &self,
        tool: &dyn Tool,
        mut result: ToolResult,
        tool_use: &crate::api::streaming::ToolUseBlock,
    ) -> ToolResult {
        if result.tool_use_result.is_none() {
            let text = result.text_content();
            result.tool_use_result = Some(if result.is_error {
                Value::String(format!("Error: {text}"))
            } else {
                Value::String(text)
            });
        }
        if result.is_error {
            return result;
        }
        let empty = result.content.iter().all(|c| match c {
            ToolResultContent::Text(t) => t.trim().is_empty(),
            ToolResultContent::Image { .. } => false,
        });
        if empty {
            result.content = vec![ToolResultContent::Text(format!(
                "({} completed with no output)",
                tool.name()
            ))];
            result.content_as_string = true;
            return result;
        }
        let threshold = tool
            .max_result_size_chars()
            .map(|max| max.min(DEFAULT_MAX_RESULT_SIZE_CHARS));
        match (&self.context.tool_results_dir, threshold) {
            (_, None) => result,
            (Some(dir), Some(threshold)) => {
                persist_large_result(result, &tool_use.id, dir, threshold).await
            }
            (None, Some(_)) => truncate_result(result),
        }
    }

    /// Run the post-tool-use observer (when present) and append whatever
    /// context it returns to the tool result, so the text reaches the model.
    async fn observe_post_tool_use(
        &self,
        mut execution: ToolExecutionResult,
        tool_use: &crate::api::streaming::ToolUseBlock,
    ) -> ToolExecutionResult {
        if let Some(observer) = &self.context.post_tool_use {
            let response =
                serde_json::to_value(execution.result.to_api_content()).unwrap_or(Value::Null);
            let event = PostToolUseEvent {
                tool_name: tool_use.name.clone(),
                tool_use_id: tool_use.id.clone(),
                tool_input: tool_use.input.clone(),
                tool_response: response,
                is_error: execution.result.is_error,
            };
            if let Some(context_text) = observer(event).await {
                execution
                    .result
                    .content
                    .push(ToolResultContent::Text(context_text));
                execution.result.content_as_string = false;
            }
        }
        execution
    }

    /// Build a user message containing all tool results. As `new_messages`
    /// de cada resultado NÃO entram aqui: o loop as anexa depois, como o JS.
    pub fn build_tool_results_message(&self, results: Vec<ToolExecutionResult>) -> ApiMessage {
        let content: Vec<ContentBlock> = results
            .into_iter()
            .map(|r| ContentBlock::ToolResult {
                tool_use_id: r.tool_use_id,
                content: Some(r.result.to_api_payload().into()),
                is_error: if r.result.is_error { Some(true) } else { None },
                cache_control: None,
            })
            .collect();

        ApiMessage::user(content)
    }
}

/// `updatedInput` vazio/nulo não substitui o input (o JS usa o do callback
/// só quando ele tem chaves).
fn non_empty_input(updated: Option<Value>) -> Option<Value> {
    match updated {
        Some(Value::Object(map)) if map.is_empty() => None,
        Some(Value::Null) | None => None,
        Some(other) => Some(other),
    }
}

/// Erro com `tool_use_result` explícito.
fn tool_error(text: impl Into<String>, tool_use_result: Value) -> ToolResult {
    ToolResult::error(text).with_tool_use_result(tool_use_result)
}

/// Result of executing a single tool.
#[derive(Debug, Clone)]
pub struct ToolExecutionResult {
    pub tool_use_id: String,
    pub result: ToolResult,
    /// True when the result is a permission DENIAL (as opposed to a tool
    /// failure): the loop records these in `permission_denials` structurally
    /// instead of sniffing error text.
    pub denied: bool,
    /// O turno deve ser interrompido: recusa com `interrupt: true` do
    /// callback, ou tool abortada pelo cancelamento. O loop encerra o turno
    /// como o `abortController.abort()` do JS.
    pub interrupt: bool,
}

impl ToolExecutionResult {
    fn new(tool_use_id: &str, result: ToolResult) -> Self {
        Self {
            tool_use_id: tool_use_id.to_string(),
            result,
            denied: false,
            interrupt: false,
        }
    }
}

/// `generatePreview`: corta no último `\n` antes do limite quando ele passa
/// da metade, senão no limite (em unidades UTF-16, como o JS).
fn generate_preview(content: &str, max: usize) -> (String, bool) {
    if js_len(content) <= max {
        return (content.to_string(), false);
    }
    let head = js_slice(content, 0, max);
    let cut = match head.rfind('\n') {
        Some(idx) if js_len(&head[..idx]) as f64 > max as f64 * 0.5 => js_len(&head[..idx]),
        _ => max,
    };
    (js_slice(content, 0, cut), true)
}

/// Persiste em disco um resultado acima do limiar e o substitui pelo
/// `<persisted-output>` do JS (`buildLargeToolResultMessage`). Texto único
/// vai para `<id>.txt`; vários blocos de texto, para `<id>.json`. Resultado
/// com imagem nunca é persistido. Falha de I/O cai no truncamento.
async fn persist_large_result(
    result: ToolResult,
    tool_use_id: &str,
    dir: &std::path::Path,
    threshold: usize,
) -> ToolResult {
    if result
        .content
        .iter()
        .any(|c| matches!(c, ToolResultContent::Image { .. }))
    {
        return result;
    }
    let is_string = result.content_as_string && result.content.len() == 1;
    let size: usize = result
        .content
        .iter()
        .map(|c| match c {
            ToolResultContent::Text(t) => js_len(t),
            ToolResultContent::Image { .. } => 0,
        })
        .sum();
    if size <= threshold {
        return result;
    }
    let (content_str, ext) = if is_string {
        (result.text_content(), "txt")
    } else {
        let blocks: Vec<Value> = result
            .content
            .iter()
            .filter_map(|c| match c {
                ToolResultContent::Text(t) => Some(serde_json::json!({"type": "text", "text": t})),
                ToolResultContent::Image { .. } => None,
            })
            .collect();
        (
            serde_json::to_string_pretty(&Value::Array(blocks)).unwrap_or_default(),
            "json",
        )
    };
    let path = dir.join(format!("{}.{ext}", sanitize_tool_use_id(tool_use_id)));
    let written = async {
        tokio::fs::create_dir_all(dir).await?;
        match tokio::fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&path)
            .await
        {
            Ok(mut file) => {
                use tokio::io::AsyncWriteExt as _;
                file.write_all(content_str.as_bytes()).await
            }
            Err(e) if e.kind() == std::io::ErrorKind::AlreadyExists => Ok(()),
            Err(e) => Err(e),
        }
    }
    .await;
    if written.is_err() {
        return truncate_result(result);
    }
    let (preview, has_more) = generate_preview(&content_str, PREVIEW_SIZE_BYTES);
    let message = format!(
        "<persisted-output>\nOutput too large ({}). Full output saved to: {}\n\nPreview (first {}):\n{preview}{}</persisted-output>",
        format_file_size(js_len(&content_str) as u64),
        path.display(),
        format_file_size(PREVIEW_SIZE_BYTES as u64),
        if has_more { "\n...\n" } else { "\n" },
    );
    ToolResult {
        content: vec![ToolResultContent::Text(message)],
        content_as_string: true,
        ..result
    }
}

/// O id vira nome de arquivo: qualquer coisa fora de [A-Za-z0-9_-] cai fora.
fn sanitize_tool_use_id(id: &str) -> String {
    id.chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '_' || *c == '-')
        .collect()
}

/// Truncate text results that exceed MAX_RESULT_SIZE.
fn truncate_result(mut result: ToolResult) -> ToolResult {
    for content in &mut result.content {
        if let ToolResultContent::Text(text) = content {
            if text.len() > MAX_RESULT_SIZE {
                let half = MAX_RESULT_SIZE / 2;
                // Cortes em fronteira de char: fatiar por byte panica em
                // texto multibyte (acentos).
                let mut head_end = half.min(text.len());
                while head_end > 0 && !text.is_char_boundary(head_end) {
                    head_end -= 1;
                }
                let mut tail_start = text.len() - half;
                while tail_start < text.len() && !text.is_char_boundary(tail_start) {
                    tail_start += 1;
                }
                let first = &text[..head_end];
                let last = &text[tail_start..];
                *text = format!(
                    "{first}\n\n... [truncated {} bytes] ...\n\n{last}",
                    text.len() - MAX_RESULT_SIZE
                );
            }
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::streaming::ToolUseBlock;

    struct MockTool {
        name: &'static str,
        concurrent: bool,
    }

    #[async_trait]
    impl Tool for MockTool {
        fn name(&self) -> &str {
            self.name
        }
        fn description(&self) -> &str {
            "A mock tool"
        }
        fn input_schema(&self) -> Value {
            serde_json::json!({
                "type": "object",
                "properties": {},
            })
        }
        fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
            self.concurrent
        }
        async fn execute(&self, _input: Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text(format!("executed {}", self.name))
        }
    }

    struct BigOutputTool;

    #[async_trait]
    impl Tool for BigOutputTool {
        fn name(&self) -> &str {
            "Big"
        }
        fn description(&self) -> &str {
            "Devolve um resultado enorme"
        }
        fn input_schema(&self) -> Value {
            serde_json::json!({"type": "object", "properties": {}})
        }
        async fn execute(&self, _input: Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text(format!("início-{}-fim", "é".repeat(80_000)))
        }
    }

    fn tool_use(id: &str, name: &str, input: Value) -> ToolUseBlock {
        ToolUseBlock {
            id: id.to_string(),
            name: name.to_string(),
            input,
        }
    }

    fn text_of(result: &ToolExecutionResult) -> String {
        result.result.text_content()
    }

    #[tokio::test]
    async fn large_result_is_persisted_with_preview_and_path() {
        let dir = tempfile::tempdir().unwrap();
        let mut registry = ToolRegistry::new();
        registry.register(Box::new(BigOutputTool));
        let ctx = ToolContext {
            permission_mode: PermissionMode::BypassPermissions,
            tool_results_dir: Some(dir.path().to_path_buf()),
            ..Default::default()
        };
        let executor = ToolExecutor::new(registry, ctx);
        let results = executor
            .execute_all(vec![tool_use("toolu_big1", "Big", serde_json::json!({}))])
            .await;

        let text = text_of(&results[0]);
        // Contrato: o bloco vira um persisted-output com preview e o caminho
        // do arquivo COMPLETO: o miolo não se perde, o modelo relê com Read.
        assert!(
            text.starts_with("<persisted-output>\nOutput too large ("),
            "{text}"
        );
        assert!(text.contains("Preview (first 2KB):\n"), "{text}");
        let file = dir.path().join("toolu_big1.txt");
        assert!(text.contains(&file.display().to_string()));
        let full = std::fs::read_to_string(&file).unwrap();
        assert!(full.starts_with("início-"));
        assert!(full.ends_with("-fim"));
        assert!(text.ends_with("\n...\n</persisted-output>"), "{text}");
        assert!(text.len() < 10_000);
    }

    #[tokio::test]
    async fn without_a_dir_the_large_result_is_truncated() {
        let mut registry = ToolRegistry::new();
        registry.register(Box::new(BigOutputTool));
        let ctx = ToolContext {
            permission_mode: PermissionMode::BypassPermissions,
            ..Default::default()
        };
        let executor = ToolExecutor::new(registry, ctx);
        let results = executor
            .execute_all(vec![tool_use("toolu_big2", "Big", serde_json::json!({}))])
            .await;
        // Contrato: 80k de 'é' (2 bytes) truncado sem pânico de UTF-8.
        assert!(text_of(&results[0]).contains("truncated"));
    }

    #[test]
    fn test_registry() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "test_tool",
            concurrent: false,
        }));

        assert_eq!(reg.len(), 1);
        assert!(reg.get("test_tool").is_some());
        assert!(reg.get("nonexistent").is_none());
        assert_eq!(reg.names(), vec!["test_tool"]);
    }

    #[test]
    fn api_definitions_come_sorted_with_mcp_last() {
        let mut reg = ToolRegistry::new();
        for name in [
            "mcp__omnia__zeta",
            "Write",
            "mcp__omnia__alpha",
            "Agent",
            "read_x",
        ] {
            reg.register(Box::new(MockTool {
                name,
                concurrent: false,
            }));
        }
        let names: Vec<String> = reg.api_definitions().into_iter().map(|d| d.name).collect();
        assert_eq!(
            names,
            vec![
                "Agent",
                "read_x",
                "Write",
                "mcp__omnia__alpha",
                "mcp__omnia__zeta"
            ]
        );
    }

    #[test]
    fn locale_compare_matches_icu_for_tool_names() {
        use std::cmp::Ordering;
        assert_eq!(locale_compare("TaskOutput", "TaskStop"), Ordering::Less);
        assert_eq!(locale_compare("TodoWrite", "WebFetch"), Ordering::Less);
        assert_eq!(locale_compare("a_b", "ab"), Ordering::Less);
        assert_eq!(locale_compare("abc", "ABC"), Ordering::Less);
        assert_eq!(locale_compare("Skill", "read"), Ordering::Greater);
    }

    #[test]
    fn register_defaults_is_the_cli_default_set_without_todo_v2() {
        let mut reg = ToolRegistry::new();
        reg.register_defaults();
        let names = reg.ordered_names();
        assert_eq!(
            names,
            vec![
                "AskUserQuestion",
                "Bash",
                "Edit",
                "EnterPlanMode",
                "EnterWorktree",
                "ExitPlanMode",
                "ExitWorktree",
                "Glob",
                "Grep",
                "NotebookEdit",
                "Read",
                "Skill",
                "TaskOutput",
                "TaskStop",
                "TodoWrite",
                "WebFetch",
                "WebSearch",
                "Write",
            ]
        );
        assert!(ToolRegistry::builtin("TaskCreate").is_some());
    }

    #[test]
    fn test_tool_result_helpers() {
        let r = ToolResult::text("ok");
        assert!(!r.is_error);
        assert_eq!(r.content.len(), 1);
        assert!(matches!(r.to_api_payload(), ToolResultPayload::Text(ref t) if t == "ok"));

        let r = ToolResult::error("fail");
        assert!(r.is_error);
        let r = ToolResult::mixed(vec![ToolResultContent::Text("a".into())]);
        assert!(matches!(r.to_api_payload(), ToolResultPayload::Blocks(_)));
    }

    #[test]
    fn format_file_size_follows_the_js() {
        assert_eq!(format_file_size(512), "512 bytes");
        assert_eq!(format_file_size(2000), "2KB");
        assert_eq!(format_file_size(262_144), "256KB");
        assert_eq!(format_file_size(3 * 1024 * 1024 + 100_000), "3.1MB");
    }

    #[test]
    fn test_truncate_result() {
        let short = ToolResult::text("short text");
        let truncated = truncate_result(short.clone());
        assert_eq!(truncated.text_content(), "short text");

        let long_text = "x".repeat(200 * 1024);
        let long = ToolResult::text(long_text);
        let truncated = truncate_result(long);
        let t = truncated.text_content();
        assert!(t.len() < 200 * 1024);
        assert!(t.contains("[truncated"));
    }

    #[tokio::test]
    async fn test_executor_concurrent_vs_sequential() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "safe1",
            concurrent: true,
        }));
        reg.register(Box::new(MockTool {
            name: "safe2",
            concurrent: true,
        }));
        reg.register(Box::new(MockTool {
            name: "unsafe1",
            concurrent: false,
        }));

        let ctx = ToolContext {
            permission_mode: PermissionMode::BypassPermissions,
            ..Default::default()
        };

        let executor = ToolExecutor::new(reg, ctx);

        let tool_uses = vec![
            tool_use("t1", "safe1", serde_json::json!({})),
            tool_use("t2", "safe2", serde_json::json!({})),
            tool_use("t3", "unsafe1", serde_json::json!({})),
        ];

        let results = executor.execute_all(tool_uses).await;
        assert_eq!(results.len(), 3);
        assert!(!results[0].result.is_error);
        assert!(!results[1].result.is_error);
        assert!(!results[2].result.is_error);
    }

    #[tokio::test]
    async fn unknown_tool_uses_the_cli_error_text() {
        let reg = ToolRegistry::new();
        let ctx = ToolContext {
            permission_mode: PermissionMode::BypassPermissions,
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use("t1", "Nope", serde_json::json!({}))])
            .await;
        assert!(results[0].result.is_error);
        assert_eq!(
            text_of(&results[0]),
            "<tool_use_error>Error: No such tool available: Nope</tool_use_error>"
        );
        assert_eq!(
            results[0].result.tool_use_result,
            Some(Value::String("Error: No such tool available: Nope".into()))
        );
    }

    struct StrictTool;

    #[async_trait]
    impl Tool for StrictTool {
        fn name(&self) -> &str {
            "strict"
        }
        fn description(&self) -> &str {
            "A tool with required params"
        }
        fn input_schema(&self) -> Value {
            serde_json::json!({
                "type": "object",
                "properties": { "path": { "type": "string" } },
                "required": ["path"],
                "additionalProperties": false
            })
        }
        async fn validate_input(&self, input: &Value, _ctx: &ToolContext) -> Result<(), String> {
            if input["path"] == "proibido" {
                return Err("Caminho proibido.".to_string());
            }
            Ok(())
        }
        async fn check_permissions(
            &self,
            _input: &Value,
            _ctx: &ToolContext,
            _rules: &PermissionRules,
        ) -> PermissionResult {
            PermissionResult::allow()
        }
        async fn execute(&self, _input: Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text("executou")
        }
    }

    #[tokio::test]
    async fn schema_error_comes_before_permission_and_uses_the_zod_format() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictTool));
        // Sem callback e em default: a permissão nem é consultada.
        let executor = ToolExecutor::new(reg, ToolContext::default());
        let results = executor
            .execute_all(vec![tool_use("t1", "strict", serde_json::json!({}))])
            .await;
        assert!(!results[0].denied);
        assert_eq!(
            text_of(&results[0]),
            "<tool_use_error>InputValidationError: strict failed due to the following issue:\nThe required parameter `path` is missing</tool_use_error>"
        );
        let raw = results[0].result.tool_use_result.clone().unwrap();
        assert!(raw
            .as_str()
            .unwrap()
            .starts_with("InputValidationError: [\n"));
    }

    #[tokio::test]
    async fn validate_input_error_is_wrapped_in_tool_use_error() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictTool));
        let executor = ToolExecutor::new(reg, ToolContext::default());
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "strict",
                serde_json::json!({"path": "proibido"}),
            )])
            .await;
        assert_eq!(
            text_of(&results[0]),
            "<tool_use_error>Caminho proibido.</tool_use_error>"
        );
        assert_eq!(
            results[0].result.tool_use_result,
            Some(Value::String("Error: Caminho proibido.".into()))
        );
    }

    #[tokio::test]
    async fn tool_allow_needs_no_callback() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictTool));
        let executor = ToolExecutor::new(reg, ToolContext::default());
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "strict",
                serde_json::json!({"path": "a"}),
            )])
            .await;
        assert_eq!(text_of(&results[0]), "executou");
        assert_eq!(
            results[0].result.tool_use_result,
            Some(Value::String("executou".into()))
        );
    }

    #[tokio::test]
    async fn deny_rule_uses_the_cli_message() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictTool));
        let executor = ToolExecutor::new(reg, ToolContext::default())
            .with_permission_rules(PermissionRules::from_lists(&[], &["strict".to_string()]));
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "strict",
                serde_json::json!({"path": "a"}),
            )])
            .await;
        assert!(results[0].denied);
        assert_eq!(
            text_of(&results[0]),
            "Permission to use strict has been denied."
        );
        assert_eq!(
            results[0].result.tool_use_result,
            Some(Value::String(
                "Error: Permission to use strict has been denied.".into()
            ))
        );
    }

    fn recording_callback(
        outcome: PermissionOutcome,
    ) -> (
        PermissionCallbackFn,
        Arc<std::sync::Mutex<Vec<ToolPermissionRequest>>>,
    ) {
        let seen = Arc::new(std::sync::Mutex::new(Vec::new()));
        let seen_cb = Arc::clone(&seen);
        let callback: PermissionCallbackFn = Arc::new(move |req| {
            seen_cb.lock().unwrap().push(req);
            let outcome = outcome.clone();
            Box::pin(async move { outcome })
        });
        (callback, seen)
    }

    #[tokio::test]
    async fn passthrough_asks_the_callback_and_empty_updated_input_keeps_the_original() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "mcp__srv__echo",
            concurrent: false,
        }));
        let (callback, seen) = recording_callback(PermissionOutcome::Allow {
            updated_input: Some(serde_json::json!({})),
        });
        let ctx = ToolContext {
            permission_callback: Some(callback),
            agent_id: Some("agente-1".into()),
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use(
                "t9",
                "mcp__srv__echo",
                serde_json::json!({}),
            )])
            .await;
        assert_eq!(text_of(&results[0]), "executed mcp__srv__echo");
        let requests = seen.lock().unwrap();
        assert_eq!(requests.len(), 1);
        assert_eq!(requests[0].tool_use_id.as_deref(), Some("t9"));
        assert_eq!(requests[0].agent_id.as_deref(), Some("agente-1"));
        assert_eq!(
            requests[0].description,
            "Claude requested permissions to use mcp__srv__echo, but you haven't granted it yet."
        );
    }

    #[tokio::test]
    async fn mcp_server_wildcard_allow_rule_skips_the_callback() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "mcp__omnia__buscar",
            concurrent: false,
        }));
        let executor = ToolExecutor::new(reg, ToolContext::default()).with_permission_rules(
            PermissionRules::from_lists(&["mcp__omnia__*".to_string()], &[]),
        );
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "mcp__omnia__buscar",
                serde_json::json!({}),
            )])
            .await;
        assert_eq!(text_of(&results[0]), "executed mcp__omnia__buscar");
    }

    struct StrictMcpTool;

    #[async_trait]
    impl Tool for StrictMcpTool {
        fn name(&self) -> &str {
            "mcp__srv__strict"
        }
        fn description(&self) -> &str {
            "schema estrito do servidor"
        }
        fn input_schema(&self) -> Value {
            serde_json::json!({
                "type": "object",
                "properties": {"a": {"type": "string"}},
                "required": ["a"],
                "additionalProperties": false
            })
        }
        async fn execute(&self, input: Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text(input.to_string())
        }
    }

    #[tokio::test]
    async fn mcp_tools_are_not_validated_against_the_server_schema() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictMcpTool));
        let ctx = ToolContext {
            permission_mode: PermissionMode::BypassPermissions,
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "mcp__srv__strict",
                serde_json::json!({"extra": 1}),
            )])
            .await;
        // O JS valida MCP com `z.object({}).passthrough()`: quem recusa, se
        // for o caso, é o servidor.
        assert!(!results[0].result.is_error);
        assert_eq!(text_of(&results[0]), "{\"extra\":1}");
    }

    #[tokio::test]
    async fn no_callback_denies_with_the_ask_message() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "mcp__srv__echo",
            concurrent: false,
        }));
        let executor = ToolExecutor::new(reg, ToolContext::default());
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "mcp__srv__echo",
                serde_json::json!({}),
            )])
            .await;
        assert!(results[0].denied);
        assert_eq!(
            text_of(&results[0]),
            "Claude requested permissions to use mcp__srv__echo, but you haven't granted it yet."
        );
    }

    #[tokio::test]
    async fn dont_ask_mode_denies_with_the_cli_message() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "mcp__srv__echo",
            concurrent: false,
        }));
        let ctx = ToolContext {
            permission_mode: PermissionMode::DontAsk,
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "mcp__srv__echo",
                serde_json::json!({}),
            )])
            .await;
        assert!(text_of(&results[0]).starts_with(
            "Permission to use mcp__srv__echo has been denied because Claude Code is running in don't ask mode. IMPORTANT:"
        ));
    }

    #[tokio::test]
    async fn deny_with_interrupt_marks_the_execution() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool {
            name: "mcp__srv__echo",
            concurrent: false,
        }));
        let (callback, _) = recording_callback(PermissionOutcome::DenyAndInterrupt {
            message: "pare".into(),
        });
        let ctx = ToolContext {
            permission_callback: Some(callback),
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "mcp__srv__echo",
                serde_json::json!({}),
            )])
            .await;
        assert!(results[0].denied);
        assert!(results[0].interrupt);
        assert_eq!(text_of(&results[0]), "pare");
    }

    #[tokio::test]
    async fn cancelled_turn_returns_the_cancel_message() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictTool));
        let token = tokio_util::sync::CancellationToken::new();
        token.cancel();
        let ctx = ToolContext {
            abort: Some(token),
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use(
                "t1",
                "strict",
                serde_json::json!({"path": "a"}),
            )])
            .await;
        assert_eq!(text_of(&results[0]), CANCEL_MESSAGE);
    }

    struct EmptyTool;

    #[async_trait]
    impl Tool for EmptyTool {
        fn name(&self) -> &str {
            "Empty"
        }
        fn description(&self) -> &str {
            "nada"
        }
        fn input_schema(&self) -> Value {
            serde_json::json!({"type": "object", "properties": {}})
        }
        async fn execute(&self, _input: Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text("  ")
        }
    }

    #[tokio::test]
    async fn empty_result_becomes_completed_with_no_output() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(EmptyTool));
        let ctx = ToolContext {
            permission_mode: PermissionMode::BypassPermissions,
            ..Default::default()
        };
        let executor = ToolExecutor::new(reg, ctx);
        let results = executor
            .execute_all(vec![tool_use("t1", "Empty", serde_json::json!({}))])
            .await;
        assert_eq!(text_of(&results[0]), "(Empty completed with no output)");
    }
}
