//! Microcompact — a compactação incremental SEM chamada de LLM (porte em
//! espírito do microCompact do CLI): limpa o conteúdo de tool_results
//! antigos, preservando os N mais recentes, e substitui cada um por um
//! marcador que diz ao modelo como recuperar a informação. Custo zero, e
//! adia (às vezes elimina) o compact completo — que custa uma chamada de
//! modelo inteira e, num gateway de terceiro, é a operação mais propensa a
//! falhar.

use crate::api::types::{ApiMessage, ContentBlock, Role, ToolResultContent};

/// Quantos tool_results recentes sobrevivem intactos.
pub const MICROCOMPACT_KEEP_RECENT: usize = 5;

/// O texto que substitui um resultado limpo — precisa dizer o remédio.
pub const CLEARED_MESSAGE: &str =
    "[Old tool result content cleared to save context. Re-run the tool if this output is needed again.]";

/// Limpa o texto dos tool_results antigos, mantendo os `keep_recent` mais
/// recentes. Devolve quantos blocos foram limpos. Blocos já limpos, com
/// imagem, ou pequenos (o custo de limpar não paga o cache que invalida) são
/// pulados.
pub fn microcompact_messages(messages: &mut [ApiMessage], keep_recent: usize) -> usize {
    // Só vale limpar um bloco cujo texto pese de verdade.
    const MIN_CLEARABLE_BYTES: usize = 2_000;

    // Índices (mensagem, bloco) de todos os tool_results elegíveis, em ordem.
    let mut candidates: Vec<(usize, usize)> = Vec::new();
    for (message_index, message) in messages.iter().enumerate() {
        if message.role != Role::User {
            continue;
        }
        for (block_index, block) in message.content.iter().enumerate() {
            if let ContentBlock::ToolResult {
                content: Some(blocks),
                ..
            } = block
            {
                let has_image = blocks
                    .iter()
                    .any(|c| matches!(c, ToolResultContent::Image { .. }));
                let text_len: usize = blocks
                    .iter()
                    .map(|c| match c {
                        ToolResultContent::Text { text } => text.len(),
                        ToolResultContent::Image { .. } => 0,
                    })
                    .sum();
                let already_cleared = blocks.iter().any(|c| {
                    matches!(c, ToolResultContent::Text { text } if text == CLEARED_MESSAGE)
                });
                if !has_image && !already_cleared && text_len >= MIN_CLEARABLE_BYTES {
                    candidates.push((message_index, block_index));
                }
            }
        }
    }

    if candidates.len() <= keep_recent {
        return 0;
    }
    let to_clear = candidates.len() - keep_recent;
    let mut cleared = 0;
    for (message_index, block_index) in candidates.into_iter().take(to_clear) {
        if let ContentBlock::ToolResult {
            content: Some(blocks),
            ..
        } = &mut messages[message_index].content[block_index]
        {
            *blocks = vec![ToolResultContent::Text {
                text: CLEARED_MESSAGE.to_string(),
            }];
            cleared += 1;
        }
    }
    cleared
}

#[cfg(test)]
mod tests {
    use super::*;

    fn tool_result_message(id: &str, size: usize) -> ApiMessage {
        ApiMessage::user(vec![ContentBlock::tool_result(
            id,
            vec![ToolResultContent::text("x".repeat(size))],
            false,
        )])
    }

    #[test]
    fn keeps_the_recent_results_and_clears_the_old() {
        let mut messages: Vec<ApiMessage> = (0..8)
            .map(|i| tool_result_message(&format!("t{i}"), 5_000))
            .collect();
        let cleared = microcompact_messages(&mut messages, 5);
        // Contrato: limpa os 3 mais ANTIGOS e preserva os 5 recentes.
        assert_eq!(cleared, 3);
        for (i, message) in messages.iter().enumerate() {
            let ContentBlock::ToolResult { content: Some(blocks), .. } = &message.content[0] else {
                panic!("tool_result esperado");
            };
            let ToolResultContent::Text { text } = &blocks[0] else {
                panic!("texto esperado");
            };
            if i < 3 {
                assert_eq!(text, CLEARED_MESSAGE);
            } else {
                assert!(text.starts_with('x'));
            }
        }
    }

    #[test]
    fn clearing_is_idempotent() {
        let mut messages: Vec<ApiMessage> = (0..8)
            .map(|i| tool_result_message(&format!("t{i}"), 5_000))
            .collect();
        microcompact_messages(&mut messages, 5);
        // Contrato: rodar de novo não limpa mais nada — decisão congelada, o
        // prefixo do prompt não muda entre turnos.
        assert_eq!(microcompact_messages(&mut messages, 5), 0);
    }

    #[test]
    fn small_results_are_not_worth_clearing() {
        let mut messages: Vec<ApiMessage> = (0..8)
            .map(|i| tool_result_message(&format!("t{i}"), 100))
            .collect();
        // Contrato: bloco pequeno não paga o cache que a limpeza invalida.
        assert_eq!(microcompact_messages(&mut messages, 5), 0);
    }
}
