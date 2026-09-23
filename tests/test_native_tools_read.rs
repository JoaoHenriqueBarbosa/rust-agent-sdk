//! Paridade do Read nativo com o `FileReadTool` do CLI 2.1.90.
//!
//! As expectativas de texto vêm de capturas reais do CLI 2.1.90 (o mesmo
//! roteiro de tool_use rodado contra um servidor local): o `content` do
//! tool_result, o `tool_use_result` do frame `user` e as mensagens meta
//! anexadas depois do tool_result. Os testes rodam pelo `ToolExecutor`, que é
//! o caminho de produção (schema, `validateInput`, permissão, execução).

use std::io::Cursor;
use std::path::Path;

use rust_agent_sdk::api::streaming::ToolUseBlock;
use rust_agent_sdk::api::types::ContentBlock;
use rust_agent_sdk::tools::file_read::FileReadTool;
use rust_agent_sdk::tools::framework::{
    Tool, ToolContext, ToolExecutionResult, ToolExecutor, ToolRegistry, ToolResultContent,
    ToolResultPayload,
};
use rust_agent_sdk::types::PermissionMode;
use serde_json::{json, Value};

const MITIGATION: &str = "\n\n<system-reminder>\nWhenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.\n</system-reminder>\n";

fn context(cwd: &Path) -> ToolContext {
    ToolContext {
        working_directory: cwd.to_path_buf(),
        tool_results_dir: Some(cwd.join(".tool-results")),
        ..Default::default()
    }
}

async fn run_with(ctx: ToolContext, input: Value) -> ToolExecutionResult {
    let mut registry = ToolRegistry::new();
    registry.register(Box::new(FileReadTool));
    let executor = ToolExecutor::new(registry, ctx);
    let mut results = executor
        .execute_all(vec![ToolUseBlock {
            id: "toolu_read".to_string(),
            name: "Read".to_string(),
            input,
        }])
        .await;
    results.remove(0)
}

async fn run(cwd: &Path, input: Value) -> ToolExecutionResult {
    run_with(context(cwd), input).await
}

/// O content como o modelo recebe: string para texto.
fn string_content(r: &ToolExecutionResult) -> String {
    match r.result.to_api_payload() {
        ToolResultPayload::Text(t) => t,
        ToolResultPayload::Blocks(_) => panic!("esperava content string, veio blocos"),
    }
}

fn tur(r: &ToolExecutionResult) -> Value {
    r.result.tool_use_result.clone().expect("tool_use_result")
}

fn png(width: u32, height: u32) -> Vec<u8> {
    let img = image::RgbImage::from_fn(width, height, |x, y| {
        image::Rgb([(x % 256) as u8, (y % 256) as u8, 90])
    });
    let mut out = Cursor::new(Vec::new());
    image::DynamicImage::ImageRgb8(img)
        .write_to(&mut out, image::ImageFormat::Png)
        .unwrap();
    out.into_inner()
}

/// Um PDF mínimo válido, com `pages` páginas de texto e xref correto.
fn pdf(pages: usize) -> Vec<u8> {
    let mut objects: Vec<String> = Vec::new();
    let kids: Vec<String> = (0..pages).map(|i| format!("{} 0 R", 4 + i * 2)).collect();
    objects.push("<< /Type /Catalog /Pages 2 0 R >>".to_string());
    objects.push(format!(
        "<< /Type /Pages /Kids [{}] /Count {pages} >>",
        kids.join(" ")
    ));
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>".to_string());
    for i in 0..pages {
        let content_id = 5 + i * 2;
        objects.push(format!(
            "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents {content_id} 0 R >>"
        ));
        let stream = format!("BT /F1 24 Tf 72 700 Td (Pagina {}) Tj ET", i + 1);
        objects.push(format!(
            "<< /Length {} >>\nstream\n{stream}\nendstream",
            stream.len()
        ));
    }
    let mut out = b"%PDF-1.4\n".to_vec();
    let mut offsets = Vec::new();
    for (i, body) in objects.iter().enumerate() {
        offsets.push(out.len());
        out.extend_from_slice(format!("{} 0 obj\n{body}\nendobj\n", i + 1).as_bytes());
    }
    let xref = out.len();
    out.extend_from_slice(
        format!("xref\n0 {}\n0000000000 65535 f \n", objects.len() + 1).as_bytes(),
    );
    for off in offsets {
        out.extend_from_slice(format!("{off:010} 00000 n \n").as_bytes());
    }
    out.extend_from_slice(
        format!(
            "trailer\n<< /Size {} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n",
            objects.len() + 1
        )
        .as_bytes(),
    );
    out
}

fn has_poppler() -> bool {
    std::process::Command::new("pdfinfo")
        .arg("-v")
        .output()
        .is_ok()
}

#[test]
fn description_and_schema_are_the_captured_ones() {
    let expected = "Reads a file from the local filesystem. You can access any file directly by using this tool.\nAssume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.\n\nUsage:\n- The file_path parameter must be an absolute path, not a relative path\n- By default, it reads up to 2000 lines starting from the beginning of the file\n- When you already know which part of the file you need, only read that part. This can be important for larger files.\n- Results are returned using cat -n format, with line numbers starting at 1\n- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.\n- This tool can read PDF files (.pdf). For large PDFs (more than 10 pages), you MUST provide the pages parameter to read specific page ranges (e.g., pages: \"1-5\"). Reading a large PDF without the pages parameter will fail. Maximum 20 pages per request.\n- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.\n- This tool can only read files, not directories. To read a directory, use an ls command via the Bash tool.\n- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.\n- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.";
    assert_eq!(FileReadTool.description(), expected);
    let schema = FileReadTool.input_schema();
    assert_eq!(
        serde_json::to_string(&schema).unwrap(),
        r#"{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{"file_path":{"description":"The absolute path to the file to read","type":"string"},"offset":{"description":"The line number to start reading from. Only provide if the file is too large to read at once","type":"integer","minimum":0,"maximum":9007199254740991},"limit":{"description":"The number of lines to read. Only provide if the file is too large to read at once.","type":"integer","exclusiveMinimum":0,"maximum":9007199254740991},"pages":{"description":"Page range for PDF files (e.g., \"1-5\", \"3\", \"10-20\"). Only applicable to PDF files. Maximum 20 pages per request.","type":"string"}},"required":["file_path"],"additionalProperties":false}"#
    );
    // Modelo sem PDF: a linha some, como no isPDFSupported do JS.
    let haiku3 = FileReadTool::for_model(Some("claude-3-haiku-20240307"));
    assert!(!haiku3.description().contains("PDF"));
}

#[tokio::test]
async fn text_file_matches_the_cli() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("notas.md");
    std::fs::write(&file, "um\ndois\ntres\n").unwrap();
    let path = file.to_string_lossy().to_string();
    let r = run(dir.path(), json!({"file_path": path})).await;
    assert!(!r.result.is_error);
    assert_eq!(
        string_content(&r),
        format!("1\tum\n2\tdois\n3\ttres\n4\t{MITIGATION}")
    );
    assert_eq!(
        serde_json::to_string(&tur(&r)).unwrap(),
        serde_json::to_string(&json!({"type": "text", "file": {"filePath": path, "content": "um\ndois\ntres\n", "numLines": 4, "startLine": 1, "totalLines": 4}})).unwrap()
    );
    assert!(r.result.new_messages.is_empty());
}

#[tokio::test]
async fn offset_zero_numbers_from_zero_and_string_offset_is_coerced() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("notas.md");
    std::fs::write(&file, "um\ndois\ntres\n").unwrap();
    let path = file.to_string_lossy().to_string();
    let r = run(
        dir.path(),
        json!({"file_path": path, "offset": 0, "limit": 2}),
    )
    .await;
    assert_eq!(string_content(&r), format!("0\tum\n1\tdois{MITIGATION}"));
    assert_eq!(tur(&r)["file"]["startLine"], 0);
    // semanticNumber: "2" vira 2.
    let r = run(dir.path(), json!({"file_path": path, "offset": "2"})).await;
    assert_eq!(
        string_content(&r),
        format!("2\tdois\n3\ttres\n4\t{MITIGATION}")
    );
    assert_eq!(tur(&r)["file"]["numLines"], 3);
}

#[tokio::test]
async fn bom_and_crlf_are_normalized() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("crlf.txt");
    std::fs::write(&file, b"\xef\xbb\xbfa\r\nb\r\nc").unwrap();
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert_eq!(string_content(&r), format!("1\ta\n2\tb\n3\tc{MITIGATION}"));
    assert_eq!(tur(&r)["file"]["content"], "a\nb\nc");
}

#[tokio::test]
async fn empty_file_and_offset_beyond_the_end() {
    let dir = tempfile::tempdir().unwrap();
    let empty = dir.path().join("empty.txt");
    std::fs::write(&empty, "").unwrap();
    let r = run(dir.path(), json!({"file_path": empty.to_string_lossy()})).await;
    // Correção do bug do JS (que diz "shorter than the provided offset (1)"
    // num arquivo vazio): o aviso de arquivo vazio que o prompt promete. O
    // `tool_use_result` segue o do JS.
    assert_eq!(
        string_content(&r),
        "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
    );
    assert_eq!(tur(&r)["file"]["numLines"], 1);
    assert_eq!(tur(&r)["file"]["totalLines"], 1);

    let short = dir.path().join("notas.md");
    std::fs::write(&short, "um\ndois\ntres\n").unwrap();
    let r = run(
        dir.path(),
        json!({"file_path": short.to_string_lossy(), "offset": 10}),
    )
    .await;
    assert_eq!(
        string_content(&r),
        "<system-reminder>Warning: the file exists but is shorter than the provided offset (10). The file has 4 lines.</system-reminder>"
    );
    assert_eq!(tur(&r)["file"]["numLines"], 0);
    assert_eq!(tur(&r)["file"]["startLine"], 10);
}

#[tokio::test]
async fn missing_file_suggests_a_similar_name() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(dir.path().join("notas.md"), "x").unwrap();
    let r = run(
        dir.path(),
        json!({"file_path": dir.path().join("notas.txt").to_string_lossy()}),
    )
    .await;
    assert!(r.result.is_error);
    let expected = format!(
        "File does not exist. Note: your current working directory is {}. Did you mean notas.md?",
        dir.path().display()
    );
    assert_eq!(string_content(&r), expected);
    assert_eq!(tur(&r), json!(format!("Error: {expected}")));
}

#[tokio::test]
async fn large_file_and_token_limit_errors() {
    let dir = tempfile::tempdir().unwrap();
    let big = dir.path().join("big.txt");
    std::fs::write(&big, format!("{}\n", "x".repeat(99)).repeat(3000)).unwrap();
    let r = run(dir.path(), json!({"file_path": big.to_string_lossy()})).await;
    assert_eq!(
        string_content(&r),
        "File content (293KB) exceeds maximum allowed size (256KB). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file."
    );
    // Com limit o teto de bytes não vale; o de tokens (estimado) vale.
    let r = run(
        dir.path(),
        json!({"file_path": big.to_string_lossy(), "limit": 2000}),
    )
    .await;
    assert!(r.result.is_error);
    assert!(string_content(&r)
        .starts_with("File content (50000 tokens) exceeds maximum allowed tokens (25000)."));
    let r = run(
        dir.path(),
        json!({"file_path": big.to_string_lossy(), "limit": 5}),
    )
    .await;
    assert!(!r.result.is_error);
}

#[tokio::test]
async fn validation_errors_use_the_cli_texts() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("a.txt");
    std::fs::write(&file, "x").unwrap();
    let path = file.to_string_lossy().to_string();

    let r = run(dir.path(), json!({"file_path": path, "limit": 0})).await;
    assert_eq!(
        string_content(&r),
        "<tool_use_error>InputValidationError: [\n  {\n    \"origin\": \"number\",\n    \"code\": \"too_small\",\n    \"minimum\": 0,\n    \"inclusive\": false,\n    \"path\": [\n      \"limit\"\n    ],\n    \"message\": \"Too small: expected number to be >0\"\n  }\n]</tool_use_error>"
    );
    let r = run(dir.path(), json!({"file_path": path, "offset": 2.5})).await;
    assert_eq!(
        string_content(&r),
        "<tool_use_error>InputValidationError: Read failed due to the following issue:\nThe parameter `offset` type is expected as `int` but provided as `number`</tool_use_error>"
    );
    let r = run(dir.path(), json!({"file_path": path, "pages": "abc"})).await;
    assert_eq!(
        string_content(&r),
        "<tool_use_error>Invalid pages parameter: \"abc\". Use formats like \"1-5\", \"3\", or \"10-20\". Pages are 1-indexed.</tool_use_error>"
    );
    for pages in ["1-30", "11-"] {
        let r = run(dir.path(), json!({"file_path": path, "pages": pages})).await;
        assert_eq!(
            string_content(&r),
            format!("<tool_use_error>Page range \"{pages}\" exceeds maximum of 20 pages per request. Please use a smaller range.</tool_use_error>")
        );
    }
    let r = run(
        dir.path(),
        json!({"file_path": dir.path().join("x.zip").to_string_lossy()}),
    )
    .await;
    assert_eq!(
        string_content(&r),
        "<tool_use_error>This tool cannot read binary files. The file appears to be a binary .zip file. Please use appropriate tools for binary file analysis.</tool_use_error>"
    );
    let r = run(dir.path(), json!({"file_path": "/dev/tty"})).await;
    assert_eq!(
        string_content(&r),
        "<tool_use_error>Cannot read '/dev/tty': this device file would block or produce infinite output.</tool_use_error>"
    );
    assert_eq!(
        tur(&r),
        json!("Error: Cannot read '/dev/tty': this device file would block or produce infinite output.")
    );
}

#[tokio::test]
async fn directory_and_permission_errors_are_node_style() {
    let dir = tempfile::tempdir().unwrap();
    let r = run(
        dir.path(),
        json!({"file_path": dir.path().to_string_lossy()}),
    )
    .await;
    assert_eq!(
        string_content(&r),
        format!(
            "EISDIR: illegal operation on a directory, read '{}'",
            dir.path().display()
        )
    );
    // Sem permissão de leitura (não vale como root).
    let locked = dir.path().join("noperm.txt");
    std::fs::write(&locked, "x").unwrap();
    use std::os::unix::fs::PermissionsExt;
    std::fs::set_permissions(&locked, std::fs::Permissions::from_mode(0o000)).unwrap();
    if std::fs::read(&locked).is_err() {
        let r = run(dir.path(), json!({"file_path": locked.to_string_lossy()})).await;
        assert_eq!(
            string_content(&r),
            format!("EACCES: permission denied, open '{}'", locked.display())
        );
    }
}

#[tokio::test]
async fn rereading_an_unchanged_file_returns_the_stub() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("notas.md");
    std::fs::write(&file, "um\n").unwrap();
    let path = file.to_string_lossy().to_string();
    let ctx = context(dir.path());
    let file_state = std::sync::Arc::clone(&ctx.file_state);
    let first = run_with(ctx, json!({"file_path": path})).await;
    assert!(!first.result.is_error);
    let ctx = ToolContext {
        file_state,
        ..context(dir.path())
    };
    let second = run_with(ctx, json!({"file_path": path})).await;
    let dash = char::from_u32(0x2014).unwrap();
    assert_eq!(
        string_content(&second),
        format!("File unchanged since last read. The content from the earlier Read tool_result in this conversation is still current {dash} refer to that instead of re-reading.")
    );
    assert_eq!(
        tur(&second),
        json!({"type": "file_unchanged", "file": {"filePath": path}})
    );
}

#[tokio::test]
async fn mitigation_is_skipped_for_the_exempt_model() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("a.txt");
    std::fs::write(&file, "x").unwrap();
    let ctx = ToolContext {
        main_model: Some("claude-opus-4-6".to_string()),
        ..context(dir.path())
    };
    let r = run_with(ctx, json!({"file_path": file.to_string_lossy()})).await;
    assert_eq!(string_content(&r), "1\tx");
}

#[tokio::test]
async fn small_image_is_an_image_block_with_dimensions() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("small.png");
    let bytes = png(50, 40);
    std::fs::write(&file, &bytes).unwrap();
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert!(!r.result.is_error);
    use base64::Engine;
    let expected_b64 = base64::engine::general_purpose::STANDARD.encode(&bytes);
    match &r.result.content[..] {
        [ToolResultContent::Image { data, media_type }] => {
            assert_eq!(media_type, "image/png");
            assert_eq!(data, &expected_b64);
        }
        other => panic!("esperava um bloco de imagem: {other:?}"),
    }
    assert!(matches!(
        r.result.to_api_payload(),
        ToolResultPayload::Blocks(_)
    ));
    assert_eq!(
        serde_json::to_string(&tur(&r)).unwrap(),
        serde_json::to_string(&json!({"type": "image", "file": {"base64": expected_b64, "type": "image/png", "originalSize": bytes.len(), "dimensions": {"originalWidth": 50, "originalHeight": 40, "displayWidth": 50, "displayHeight": 40}}})).unwrap()
    );
    assert!(r.result.new_messages.is_empty());
}

#[tokio::test]
async fn wide_image_is_resized_with_the_metadata_note() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("wide.png");
    std::fs::write(&file, png(3000, 600)).unwrap();
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert!(!r.result.is_error);
    assert_eq!(
        tur(&r)["file"]["dimensions"],
        json!({"originalWidth": 3000, "originalHeight": 600, "displayWidth": 2000, "displayHeight": 400})
    );
    assert_eq!(r.result.new_messages.len(), 1);
    match &r.result.new_messages[0].content[..] {
        [ContentBlock::Text { text, .. }] => assert_eq!(
            text,
            "[Image: original 3000x600, displayed at 2000x400. Multiply coordinates by 1.50 to map to original image.]"
        ),
        other => panic!("esperava a nota de imagem: {other:?}"),
    }
}

#[tokio::test]
async fn small_pdf_goes_as_a_document_meta_message() {
    if !has_poppler() {
        return;
    }
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("small.pdf");
    let bytes = pdf(2);
    std::fs::write(&file, &bytes).unwrap();
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert!(!r.result.is_error, "{:?}", r.result);
    assert_eq!(
        string_content(&r),
        format!(
            "PDF file read: {} ({})",
            file.display(),
            rust_agent_sdk::tools::framework::format_file_size(bytes.len() as u64)
        )
    );
    use base64::Engine;
    let b64 = base64::engine::general_purpose::STANDARD.encode(&bytes);
    assert_eq!(
        serde_json::to_string(&tur(&r)).unwrap(),
        serde_json::to_string(&json!({"type": "pdf", "file": {"filePath": file.to_string_lossy(), "base64": b64, "originalSize": bytes.len()}})).unwrap()
    );
    assert_eq!(r.result.new_messages.len(), 1);
    let block = serde_json::to_value(&r.result.new_messages[0].content[0]).unwrap();
    assert_eq!(
        block,
        json!({"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": b64}})
    );
}

#[tokio::test]
async fn pdf_over_ten_pages_needs_the_pages_parameter() {
    if !has_poppler() {
        return;
    }
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("many.pdf");
    std::fs::write(&file, pdf(12)).unwrap();
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert_eq!(
        string_content(&r),
        "This PDF has 12 pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: \"1-5\"). Maximum 20 pages per request."
    );

    let r = run(
        dir.path(),
        json!({"file_path": file.to_string_lossy(), "pages": "2-3"}),
    )
    .await;
    assert!(!r.result.is_error, "{:?}", r.result);
    let size = std::fs::metadata(&file).unwrap().len();
    assert_eq!(
        string_content(&r),
        format!(
            "PDF pages extracted: 2 page(s) from {} ({})",
            file.display(),
            rust_agent_sdk::tools::framework::format_file_size(size)
        )
    );
    let data = tur(&r);
    assert_eq!(data["type"], "parts");
    assert_eq!(data["file"]["count"], 2);
    let keys: Vec<&String> = data["file"].as_object().unwrap().keys().collect();
    assert_eq!(keys, vec!["filePath", "originalSize", "outputDir", "count"]);
    let output_dir = data["file"]["outputDir"].as_str().unwrap();
    assert!(output_dir.starts_with(
        &dir.path()
            .join(".tool-results")
            .join("pdf-")
            .to_string_lossy()
            .to_string()
    ));
    assert_eq!(r.result.new_messages.len(), 1);
    let images: Vec<Value> = r.result.new_messages[0]
        .content
        .iter()
        .map(|b| serde_json::to_value(b).unwrap())
        .collect();
    assert_eq!(images.len(), 2);
    for image in images {
        assert_eq!(image["type"], "image");
        assert_eq!(image["source"]["media_type"], "image/jpeg");
    }
}

#[tokio::test]
async fn reading_outside_the_working_directory_asks_permission() {
    let dir = tempfile::tempdir().unwrap();
    let outside = tempfile::tempdir().unwrap();
    let file = outside.path().join("fora.txt");
    std::fs::write(&file, "x").unwrap();
    // Sem callback, o `ask` vira recusa com a mensagem do pedido.
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert!(r.denied);
    assert_eq!(
        string_content(&r),
        format!(
            "Claude requested permissions to read from {}, but you haven't granted it yet.",
            file.display()
        )
    );
    // Em bypass, lê.
    let ctx = ToolContext {
        permission_mode: PermissionMode::BypassPermissions,
        ..context(dir.path())
    };
    let r = run_with(ctx, json!({"file_path": file.to_string_lossy()})).await;
    assert!(!r.result.is_error);
}

#[tokio::test]
async fn notebook_cells_become_blocks() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("nb.ipynb");
    let notebook = json!({
        "metadata": {"language_info": {"name": "python"}},
        "cells": [
            {"cell_type": "markdown", "id": "m1", "source": ["# Titulo"]},
            {"cell_type": "code", "id": "c1", "execution_count": 3, "source": "print(1)",
             "outputs": [
                {"output_type": "stream", "text": ["1\n"]},
                {"output_type": "desconhecido"}
             ]}
        ]
    });
    std::fs::write(&file, notebook.to_string()).unwrap();
    let r = run(dir.path(), json!({"file_path": file.to_string_lossy()})).await;
    assert!(!r.result.is_error, "{:?}", r.result);
    match &r.result.content[..] {
        [ToolResultContent::Text(t)] => assert_eq!(
            t,
            "<cell id=\"m1\"><cell_type>markdown</cell_type># Titulo</cell id=\"m1\">\n<cell id=\"c1\">print(1)</cell id=\"c1\">\n\n1\n"
        ),
        other => panic!("esperava um texto: {other:?}"),
    }
    let data = tur(&r);
    assert_eq!(data["type"], "notebook");
    assert_eq!(
        data["file"]["cells"][1],
        json!({"cellType": "code", "source": "print(1)", "execution_count": 3, "cell_id": "c1", "language": "python", "outputs": [{"output_type": "stream", "text": "1\n"}, null]})
    );
}
