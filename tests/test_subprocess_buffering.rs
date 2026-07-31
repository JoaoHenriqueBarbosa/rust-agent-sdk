//! Tests for subprocess transport buffering edge cases.
//! Ported from Python: tests/test_subprocess_buffering.py
//!
//! O transporte é exercitado de verdade: um "CLI" falso (script sh que despeja
//! um payload fixo no stdout) é apontado por `cli_path`, e os testes leem as
//! mensagens por `read_message()`. Antes estes testes só chamavam `connect()`
//! contra um `/usr/bin/claude` inexistente e morriam no `unwrap`.

use std::io::Write;
use std::path::PathBuf;

use rust_agent_sdk::internal::transport::{
    SubprocessCLITransport, Transport, DEFAULT_MAX_BUFFER_SIZE,
};
use rust_agent_sdk::types::ClaudeAgentOptions;

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

/// CLI falso: ignora os argumentos e escreve `payload` no stdout.
///
/// O `TempDir` é devolvido junto porque ele apaga o script ao ser dropado.
fn fake_cli(payload: &str) -> (tempfile::TempDir, PathBuf) {
    // A checagem de versão spawnaria o script mais uma vez; desligar deixa o
    // teste determinístico.
    std::env::set_var("CLAUDE_AGENT_SDK_SKIP_VERSION_CHECK", "1");

    let dir = tempfile::tempdir().expect("tempdir para o CLI falso");
    let payload_path = dir.path().join("payload.txt");
    std::fs::write(&payload_path, payload).expect("escrita do payload");

    let script_path = dir.path().join("fake-claude");
    let mut script = std::fs::File::create(&script_path).expect("criação do script");
    write!(
        script,
        "#!/bin/sh\nexec cat {}\n",
        payload_path.to_string_lossy()
    )
    .expect("escrita do script");
    drop(script);

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&script_path, std::fs::Permissions::from_mode(0o755))
            .expect("permissão de execução");
    }

    (dir, script_path)
}

fn make_options(cli_path: PathBuf, max_buffer_size: Option<usize>) -> ClaudeAgentOptions {
    ClaudeAgentOptions {
        cli_path: Some(cli_path),
        max_buffer_size,
        ..Default::default()
    }
}

/// Conecta ao CLI falso e drena todas as mensagens até o EOF.
async fn read_all(payload: &str, max_buffer_size: Option<usize>) -> Vec<serde_json::Value> {
    let (_dir, cli_path) = fake_cli(payload);
    let mut transport =
        SubprocessCLITransport::new("test", make_options(cli_path, max_buffer_size));
    transport.connect().await.expect("spawn do CLI falso");

    let mut messages = Vec::new();
    while let Some(msg) = transport.read_message().await.expect("leitura sem erro") {
        messages.push(msg);
    }
    let _ = transport.close().await;
    messages
}

/// Conecta ao CLI falso e devolve o erro da primeira leitura que falhar.
async fn read_until_error(payload: &str, max_buffer_size: Option<usize>) -> String {
    let (_dir, cli_path) = fake_cli(payload);
    let mut transport =
        SubprocessCLITransport::new("test", make_options(cli_path, max_buffer_size));
    transport.connect().await.expect("spawn do CLI falso");

    loop {
        match transport.read_message().await {
            Ok(Some(_)) => continue,
            Ok(None) => panic!("a leitura terminou sem o erro de buffer esperado"),
            Err(e) => {
                let _ = transport.close().await;
                return format!("{e}");
            }
        }
    }
}

// -------------------------------------------------------------------------
// TestSubprocessBuffering
// -------------------------------------------------------------------------

/// Test parsing when multiple JSON objects are concatenated on a single line.
///
/// In some environments, stdout buffering can cause multiple distinct JSON
/// objects to be delivered as a single line with embedded newlines.
#[tokio::test]
async fn test_multiple_json_objects_on_single_line() {
    let json_obj1 =
        serde_json::json!({"type": "message", "id": "msg1", "content": "First message"});
    let json_obj2 = serde_json::json!({"type": "result", "id": "res1", "status": "completed"});

    let buffered_line = format!("{}\n{}\n", json_obj1, json_obj2);

    let messages = read_all(&buffered_line, None).await;

    // Contrato: dois objetos entram, dois objetos saem, na ordem.
    assert_eq!(messages.len(), 2);
    assert_eq!(messages[0]["type"], "message");
    assert_eq!(messages[0]["id"], "msg1");
    assert_eq!(messages[1]["type"], "result");
    assert_eq!(messages[1]["id"], "res1");
}

/// Test parsing JSON objects that contain newline characters in string values.
#[tokio::test]
async fn test_json_with_embedded_newlines() {
    let json_obj1 = serde_json::json!({"type": "message", "content": "Line 1\nLine 2\nLine 3"});
    let json_obj2 = serde_json::json!({"type": "result", "data": "Some\nMultiline\nContent"});

    // `to_string` escapa os \n dentro das strings — cada objeto continua numa linha.
    let buffered_line = format!("{}\n{}\n", json_obj1, json_obj2);

    let messages = read_all(&buffered_line, None).await;

    // Contrato: as quebras de linha ESCAPADAS sobrevivem intactas ao parsing.
    assert_eq!(messages.len(), 2);
    assert_eq!(messages[0]["content"], "Line 1\nLine 2\nLine 3");
    assert_eq!(messages[1]["data"], "Some\nMultiline\nContent");
}

/// Test parsing with multiple newlines between JSON objects.
#[tokio::test]
async fn test_multiple_newlines_between_objects() {
    let json_obj1 = serde_json::json!({"type": "message", "id": "msg1"});
    let json_obj2 = serde_json::json!({"type": "result", "id": "res1"});

    let buffered_line = format!("{}\n\n\n{}\n", json_obj1, json_obj2);

    let messages = read_all(&buffered_line, None).await;

    // Contrato: linhas vazias entre objetos são ignoradas.
    assert_eq!(messages.len(), 2);
    assert_eq!(messages[0]["id"], "msg1");
    assert_eq!(messages[1]["id"], "res1");
}

/// Test parsing when a single JSON object is split across multiple stream reads.
#[tokio::test]
async fn test_split_json_across_multiple_reads() {
    let json_obj = serde_json::json!({
        "type": "assistant",
        "message": {
            "content": [
                {"type": "text", "text": "x".repeat(1000)},
                {
                    "type": "tool_use",
                    "id": "tool_123",
                    "name": "Read",
                    "input": {"file_path": "/test.txt"}
                }
            ]
        }
    });

    let complete_json = serde_json::to_string(&json_obj).unwrap();
    // Um único objeto partido em três leituras de linha.
    let payload = format!(
        "{}\n{}\n{}\n",
        &complete_json[..100],
        &complete_json[100..250],
        &complete_json[250..]
    );

    let messages = read_all(&payload, None).await;

    // Contrato: os três pedaços viram UM objeto só, íntegro.
    assert_eq!(messages.len(), 1);
    assert_eq!(messages[0]["type"], "assistant");
    assert_eq!(
        messages[0]["message"]["content"].as_array().unwrap().len(),
        2
    );
    assert_eq!(messages[0]["message"]["content"][1]["id"], "tool_123");
}

/// Test parsing a large minified JSON (simulating the reported issue).
#[tokio::test]
async fn test_large_minified_json() {
    let large_data: Vec<serde_json::Value> = (0..1000)
        .map(|i| serde_json::json!({"id": i, "value": "x".repeat(100)}))
        .collect();

    let json_obj = serde_json::json!({
        "type": "user",
        "message": {
            "role": "user",
            "content": [{
                "tool_use_id": "toolu_016fed1NhiaMLqnEvrj5NUaj",
                "type": "tool_result",
                "content": serde_json::to_string(&serde_json::json!({"data": large_data})).unwrap()
            }]
        }
    });

    let complete_json = serde_json::to_string(&json_obj).unwrap();
    let payload = format!("{}\n", complete_json);

    let messages = read_all(&payload, None).await;

    // Contrato: uma linha minificada de ~150 KB é lida inteira.
    assert_eq!(messages.len(), 1);
    assert_eq!(messages[0]["type"], "user");
    assert_eq!(
        messages[0]["message"]["content"][0]["tool_use_id"],
        "toolu_016fed1NhiaMLqnEvrj5NUaj"
    );
}

/// Test that exceeding buffer size raises an appropriate error.
#[tokio::test]
async fn test_buffer_size_exceeded() {
    // JSON incompleto partido em duas linhas: a acumulação passa do teto.
    let half = "x".repeat(DEFAULT_MAX_BUFFER_SIZE / 2 + 1000);
    let payload = format!("{{\"data\": \"{}\n{}\n", half, half);

    let error = read_until_error(&payload, None).await;

    // Contrato: estourar o buffer é erro explícito, não travamento nem lixo.
    assert!(
        error.contains("exceeded maximum buffer size"),
        "mensagem inesperada: {error}"
    );
}

/// Test that the configurable buffer size option is respected.
#[tokio::test]
async fn test_buffer_size_option() {
    let custom_limit: usize = 512;
    let chunk = "x".repeat(custom_limit);
    let payload = format!("{{\"data\": \"{}\n{}\n", chunk, chunk);

    let error = read_until_error(&payload, Some(custom_limit)).await;

    // Contrato: o teto configurado é o que vale, e aparece na mensagem.
    assert!(
        error.contains("maximum buffer size of 512 bytes"),
        "mensagem inesperada: {error}"
    );
}

/// Test handling a mix of complete and split JSON messages.
#[tokio::test]
async fn test_mixed_complete_and_split_json() {
    let msg1 =
        serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "start"})).unwrap();

    let large_msg = serde_json::json!({
        "type": "assistant",
        "message": {"content": [{"type": "text", "text": "y".repeat(5000)}]}
    });
    let large_json = serde_json::to_string(&large_msg).unwrap();

    let msg3 =
        serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "end"})).unwrap();

    let payload = format!(
        "{}\n{}\n{}\n{}\n{}\n",
        msg1,
        &large_json[..1000],
        &large_json[1000..3000],
        &large_json[3000..],
        msg3
    );

    let messages = read_all(&payload, None).await;

    // Contrato: objeto completo, objeto partido e objeto completo convivem.
    assert_eq!(messages.len(), 3);
    assert_eq!(messages[0]["subtype"], "start");
    assert_eq!(messages[1]["type"], "assistant");
    assert_eq!(
        messages[1]["message"]["content"][0]["text"]
            .as_str()
            .unwrap()
            .len(),
        5000
    );
    assert_eq!(messages[2]["subtype"], "end");
}

/// Non-JSON lines (e.g. [SandboxDebug]) on stdout must not corrupt
/// the JSON parser buffer. Regression test for #347.
#[tokio::test]
async fn test_non_json_debug_lines_skipped() {
    let debug = "[SandboxDebug] Seccomp filtering not available";
    let msg1 =
        serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "init"})).unwrap();
    let msg2 = serde_json::to_string(&serde_json::json!({"type": "result", "subtype": "success"}))
        .unwrap();

    let payload = format!("{}\n{}\n{}\n{}\n", debug, msg1, debug, msg2);

    let messages = read_all(&payload, None).await;

    // Contrato: linhas de debug somem sem contaminar o buffer.
    assert_eq!(messages.len(), 2);
    assert_eq!(messages[0]["type"], "system");
    assert_eq!(messages[1]["type"], "result");
}

/// Debug/warning lines interleaved between valid JSON messages
/// must be silently skipped.
#[tokio::test]
async fn test_interleaved_non_json_lines_skipped() {
    let payload = format!(
        "[SandboxDebug] line 1\n[SandboxDebug] line 2\n{}\nWARNING: something\n{}\n",
        serde_json::to_string(&serde_json::json!({"type": "system", "subtype": "init"})).unwrap(),
        serde_json::to_string(&serde_json::json!({"type": "result", "subtype": "success"}))
            .unwrap()
    );

    let messages = read_all(&payload, None).await;

    // Contrato: warnings e debug intercalados não quebram a sequência.
    assert_eq!(messages.len(), 2);
    assert_eq!(messages[0]["type"], "system");
    assert_eq!(messages[1]["type"], "result");
}
