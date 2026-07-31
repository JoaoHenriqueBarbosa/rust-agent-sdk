use crate::errors::{ClaudeSDKError, Result};
use crate::internal::message_parser::parse_message;
use crate::internal::query::Query;
use crate::internal::session_store::SharedSessionStore;
use crate::internal::transport::Transport;
use crate::types::{
    ClaudeAgentOptions, ContextUsageResponse, McpServersConfig, McpStatusResponse, Message,
    PermissionMode, SystemPrompt, SystemPromptConfig,
};

/// Bidirectional client for sustained conversations with Claude Code.
///
/// Provides full control over the conversation flow with support
/// for streaming, interrupts, and dynamic message sending.
pub struct ClaudeSDKClient {
    pub _transport: Option<Box<dyn Transport>>,
    pub _options: ClaudeAgentOptions,
    _query: Option<Query>,
    _custom_transport: Option<Box<dyn Transport>>,
    _materialized: Option<crate::internal::session_resume::MaterializedResume>,
    /// Handle compartilhado do `session_store` do usuário (ver `SharedSessionStore`).
    _session_store: Option<SharedSessionStore>,
}

impl ClaudeSDKClient {
    pub fn new(options: ClaudeAgentOptions) -> Self {
        Self {
            _transport: None,
            _options: options,
            _query: None,
            _custom_transport: None,
            _materialized: None,
            _session_store: None,
        }
    }

    pub fn with_transport(mut self, transport: Box<dyn Transport>) -> Self {
        self._custom_transport = Some(transport);
        self
    }

    /// Connect to Claude without a prompt (interactive mode).
    /// Equivalent to Python's `__aenter__` / `connect()` with no args.
    pub async fn connect(&mut self) -> Result<()> {
        self.connect_with_prompt(None).await
    }

    /// Connect to Claude with an optional prompt (#5).
    pub async fn connect_with_prompt(&mut self, prompt: Option<&str>) -> Result<()> {
        use crate::internal::session_resume::{
            apply_materialized_options, materialize_resume_session,
        };
        use crate::internal::session_store_validation::validate_session_store_options;

        // Fail fast on invalid session_store option combinations
        validate_session_store_options(&self._options)?;

        // Converte o store do usuário em handle compartilhável uma única vez.
        // A partir daqui `self._options.session_store` guarda um
        // `SharedSessionStore` equivalente, para que reconectar continue
        // funcionando e o transporte ainda receba `--session-mirror`.
        if self._session_store.is_none() {
            if let Some(store) = self._options.session_store.take() {
                let shared = SharedSessionStore::from_boxed(store);
                self._options.session_store = Some(Box::new(shared.clone()));
                self._session_store = Some(shared);
            }
        }

        // Validate and configure permission settings
        if self._options.can_use_tool.is_some() {
            if prompt.is_some() {
                return Err(ClaudeSDKError::sdk(
                    "can_use_tool callback requires streaming mode. \
                     Please provide prompt as an AsyncIterable instead of a string.",
                ));
            }
            if self._options.permission_prompt_tool_name.is_some() {
                return Err(ClaudeSDKError::sdk(
                    "can_use_tool callback cannot be used with permission_prompt_tool_name. \
                     Please use one or the other.",
                ));
            }
            self._options.permission_prompt_tool_name = Some("stdio".to_string());
        }

        // resume/continue + session_store materialization
        self._materialized = if self._custom_transport.is_none() {
            materialize_resume_session(&self._options).await?
        } else {
            None
        };

        let mut materialized_options = self._options.clone_without_callbacks();
        materialized_options.can_use_tool = self._options.can_use_tool.clone();
        materialized_options.stderr = self._options.stderr.clone();
        // Sem isto o transporte não passa `--session-mirror` e o CLI nunca emite
        // os frames `transcript_mirror` que o batcher espera.
        materialized_options.session_store = self
            ._session_store
            .as_ref()
            .map(|s| Box::new(s.clone()) as Box<dyn crate::types::SessionStore>);

        if let Some(ref m) = self._materialized {
            materialized_options = apply_materialized_options(materialized_options, m);
        }

        let result = self.connect_inner(prompt, materialized_options).await;
        if result.is_err() {
            // If connect fails after subprocess spawn, clean up before propagating
            let _ = self.disconnect().await;
        }
        result
    }

    async fn connect_inner(
        &mut self,
        prompt: Option<&str>,
        materialized_options: ClaudeAgentOptions,
    ) -> Result<()> {
        // Use provided transport or create subprocess transport
        let mut transport: Box<dyn Transport> = if let Some(t) = self._custom_transport.take() {
            t
        } else {
            Box::new(crate::internal::transport::SubprocessCLITransport::new(
                "",
                materialized_options,
            ))
        };
        transport.connect().await?;
        self._transport = Some(transport);

        // Create Query
        let initialize_timeout_ms: f64 = std::env::var("CLAUDE_CODE_STREAM_CLOSE_TIMEOUT")
            .ok()
            .and_then(|v| v.parse::<f64>().ok())
            .unwrap_or(60000.0);
        let initialize_timeout = (initialize_timeout_ms / 1000.0).max(60.0);

        // Extract exclude_dynamic_sections from preset system prompt
        let exclude_dynamic_sections = match &self._options.system_prompt {
            Some(SystemPromptConfig::Structured(SystemPrompt::Preset {
                exclude_dynamic_sections,
                ..
            })) => *exclude_dynamic_sections,
            _ => None,
        };

        // Convert agents to JSON for initialize request
        let agents_json = self._options.agents.as_ref().map(|agents| {
            let map: serde_json::Map<String, serde_json::Value> = agents
                .iter()
                .map(|(name, def)| (name.clone(), serde_json::to_value(def).unwrap_or_default()))
                .collect();
            serde_json::Value::Object(map)
        });

        // We need to give transport to Query — take it temporarily
        let transport = self._transport.take().unwrap();
        let mut query = Query::new(transport, true, initialize_timeout);

        // Registry de MCP in-process da SESSÃO: os handles que as próprias
        // opções carregam.
        //
        // Não há resolução por nome contra nenhum depósito do processo. É isso
        // que isola duas sessões concorrentes com servidores homônimos (cada
        // `Query` tem o seu mapa) e é isso que faz o servidor morrer com a
        // sessão (o `Arc` não fica pendurado em lugar nenhum estático).
        query.set_sdk_mcp_servers(self._options.sdk_mcp_servers.clone());

        // Set can_use_tool callback if provided
        if let Some(ref callback) = self._options.can_use_tool {
            query.set_can_use_tool(callback.clone());
        }

        // Configure hooks on the query.
        //
        // Os matchers vão inteiros — com as closures. Antes, esta fronteira
        // convertia cada hook para `Value::Null` e só a FORMA chegava à
        // `Query`: o CLI recebia os `hookCallbackIds` no initialize e, quando
        // chamava um deles, ninguém atendia. Hook declarado nunca rodava.
        if let Some(ref hooks) = self._options.hooks {
            let mut internal_hooks = std::collections::HashMap::new();
            for (event, matchers) in hooks {
                let internal_matchers: Vec<crate::types::HookMatcher> = matchers
                    .iter()
                    .map(|matcher| crate::types::HookMatcher {
                        matcher: matcher.matcher.clone(),
                        hooks: matcher.hooks.clone(),
                        timeout: matcher.timeout,
                    })
                    .collect();
                internal_hooks.insert(format!("{:?}", event), internal_matchers);
            }
            query.set_hooks(internal_hooks);
        }

        // Set agents and exclude_dynamic_sections for initialize
        if let Some(agents) = agents_json {
            query.set_agents(agents);
        }
        if let Some(eds) = exclude_dynamic_sections {
            query.set_exclude_dynamic_sections(eds);
        }
        if let Some(ref skills) = self._options.skills {
            query.set_skills(skills.clone());
        }

        // Espelhamento de transcript para o SessionStore.
        //
        // O CLI só emite frames `transcript_mirror` quando recebe
        // `--session-mirror`, e esse flag é derivado de `options.session_store`
        // no transporte. Como `clone_without_callbacks` não consegue clonar o
        // Box do store, o store é compartilhado via `SharedSessionStore`: uma
        // cópia foi para as options do transporte (em `connect_with_prompt`) e
        // outra vai para o batcher aqui.
        if let Some(ref shared) = self._session_store {
            let sender = query.message_sender();
            let on_error: crate::internal::transcript_mirror::OnErrorCallback =
                Box::new(move |key, error| {
                    let sender = sender.clone();
                    Box::pin(async move {
                        // Erro de espelho não derruba a sessão: vira uma
                        // mensagem `system/mirror_error` na fila do consumidor.
                        if let Some(tx) = sender {
                            let _ = tx
                                .send(serde_json::json!({
                                    "type": "system",
                                    "subtype": "mirror_error",
                                    "error": error,
                                    "key": key,
                                    "uuid": uuid::Uuid::new_v4().to_string(),
                                    "session_id": key
                                        .as_ref()
                                        .map(|k| k.session_id.as_str())
                                        .unwrap_or(""),
                                }))
                                .await;
                        }
                    })
                });
            let batcher = crate::internal::session_resume::build_mirror_batcher(
                Box::new(shared.clone()),
                self._materialized.as_ref(),
                Some(&self._options.env),
                on_error,
                self._options.session_store_flush.clone(),
            );
            query.set_transcript_mirror_batcher(batcher);
        }

        // Start reading messages and initialize
        query.start().await?;
        query.initialize().await?;

        // If we have an initial prompt, send it
        if let Some(prompt_str) = prompt {
            query.write_user_message(prompt_str).await?;
        }

        self._query = Some(query);
        Ok(())
    }

    /// Send a new query in streaming mode (#6).
    pub async fn query(&mut self, prompt: &str) -> Result<()> {
        if self._query.is_none() {
            return Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ));
        }
        if let Some(ref mut query) = self._query {
            query.write_user_message(prompt).await?;
        }
        Ok(())
    }

    /// Lê a próxima mensagem da sessão, ou `None` quando o stream terminou.
    ///
    /// É o primitivo do modo streaming: não fecha o stdin nem espera EOF, então
    /// dá para consumir um turno e mandar outro `query()` na MESMA sessão.
    /// Mensagens que o parser não reconhece são puladas (não terminam o stream).
    pub async fn next_message(&mut self) -> Result<Option<Message>> {
        let query = match self._query {
            Some(ref mut q) => q,
            None => {
                return Err(ClaudeSDKError::cli_connection(
                    "Not connected. Call connect() first.",
                ))
            }
        };

        loop {
            match query.next_message().await? {
                None => return Ok(None),
                Some(data) => {
                    if let Ok(Some(parsed)) = parse_message(&data) {
                        return Ok(Some(parsed));
                    }
                }
            }
        }
    }

    /// Whether `connect()` succeeded and the session is still open.
    pub fn is_connected(&self) -> bool {
        self._query.is_some()
    }

    /// Receive all messages from Claude as a Vec (#5, #6).
    ///
    /// ATENÇÃO: drena até o EOF do transporte — é terminal. Numa sessão
    /// streaming o CLI só manda EOF quando o stdin fecha, então use
    /// `receive_response()`/`next_message()` para consumir turno a turno.
    pub async fn receive_messages(&mut self) -> Result<Vec<Message>> {
        if self._query.is_none() {
            return Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ));
        }

        let raw_messages = if let Some(ref mut query) = self._query {
            query.receive_messages().await?
        } else {
            return Ok(Vec::new());
        };

        let mut messages = Vec::new();
        for data in &raw_messages {
            if let Ok(Some(parsed)) = parse_message(data) {
                messages.push(parsed);
            }
        }

        Ok(messages)
    }

    /// Recebe as mensagens do turno atual, incluindo o `ResultMessage` final.
    ///
    /// Para de ler assim que o `result` chega — nunca espera EOF, nunca fecha o
    /// stdin. A sessão continua viva, então o próximo `query()` é atendido no
    /// mesmo processo do CLI (é isso que sustenta multi-turno e o `resume`).
    ///
    /// Se o transporte terminar antes de um `result`, devolve o que chegou.
    pub async fn receive_response(&mut self) -> Result<Vec<Message>> {
        let mut result = Vec::new();
        while let Some(msg) = self.next_message().await? {
            let is_result = matches!(&msg, Message::Result(_));
            result.push(msg);
            if is_result {
                break;
            }
        }
        Ok(result)
    }

    /// Legacy send_message — combines query + receive_response.
    pub async fn send_message(&mut self, message: &str) -> Result<Vec<Message>> {
        self.query(message).await?;
        self.receive_response().await
    }

    /// Get server initialization info (#5).
    pub fn get_server_info(&self) -> Option<&serde_json::Value> {
        self._query.as_ref().and_then(|q| q.get_server_info())
    }

    pub async fn disconnect(&mut self) -> Result<()> {
        if let Some(ref mut query) = self._query {
            let _ = query.close().await;
        }
        self._query = None;
        self._transport = None;
        if let Some(m) = self._materialized.take() {
            let _ = m.cleanup().await;
        }

        Ok(())
    }

    pub async fn interrupt(&mut self) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.interrupt().await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn get_mcp_status(&mut self) -> Result<McpStatusResponse> {
        if let Some(ref mut query) = self._query {
            let result = query.get_mcp_status().await?;
            serde_json::from_value(result)
                .map_err(|e| ClaudeSDKError::sdk(format!("Failed to parse MCP status: {e}")))
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn get_context_usage(&mut self) -> Result<ContextUsageResponse> {
        if let Some(ref mut query) = self._query {
            let result = query.get_context_usage().await?;
            serde_json::from_value(result)
                .map_err(|e| ClaudeSDKError::sdk(format!("Failed to parse context usage: {e}")))
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn set_permission_mode(&mut self, mode: PermissionMode) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.set_permission_mode(mode).await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn set_model(&mut self, model: Option<&str>) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.set_model(model).await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn rewind_files(&mut self, user_message_id: &str) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.rewind_files(user_message_id).await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn reconnect_mcp_server(&mut self, server_name: &str) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.reconnect_mcp_server(server_name).await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn toggle_mcp_server(&mut self, server_name: &str, enabled: bool) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.toggle_mcp_server(server_name, enabled).await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }

    pub async fn stop_task(&mut self, task_id: &str) -> Result<()> {
        if let Some(ref mut query) = self._query {
            query.stop_task(task_id).await
        } else {
            Err(ClaudeSDKError::cli_connection(
                "Not connected. Call connect() first.",
            ))
        }
    }
}

impl ClaudeAgentOptions {
    /// Copia as options preservando tudo que é copiável.
    ///
    /// `ClaudeAgentOptions` não pode derivar `Clone`: `session_store` é um
    /// `Box<dyn SessionStore>` (objeto de trait sem `Clone`) e `hooks` carrega
    /// closures que o SDK precisa manter registradas em um único dono. Trocar
    /// esses campos por `Arc` quebraria a API pública de quem já constrói as
    /// options com `Box::new(...)`, então a saída foi expor este helper: quem
    /// monta um transporte customizado deixa de precisar construir as options
    /// duas vezes.
    ///
    /// O que NÃO vem junto (fica `None`): `can_use_tool`, `hooks`,
    /// `session_store` e `stderr`. Reatribua-os na cópia se precisar.
    pub fn clone_without_callbacks(&self) -> Self {
        Self {
            tools: self.tools.clone(),
            allowed_tools: self.allowed_tools.clone(),
            system_prompt: self.system_prompt.clone(),
            mcp_servers: match &self.mcp_servers {
                McpServersConfig::Dict(d) => McpServersConfig::Dict(d.clone()),
                McpServersConfig::Path(p) => McpServersConfig::Path(p.clone()),
            },
            // Clone de `SdkMcpRegistry` é um mapa NOVO com os mesmos `Arc`: a
            // cópia declara os mesmos servidores sem passar a compartilhar
            // estado mutável com o original.
            sdk_mcp_servers: self.sdk_mcp_servers.clone(),
            strict_mcp_config: self.strict_mcp_config,
            permission_mode: self.permission_mode.clone(),
            continue_conversation: self.continue_conversation,
            resume: self.resume.clone(),
            session_id: self.session_id.clone(),
            max_turns: self.max_turns,
            max_budget_usd: self.max_budget_usd,
            disallowed_tools: self.disallowed_tools.clone(),
            model: self.model.clone(),
            fallback_model: self.fallback_model.clone(),
            betas: self.betas.clone(),
            permission_prompt_tool_name: self.permission_prompt_tool_name.clone(),
            cwd: self.cwd.clone(),
            cli_path: self.cli_path.clone(),
            settings: self.settings.clone(),
            add_dirs: self.add_dirs.clone(),
            env: self.env.clone(),
            extra_args: self.extra_args.clone(),
            max_buffer_size: self.max_buffer_size,
            can_use_tool: None,
            hooks: None, // hooks contain Arc<dyn Fn> — not cloneable via simple Clone
            user: self.user.clone(),
            include_partial_messages: self.include_partial_messages,
            fork_session: self.fork_session,
            agents: self.agents.clone(),
            setting_sources: self.setting_sources.clone(),
            skills: self.skills.clone(),
            sandbox: self.sandbox.clone(),
            plugins: self.plugins.clone(),
            max_thinking_tokens: self.max_thinking_tokens,
            thinking: self.thinking.clone(),
            effort: self.effort.clone(),
            output_format: self.output_format.clone(),
            enable_file_checkpointing: self.enable_file_checkpointing,
            session_store: None, // SessionStore is not Clone
            session_store_flush: self.session_store_flush.clone(),
            load_timeout_ms: self.load_timeout_ms,
            task_budget: self.task_budget.clone(),
            stderr: None,
        }
    }
}
