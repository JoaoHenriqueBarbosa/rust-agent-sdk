//! Redistribuição dos breakpoints de prompt cache, a mesma regra do
//! `router::cache_opt` do jai, aplicada no corpo que sai para `/v1/messages`.
//!
//! A Anthropic cacheia um *prefixo* e aceita até 4 breakpoints `cache_control`,
//! processados na ordem `tools` → `system` → `messages`. O layout que o jai
//! validou ao vivo (request real de 308k tokens) é:
//!
//! - um breakpoint na **cauda** (`messages[-1]`) captura quase todo o ganho de
//!   leitura: o prefixo dele já cobre tools + system + todas as mensagens
//!   anteriores. Comparado a deixar a cauda sem cache, reprocessa **61%** menos
//!   tokens por turno.
//! - **âncoras** estáveis em `tools[-1]` e `system[-1]` não somam leitura
//!   enquanto a cauda está quente, mas seguram o prefixo grande se a cauda
//!   expirar entre um turno e outro.
//! - `messages[-2]` cacheia o prefixo estável que o *próximo* turno vai ler.
//!
//! **TTL misto:** âncoras levam TTL longo (1h), para o prefixo de tools+system
//! sobreviver às pausas de uma sessão de código; a cauda, reescrita a cada
//! turno, leva TTL curto (5m), cuja escrita custa 1.25x em vez de 2x. A API
//! exige blocos de TTL maior ANTES dos de TTL menor na ordem do prefixo (o 400
//! dela: "a ttl='1h' cache_control block must not come after a ttl='5m'
//! cache_control block"), e tools(1h) → system(1h) → messages(5m) respeita isso.
//!
//! **Limites duros:** mais de 4 breakpoints é HTTP 400 (não trunca em
//! silêncio), e bloco abaixo de ≈1024 tokens é ignorado em silêncio, nunca
//! erro. Por isso todo `cache_control` que chega é limpo antes e no máximo 4
//! são colocados.
//!
//! Duas diferenças em relação ao jai, ambas de segurança do payload, não de
//! regra: a limpeza atua só nas posições onde um breakpoint pode morar (a do
//! jai é recursiva e apagaria uma chave `cache_control` que fosse dado, dentro
//! de um `input_schema` ou do `input` de um `tool_use`); e a âncora de tools
//! vai na última tool CLIENTE, e o breakpoint de mensagem pula blocos de
//! thinking, porque a API recusa `cache_control` em server tool e em thinking.

use serde_json::{json, Map, Value};

/// Beta exigido pelo TTL de 1h. Sem ele a API rejeita `ttl: "1h"`.
pub const EXTENDED_CACHE_TTL_BETA: &str = "extended-cache-ttl-2025-04-11";

/// TTL das âncoras (`tools[-1]`, `system[-1]`).
pub const ANCHOR_TTL: &str = "1h";

/// TTL da cauda (`messages[-2]`, `messages[-1]`).
pub const TAIL_TTL: &str = "5m";

/// Teto de breakpoints por request imposto pela API.
const MAX_BREAKPOINTS: usize = 4;

fn cache_control(ttl: &str) -> Value {
    json!({ "type": "ephemeral", "ttl": ttl })
}

/// Limpa todo `cache_control` que chegou, e coloca os ≤4 breakpoints:
/// `tools[-1]` + `system[-1]` (âncoras, `ANCHOR_TTL`) e depois o par da cauda
/// `messages[-2]` + `messages[-1]` (`TAIL_TTL`). As âncoras entram primeiro
/// para a regra de 1h-antes-de-5m valer.
pub fn optimize_cache_breakpoints(body: &mut Value) {
    clear_all(body);

    let anchor = cache_control(ANCHOR_TTL);
    let tail = cache_control(TAIL_TTL);
    let mut placed = 0;

    if mark_last_client_tool(body, &anchor) {
        placed += 1;
    }
    if mark_last_system_block(body, &anchor) {
        placed += 1;
    }

    // Cauda: messages[-2] (o prefixo estável do próximo turno), depois
    // messages[-1] (a conversa inteira, que o próximo turno lê em vez de
    // reprocessar).
    if let Some(messages) = body.get_mut("messages").and_then(Value::as_array_mut) {
        let skip = messages.len().saturating_sub(2);
        for message in messages.iter_mut().skip(skip) {
            if placed >= MAX_BREAKPOINTS {
                break;
            }
            if mark_message_last_block(message, &tail) {
                placed += 1;
            }
        }
    }
}

/// Remove `cache_control` de cada tool, bloco de system, bloco de mensagem e
/// item de conteúdo de `tool_result`: as posições onde um breakpoint vale.
fn clear_all(body: &mut Value) {
    for key in ["tools", "system"] {
        if let Some(items) = body.get_mut(key).and_then(Value::as_array_mut) {
            items.iter_mut().for_each(clear_object);
        }
    }
    let Some(messages) = body.get_mut("messages").and_then(Value::as_array_mut) else {
        return;
    };
    for message in messages {
        let Some(blocks) = message.get_mut("content").and_then(Value::as_array_mut) else {
            continue;
        };
        for block in blocks {
            clear_object(block);
            if let Some(nested) = block.get_mut("content").and_then(Value::as_array_mut) {
                nested.iter_mut().for_each(clear_object);
            }
        }
    }
}

fn clear_object(value: &mut Value) {
    if let Some(obj) = value.as_object_mut() {
        obj.remove("cache_control");
    }
}

/// Âncora na última tool cliente. Server tools (as que trazem `type`
/// versionado, tipo `web_search_20250305`) não aceitam `cache_control`.
fn mark_last_client_tool(body: &mut Value, cc: &Value) -> bool {
    let Some(tools) = body.get_mut("tools").and_then(Value::as_array_mut) else {
        return false;
    };
    let target = tools
        .iter_mut()
        .rev()
        .filter_map(Value::as_object_mut)
        .find(|tool| is_client_tool(tool));
    insert_cc(target, cc)
}

fn is_client_tool(tool: &Map<String, Value>) -> bool {
    match tool.get("type").and_then(Value::as_str) {
        None => true,
        Some(kind) => kind == "custom",
    }
}

fn mark_last_system_block(body: &mut Value, cc: &Value) -> bool {
    let target = body
        .get_mut("system")
        .and_then(Value::as_array_mut)
        .and_then(|blocks| blocks.last_mut())
        .and_then(Value::as_object_mut);
    insert_cc(target, cc)
}

/// Breakpoint no último bloco da mensagem que aceita `cache_control`
/// (thinking e redacted_thinking não aceitam).
fn mark_message_last_block(message: &mut Value, cc: &Value) -> bool {
    let target = message
        .get_mut("content")
        .and_then(Value::as_array_mut)
        .and_then(|blocks| {
            blocks
                .iter_mut()
                .rev()
                .filter_map(Value::as_object_mut)
                .find(|block| accepts_cache_control(block))
        });
    insert_cc(target, cc)
}

fn accepts_cache_control(block: &Map<String, Value>) -> bool {
    !matches!(
        block.get("type").and_then(Value::as_str),
        Some("thinking" | "redacted_thinking")
    )
}

fn insert_cc(target: Option<&mut Map<String, Value>>, cc: &Value) -> bool {
    match target {
        Some(obj) => {
            obj.insert("cache_control".into(), cc.clone());
            true
        }
        None => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cc_paths(v: &Value) -> Vec<String> {
        fn walk(v: &Value, path: String, out: &mut Vec<String>) {
            match v {
                Value::Object(map) => {
                    if map.contains_key("cache_control") {
                        out.push(path.clone());
                    }
                    for (k, val) in map {
                        walk(val, format!("{path}.{k}"), out);
                    }
                }
                Value::Array(items) => {
                    for (i, val) in items.iter().enumerate() {
                        walk(val, format!("{path}[{i}]"), out);
                    }
                }
                _ => {}
            }
        }
        let mut out = Vec::new();
        walk(v, String::new(), &mut out);
        out
    }

    fn ttl_at(v: &Value, pointer: &str) -> Option<String> {
        v.pointer(pointer)
            .and_then(|b| b.get("cache_control"))
            .and_then(|c| c.get("ttl"))
            .and_then(Value::as_str)
            .map(str::to_string)
    }

    fn optimized(mut body: Value) -> Value {
        optimize_cache_breakpoints(&mut body);
        body
    }

    #[test]
    fn clears_inbound_and_places_four_breakpoints() {
        let out = optimized(json!({
            "tools": [
                {"name": "a", "cache_control": {"type": "ephemeral"}},
                {"name": "b"}
            ],
            "system": [{"type": "text", "text": "sys1"}, {"type": "text", "text": "sys2"}],
            "messages": [
                {"role": "user", "content": [{"type": "text", "text": "m0", "cache_control": {"type": "ephemeral"}}]},
                {"role": "assistant", "content": [{"type": "text", "text": "m1"}]},
                {"role": "user", "content": [{"type": "text", "text": "m2"}]}
            ]
        }));
        let paths = cc_paths(&out);
        assert_eq!(paths.len(), 4, "exatamente 4 breakpoints, veio {paths:?}");
        assert_eq!(ttl_at(&out, "/tools/1").as_deref(), Some("1h"));
        assert_eq!(ttl_at(&out, "/system/1").as_deref(), Some("1h"));
        assert!(out.pointer("/tools/0/cache_control").is_none());
        assert!(out.pointer("/messages/0/content/0/cache_control").is_none());
        assert_eq!(ttl_at(&out, "/messages/1/content/0").as_deref(), Some("5m"));
        assert_eq!(ttl_at(&out, "/messages/2/content/0").as_deref(), Some("5m"));
    }

    #[test]
    fn respects_four_cap_with_many_messages() {
        let msgs: Vec<Value> = (0..10)
            .map(
                |i| json!({"role": "user", "content": [{"type": "text", "text": format!("m{i}")}]}),
            )
            .collect();
        let out = optimized(json!({
            "tools": [{"name": "t"}],
            "system": [{"type": "text", "text": "s"}],
            "messages": msgs
        }));
        assert_eq!(cc_paths(&out).len(), 4);
        assert!(ttl_at(&out, "/messages/8/content/0").is_some());
        assert!(ttl_at(&out, "/messages/9/content/0").is_some());
        assert!(ttl_at(&out, "/messages/7/content/0").is_none());
    }

    #[test]
    fn tail_lands_on_the_last_block_even_when_it_is_a_tool_use() {
        let out = optimized(json!({
            "messages": [
                {"role": "user", "content": [{"type": "text", "text": "lê o arquivo"}]},
                {"role": "assistant", "content": [
                    {"type": "thinking", "thinking": "hm", "signature": "sig"},
                    {"type": "text", "text": "vou ler"},
                    {"type": "tool_use", "id": "t1", "name": "Read", "input": {"path": "a"}}
                ]},
                {"role": "user", "content": [
                    {"type": "tool_result", "tool_use_id": "t1", "content": [{"type": "text", "text": "conteúdo"}]}
                ]}
            ]
        }));
        assert_eq!(ttl_at(&out, "/messages/1/content/2").as_deref(), Some("5m"));
        assert_eq!(ttl_at(&out, "/messages/2/content/0").as_deref(), Some("5m"));
        assert_eq!(cc_paths(&out).len(), 2);
    }

    #[test]
    fn thinking_never_carries_a_breakpoint() {
        let out = optimized(json!({
            "messages": [
                {"role": "assistant", "content": [
                    {"type": "text", "text": "a"},
                    {"type": "redacted_thinking", "data": "x"}
                ]}
            ]
        }));
        assert_eq!(ttl_at(&out, "/messages/0/content/0").as_deref(), Some("5m"));
        assert!(out.pointer("/messages/0/content/1/cache_control").is_none());
    }

    #[test]
    fn anchor_skips_server_tools() {
        let out = optimized(json!({
            "tools": [
                {"name": "Read", "input_schema": {"type": "object"}},
                {"type": "web_search_20250305", "name": "web_search"}
            ],
            "messages": [{"role": "user", "content": [{"type": "text", "text": "oi"}]}]
        }));
        assert_eq!(ttl_at(&out, "/tools/0").as_deref(), Some("1h"));
        assert!(out.pointer("/tools/1/cache_control").is_none());
    }

    #[test]
    fn clearing_never_touches_payload_keys_named_cache_control() {
        let out = optimized(json!({
            "tools": [{
                "name": "t",
                "input_schema": {"type": "object", "properties": {"cache_control": {"type": "string"}}}
            }],
            "messages": [
                {"role": "assistant", "content": [
                    {"type": "tool_use", "id": "t1", "name": "t", "input": {"cache_control": "keep"}}
                ]},
                {"role": "user", "content": [{"type": "text", "text": "ok"}]}
            ]
        }));
        assert!(out
            .pointer("/tools/0/input_schema/properties/cache_control")
            .is_some());
        assert_eq!(
            out.pointer("/messages/0/content/0/input/cache_control"),
            Some(&json!("keep"))
        );
    }

    #[test]
    fn clears_markers_nested_in_tool_result_content() {
        let out = optimized(json!({
            "messages": [
                {"role": "user", "content": [
                    {"type": "tool_result", "tool_use_id": "t1", "content": [
                        {"type": "text", "text": "r", "cache_control": {"type": "ephemeral"}}
                    ]}
                ]}
            ]
        }));
        assert!(out
            .pointer("/messages/0/content/0/content/0/cache_control")
            .is_none());
        assert_eq!(cc_paths(&out).len(), 1);
    }

    #[test]
    fn single_message_gets_one_tail_breakpoint() {
        let out = optimized(json!({
            "messages": [{"role": "user", "content": [{"type": "text", "text": "only"}]}]
        }));
        assert_eq!(cc_paths(&out).len(), 1);
        assert_eq!(ttl_at(&out, "/messages/0/content/0").as_deref(), Some("5m"));
    }

    #[test]
    fn empty_request_is_noop_safe() {
        let out = optimized(json!({"model": "m", "messages": []}));
        assert!(cc_paths(&out).is_empty());
    }
}
