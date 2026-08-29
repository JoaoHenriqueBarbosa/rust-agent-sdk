use crate::api::types::{ApiMessage, CacheControl, ContentBlock, SystemBlock};

/// Represents a location where cache_control can be injected.
#[allow(dead_code)] // referência do port; a injeção atual anda direto nos blocos
#[allow(clippy::enum_variant_names)]
#[derive(Debug)]
enum CacheTarget {
    /// Last system block.
    SystemBlock { index: usize },
    /// Last text block in a user message.
    UserMessageTextBlock { msg_index: usize },
    /// A tool_result block with large content.
    ToolResultBlock { msg_index: usize, block_index: usize, content_len: usize },
}

/// Inject cache_control breakpoints — a estratégia do addCacheBreakpoints do
/// CLI: UM único breakpoint de mensagem, no último bloco da ÚLTIMA mensagem.
/// Tudo antes dele é prefixo estável, e o breakpoint do request anterior
/// continua válido dentro da janela do cache — é isso que faz o prefixo ser
/// reaproveitado. Marcar posições que se movem a cada turno (penúltima user,
/// "maior tool_result") invalidava o cache em todo request.
///
/// Os marcadores do turno anterior são LIMPOS antes: o histórico persiste
/// entre iterações, e acumular breakpoints estoura o limite de 4 da API.
pub fn inject_cache_control(
    messages: &mut [ApiMessage],
    system: &mut [SystemBlock],
) {
    // System: o último bloco leva o breakpoint (o prompt não muda na sessão).
    if let Some(last_sys) = system.last_mut() {
        last_sys.cache_control = Some(CacheControl::ephemeral());
    }

    // Limpa marcadores de turnos anteriores.
    for message in messages.iter_mut() {
        for block in &mut message.content {
            clear_block_cache_control(block);
        }
    }

    // Um breakpoint só: o último bloco cacheável da última mensagem.
    if let Some(last) = messages.last_mut() {
        for block in last.content.iter_mut().rev() {
            if set_block_cache_control(block) {
                break;
            }
        }
    }
}

fn clear_block_cache_control(block: &mut ContentBlock) {
    match block {
        ContentBlock::Text { cache_control, .. }
        | ContentBlock::ToolResult { cache_control, .. } => *cache_control = None,
        _ => {}
    }
}

/// Marca o bloco quando ele aceita cache_control (thinking não aceita).
fn set_block_cache_control(block: &mut ContentBlock) -> bool {
    match block {
        ContentBlock::Text { cache_control, .. }
        | ContentBlock::ToolResult { cache_control, .. } => {
            *cache_control = Some(CacheControl::ephemeral());
            true
        }
        _ => false,
    }
}

/// Build a user message from a text prompt.
pub fn user_text_message(text: impl Into<String>) -> ApiMessage {
    ApiMessage::user(vec![ContentBlock::text(text)])
}

/// Build an assistant message with text content.
pub fn assistant_text_message(text: impl Into<String>) -> ApiMessage {
    ApiMessage::assistant(vec![ContentBlock::text(text)])
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::types::{Role, ToolResultContent};

    #[test]
    fn test_inject_cache_control_basic() {
        let mut system = vec![
            SystemBlock::text("You are a helpful assistant."),
            SystemBlock::text("Extra context."),
        ];
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::text("first")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 1")]),
            ApiMessage::user(vec![ContentBlock::text("second")]),
            ApiMessage::assistant(vec![ContentBlock::text("response 2")]),
            ApiMessage::user(vec![ContentBlock::text("third")]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // Last system block should have cache_control
        assert!(system.last().unwrap().cache_control.is_some());
        // First system block should NOT
        assert!(system[0].cache_control.is_none());

        // Last user message (index 4) should have cache_control
        match &messages[4].content[0] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected text"),
        }

        // NENHUMA outra mensagem leva breakpoint: um único ponto, no fim do
        // prompt — posições que se movem a cada turno invalidariam o cache.
        for message in &messages[..4] {
            for block in &message.content {
                if let ContentBlock::Text { cache_control, .. } = block {
                    assert!(cache_control.is_none());
                }
            }
        }
    }

    #[test]
    fn test_inject_cache_control_clears_stale_markers() {
        // O histórico persiste entre turnos: o marcador do turno anterior tem
        // de ser LIMPO, senão os breakpoints acumulam além do limite de 4.
        let mut system = vec![SystemBlock::text("system")];
        let mut messages = vec![
            ApiMessage::user(vec![ContentBlock::text("first")]),
            ApiMessage::user(vec![ContentBlock::text("second")]),
        ];
        inject_cache_control(&mut messages, &mut system);
        messages.push(ApiMessage::user(vec![ContentBlock::text("third")]));
        inject_cache_control(&mut messages, &mut system);

        let marked: usize = messages
            .iter()
            .flat_map(|m| &m.content)
            .filter(|b| matches!(b, ContentBlock::Text { cache_control: Some(_), .. }))
            .count();
        // Contrato: exatamente UM breakpoint de mensagem por request.
        assert_eq!(marked, 1);
        match &messages[2].content[0] {
            ContentBlock::Text { cache_control, .. } => assert!(cache_control.is_some()),
            _ => panic!("Expected text"),
        }
    }

    #[test]
    fn test_inject_cache_control_large_tool_result() {
        let mut system = vec![SystemBlock::text("system")];
        let large_content = "x".repeat(2000);
        let mut messages = vec![
            ApiMessage::user(vec![
                ContentBlock::tool_result(
                    "tool_1",
                    vec![ToolResultContent::text(&large_content)],
                    false,
                ),
                ContentBlock::text("question"),
            ]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // System block: cached
        assert!(system[0].cache_control.is_some());

        // Last user text block: cached
        match &messages[0].content[1] {
            ContentBlock::Text { cache_control, .. } => {
                assert!(cache_control.is_some());
            }
            _ => panic!("Expected text"),
        }

        // tool_result NÃO ganha breakpoint próprio (estratégia do CLI: o
        // único breakpoint de mensagem é o fim do prompt).
        match &messages[0].content[0] {
            ContentBlock::ToolResult { cache_control, .. } => {
                assert!(cache_control.is_none());
            }
            _ => panic!("Expected tool_result"),
        }
    }

    #[test]
    fn test_inject_cache_control_small_tool_result_not_cached() {
        let mut system = vec![SystemBlock::text("system")];
        let small_content = "short";
        let mut messages = vec![
            ApiMessage::user(vec![
                ContentBlock::tool_result(
                    "tool_1",
                    vec![ToolResultContent::text(small_content)],
                    false,
                ),
                ContentBlock::text("question"),
            ]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // Small tool_result should NOT be cached
        match &messages[0].content[0] {
            ContentBlock::ToolResult { cache_control, .. } => {
                assert!(cache_control.is_none());
            }
            _ => panic!("Expected tool_result"),
        }
    }

    #[test]
    fn test_inject_cache_control_respects_budget() {
        let mut system = vec![SystemBlock::text("system")];
        let large_content = "x".repeat(5000);
        let large_content2 = "y".repeat(3000);
        // 4 user messages + 2 large tool results = more than 4 candidates
        let mut messages = vec![
            ApiMessage::user(vec![
                ContentBlock::tool_result("t1", vec![ToolResultContent::text(&large_content)], false),
                ContentBlock::text("q1"),
            ]),
            ApiMessage::assistant(vec![ContentBlock::text("a1")]),
            ApiMessage::user(vec![
                ContentBlock::tool_result("t2", vec![ToolResultContent::text(&large_content2)], false),
                ContentBlock::text("q2"),
            ]),
            ApiMessage::assistant(vec![ContentBlock::text("a2")]),
            ApiMessage::user(vec![ContentBlock::text("q3")]),
            ApiMessage::assistant(vec![ContentBlock::text("a3")]),
            ApiMessage::user(vec![ContentBlock::text("q4")]),
        ];

        inject_cache_control(&mut messages, &mut system);

        // Count total cache_control blocks
        let mut count = 0;
        for s in &system {
            if s.cache_control.is_some() {
                count += 1;
            }
        }
        for m in &messages {
            for b in &m.content {
                match b {
                    ContentBlock::Text { cache_control: Some(_), .. } => count += 1,
                    ContentBlock::ToolResult { cache_control: Some(_), .. } => count += 1,
                    _ => {}
                }
            }
        }

        assert!(count <= 4, "Should not exceed 4 breakpoints (API limit), got {count}");
    }

    #[test]
    fn test_user_text_message() {
        let msg = user_text_message("hello");
        assert_eq!(msg.role, Role::User);
        assert_eq!(msg.content.len(), 1);
    }
}
