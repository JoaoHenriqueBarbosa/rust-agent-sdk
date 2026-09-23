//! Análise léxica de comandos de shell para o Bash, na medida do que o CLI
//! usa: separar subcomandos e operadores (`splitCommandWithOperators` e
//! `splitCommand_DEPRECATED` de `utils/bash/commands/isStaticRedirectTarget.js`),
//! tirar redirecionamentos de saída (`extractOutputRedirections`), e as
//! heurísticas do `BashTool` que dependem disso (`isSilentBashCommand`,
//! `interpretCommandResult`, `isAutobackgroundingAllowed`).
//!
//! O CLI usa o `shell-quote` (e, quando disponível, tree-sitter); aqui o
//! lexer reconhece aspas simples e duplas, escapes, `$(...)`, crases e os
//! operadores de controle e redirecionamento. Comando que o lexer não
//! entende (aspas sem fechar) volta como erro, e quem chama trata como o JS
//! trata comando malformado: pede permissão.

/// Um pedaço do comando: palavra (com as aspas originais) ou operador.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) enum Token {
    Word(String),
    Op(String),
    /// Quebra de linha fora de aspas (separa comandos como `;`).
    Newline,
}

const OPERATORS: &[&str] = &[
    "&&", "||", ";;", "|&", ">>", ">&", "<&", "<<", "&>", ">|", "|", "&", ";", ">", "<", "(", ")",
];

/// Quebra o comando em palavras e operadores.
pub(crate) fn tokenize(command: &str) -> Result<Vec<Token>, String> {
    let chars: Vec<char> = command.chars().collect();
    let mut tokens: Vec<Token> = Vec::new();
    let mut word = String::new();
    let mut in_word = false;
    let mut i = 0usize;
    let flush = |word: &mut String, in_word: &mut bool, tokens: &mut Vec<Token>| {
        if *in_word {
            tokens.push(Token::Word(std::mem::take(word)));
            *in_word = false;
        }
    };
    while i < chars.len() {
        let c = chars[i];
        match c {
            '\\' => {
                if i + 1 < chars.len() && chars[i + 1] == '\n' {
                    // Continuação de linha.
                    i += 2;
                    continue;
                }
                word.push(c);
                if i + 1 < chars.len() {
                    word.push(chars[i + 1]);
                }
                in_word = true;
                i += 2;
            }
            '\'' => {
                let start = i;
                i += 1;
                while i < chars.len() && chars[i] != '\'' {
                    i += 1;
                }
                if i >= chars.len() {
                    return Err("Unterminated single quote".to_string());
                }
                word.extend(&chars[start..=i]);
                in_word = true;
                i += 1;
            }
            '"' => {
                let start = i;
                i += 1;
                while i < chars.len() && chars[i] != '"' {
                    if chars[i] == '\\' {
                        i += 1;
                    }
                    i += 1;
                }
                if i >= chars.len() {
                    return Err("Unterminated double quote".to_string());
                }
                word.extend(&chars[start..=i]);
                in_word = true;
                i += 1;
            }
            '`' => {
                let start = i;
                i += 1;
                while i < chars.len() && chars[i] != '`' {
                    if chars[i] == '\\' {
                        i += 1;
                    }
                    i += 1;
                }
                if i >= chars.len() {
                    return Err("Unterminated backtick".to_string());
                }
                word.extend(&chars[start..=i]);
                in_word = true;
                i += 1;
            }
            '$' if i + 1 < chars.len() && chars[i + 1] == '(' => {
                // `$(...)` com aninhamento de parênteses.
                let start = i;
                let mut depth = 0i32;
                i += 1;
                while i < chars.len() {
                    match chars[i] {
                        '(' => depth += 1,
                        ')' => {
                            depth -= 1;
                            if depth == 0 {
                                break;
                            }
                        }
                        '\'' => {
                            i += 1;
                            while i < chars.len() && chars[i] != '\'' {
                                i += 1;
                            }
                        }
                        '"' => {
                            i += 1;
                            while i < chars.len() && chars[i] != '"' {
                                if chars[i] == '\\' {
                                    i += 1;
                                }
                                i += 1;
                            }
                        }
                        _ => {}
                    }
                    i += 1;
                }
                if i >= chars.len() {
                    return Err("Unterminated command substitution".to_string());
                }
                word.extend(&chars[start..=i]);
                in_word = true;
                i += 1;
            }
            '\n' => {
                flush(&mut word, &mut in_word, &mut tokens);
                tokens.push(Token::Newline);
                i += 1;
            }
            c if c.is_whitespace() => {
                flush(&mut word, &mut in_word, &mut tokens);
                i += 1;
            }
            '#' if !in_word => {
                // Comentário até o fim da linha.
                while i < chars.len() && chars[i] != '\n' {
                    i += 1;
                }
            }
            _ => {
                let rest: String = chars[i..chars.len().min(i + 2)].iter().collect();
                if let Some(op) = OPERATORS.iter().find(|op| rest.starts_with(**op)) {
                    // `2>` e `2>>`: o descritor numérico fica na palavra, como
                    // no shell-quote.
                    flush(&mut word, &mut in_word, &mut tokens);
                    tokens.push(Token::Op(op.to_string()));
                    i += op.chars().count();
                } else {
                    word.push(c);
                    in_word = true;
                    i += 1;
                }
            }
        }
    }
    flush(&mut word, &mut in_word, &mut tokens);
    Ok(tokens)
}

/// Operadores que separam comandos.
fn is_control(op: &str) -> bool {
    matches!(op, "&&" | "||" | "|" | "|&" | ";" | ";;" | "&")
}

/// `splitCommandWithOperators`: as palavras de cada comando juntadas com um
/// espaço, e os operadores como itens próprios. Comando malformado volta
/// inteiro, como no JS.
pub(crate) fn split_command_with_operators(command: &str) -> Vec<String> {
    let Ok(tokens) = tokenize(command) else {
        return vec![command.to_string()];
    };
    let mut parts: Vec<String> = Vec::new();
    let mut last_was_word = false;
    for token in tokens {
        match token {
            Token::Word(w) => {
                if last_was_word {
                    if let Some(last) = parts.last_mut() {
                        last.push(' ');
                        last.push_str(&w);
                    }
                } else {
                    parts.push(w);
                }
                last_was_word = true;
            }
            Token::Op(op) => {
                parts.push(op);
                last_was_word = false;
            }
            Token::Newline => {
                last_was_word = false;
            }
        }
    }
    parts
}

fn is_static_redirect_target(target: &str) -> bool {
    if target.is_empty() || target.starts_with('#') {
        return false;
    }
    if target
        .chars()
        .any(|c| c.is_whitespace() || c == '\'' || c == '"')
    {
        return false;
    }
    !target.starts_with('!')
        && !target.starts_with('=')
        && !target.starts_with('&')
        && !["$", "`", "*", "?", "[", "{", "~", "(", "<"]
            .iter()
            .any(|s| target.contains(s))
}

fn is_fd(s: &str) -> bool {
    matches!(s, "0" | "1" | "2")
}

/// `splitCommand_DEPRECATED`: só os comandos, sem os operadores de controle e
/// sem os redirecionamentos de saída para alvo estático (`> arquivo`,
/// `2>&1`).
pub(crate) fn split_command(command: &str) -> Vec<String> {
    let mut parts: Vec<Option<String>> = split_command_with_operators(command)
        .into_iter()
        .map(Some)
        .collect();
    let len = parts.len();
    for i in 0..len {
        let Some(part) = parts[i].clone() else {
            continue;
        };
        if part != ">&" && part != ">" && part != ">>" {
            continue;
        }
        let next = parts
            .get(i + 1)
            .cloned()
            .flatten()
            .map(|s| s.trim().to_string());
        let after = parts
            .get(i + 2)
            .cloned()
            .flatten()
            .map(|s| s.trim().to_string());
        let Some(next) = next else {
            continue;
        };
        let mut strip = false;
        let mut strip_third = false;
        let mut effective = next.clone();
        if (part == ">" || part == ">>")
            && next.len() >= 3
            && next.as_bytes()[next.len() - 2] == b' '
            && is_fd(&next[next.len() - 1..])
            && matches!(after.as_deref(), Some(">") | Some(">>") | Some(">&"))
        {
            effective = next[..next.len() - 2].to_string();
        }
        if part == ">" && next == "&" && after.as_deref().map(is_fd).unwrap_or(false) {
            strip = true;
            strip_third = true;
        } else if (part == ">&" && is_fd(&next))
            || (part == ">" && next.starts_with('&') && next.len() > 1 && is_fd(&next[1..]))
            || ((part == ">" || part == ">>") && is_static_redirect_target(&effective))
        {
            strip = true;
        }
        if strip {
            if i > 0 {
                if let Some(prev) = parts[i - 1].clone() {
                    let prev = prev.trim().to_string();
                    if prev.len() >= 3
                        && prev.as_bytes()[prev.len() - 2] == b' '
                        && is_fd(&prev[prev.len() - 1..])
                    {
                        parts[i - 1] = Some(prev[..prev.len() - 2].to_string());
                    }
                }
            }
            parts[i] = None;
            if i + 1 < len {
                parts[i + 1] = None;
            }
            if strip_third && i + 2 < len {
                parts[i + 2] = None;
            }
        }
    }
    parts
        .into_iter()
        .flatten()
        .filter(|p| !p.is_empty() && !is_control(p))
        .collect()
}

/// `extractOutputRedirections(...).commandWithoutRedirections`: o comando sem
/// os redirecionamentos de saída, na forma normalizada do lexer.
pub(crate) fn command_without_output_redirections(command: &str) -> String {
    let Ok(tokens) = tokenize(command) else {
        return command.to_string();
    };
    let mut out: Vec<String> = Vec::new();
    let mut skip_next = false;
    for token in tokens {
        match token {
            Token::Op(op) if matches!(op.as_str(), ">" | ">>" | ">&" | "&>" | ">|") => {
                skip_next = true;
                // `2>`: o descritor ficou na palavra anterior.
                if let Some(last) = out.last() {
                    if is_fd(last) {
                        out.pop();
                    }
                }
            }
            Token::Word(w) => {
                if skip_next {
                    skip_next = false;
                    continue;
                }
                out.push(w);
            }
            Token::Op(op) => {
                skip_next = false;
                out.push(op);
            }
            Token::Newline => out.push("\n".to_string()),
        }
    }
    out.join(" ").replace(" \n ", "\n").trim().to_string()
}

/// Se o comando tem redirecionamento de saída ou substituição de comando, o
/// que impede tratá-lo como leitura pura.
pub(crate) fn has_write_or_substitution(command: &str) -> bool {
    let Ok(tokens) = tokenize(command) else {
        return true;
    };
    tokens.iter().any(|t| match t {
        Token::Op(op) => matches!(
            op.as_str(),
            ">" | ">>" | ">&" | "&>" | ">|" | "<<" | "(" | ")"
        ),
        Token::Word(w) => {
            w.contains("$(") || w.contains('`') || w.contains("<(") || w.contains(">(")
        }
        Token::Newline => false,
    })
}

/// As palavras de um comando simples, sem as aspas externas (para ler
/// argumentos).
pub(crate) fn words(command: &str) -> Vec<String> {
    match tokenize(command) {
        Ok(tokens) => tokens
            .into_iter()
            .filter_map(|t| match t {
                Token::Word(w) => Some(unquote(&w)),
                _ => None,
            })
            .collect(),
        Err(_) => command.split_whitespace().map(str::to_string).collect(),
    }
}

fn unquote(word: &str) -> String {
    let mut out = String::new();
    let chars: Vec<char> = word.chars().collect();
    let mut i = 0;
    while i < chars.len() {
        match chars[i] {
            '\'' => {
                i += 1;
                while i < chars.len() && chars[i] != '\'' {
                    out.push(chars[i]);
                    i += 1;
                }
                i += 1;
            }
            '"' => {
                i += 1;
                while i < chars.len() && chars[i] != '"' {
                    if chars[i] == '\\' && i + 1 < chars.len() {
                        i += 1;
                    }
                    out.push(chars[i]);
                    i += 1;
                }
                i += 1;
            }
            '\\' if i + 1 < chars.len() => {
                out.push(chars[i + 1]);
                i += 2;
            }
            c => {
                out.push(c);
                i += 1;
            }
        }
    }
    out
}

const SEMANTIC_NEUTRAL: &[&str] = &["echo", "printf", "true", "false", ":"];
const SILENT: &[&str] = &[
    "mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp", "touch", "ln", "cd", "export",
    "unset", "wait",
];

/// `isSilentBashCommand`: comando que normalmente não imprime nada.
pub(crate) fn is_silent_command(command: &str) -> bool {
    let parts = split_command_with_operators(command);
    if parts.is_empty() {
        return false;
    }
    let mut has_non_fallback = false;
    let mut last_operator: Option<String> = None;
    let mut skip_next = false;
    for part in parts {
        if skip_next {
            skip_next = false;
            continue;
        }
        if part == ">" || part == ">>" || part == ">&" {
            skip_next = true;
            continue;
        }
        if matches!(part.as_str(), "||" | "&&" | "|" | ";") {
            last_operator = Some(part);
            continue;
        }
        let Some(base) = part.split_whitespace().next() else {
            continue;
        };
        if last_operator.as_deref() == Some("||") && SEMANTIC_NEUTRAL.contains(&base) {
            continue;
        }
        has_non_fallback = true;
        if !SILENT.contains(&base) {
            return false;
        }
    }
    has_non_fallback
}

/// `interpretCommandResult`: se o código de saída é erro, e a interpretação
/// dos códigos com significado próprio (grep, diff, test...), olhando o
/// último comando da linha.
pub(crate) fn interpret_command_result(command: &str, exit_code: i32) -> (bool, Option<String>) {
    let segments = split_command(command);
    let last = segments
        .last()
        .cloned()
        .unwrap_or_else(|| command.to_string());
    let base = last
        .split_whitespace()
        .next()
        .unwrap_or_default()
        .to_string();
    let special = match base.as_str() {
        "grep" | "rg" => Some("No matches found"),
        "find" => Some("Some directories were inaccessible"),
        "diff" => Some("Files differ"),
        "test" | "[" => Some("Condition is false"),
        _ => None,
    };
    match special {
        Some(message) => (
            exit_code >= 2,
            if exit_code == 1 {
                Some(message.to_string())
            } else {
                None
            },
        ),
        None => (
            exit_code != 0,
            if exit_code != 0 {
                Some(format!("Command failed with exit code {exit_code}"))
            } else {
                None
            },
        ),
    }
}

/// `isAutobackgroundingAllowed`: só o `sleep` puro não vai para o
/// background quando estoura o tempo.
pub(crate) fn is_autobackgrounding_allowed(command: &str) -> bool {
    let parts = split_command(command);
    match parts.first().map(|p| p.trim().to_string()) {
        None => true,
        Some(base) if base.is_empty() => true,
        Some(base) => base != "sleep",
    }
}

/// `isNormalizedCdCommand`.
pub(crate) fn is_cd_command(command: &str) -> bool {
    let trimmed = command.trim();
    trimmed == "cd" || trimmed.starts_with("cd ")
}

/// `isNormalizedGitCommand`.
pub(crate) fn is_git_command(command: &str) -> bool {
    let trimmed = command.trim();
    trimmed == "git" || trimmed.starts_with("git ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn splits_on_control_operators_and_keeps_quotes() {
        assert_eq!(
            split_command("git status && echo 'a && b' | wc -l; ls"),
            vec!["git status", "echo 'a && b'", "wc -l", "ls"]
        );
    }

    #[test]
    fn static_redirections_are_dropped_from_commands() {
        assert_eq!(split_command("echo hi > out.txt 2>&1"), vec!["echo hi"]);
        assert_eq!(split_command("cat a >> b"), vec!["cat a"]);
    }

    #[test]
    fn unterminated_quote_is_an_error() {
        assert!(tokenize("echo 'oi").is_err());
    }

    #[test]
    fn silent_commands_follow_the_cli() {
        assert!(is_silent_command("mkdir -p x"));
        assert!(is_silent_command("cd sub"));
        assert!(is_silent_command("rm x || true"));
        assert!(!is_silent_command("ls"));
        assert!(!is_silent_command("mkdir x && ls"));
    }

    #[test]
    fn command_semantics_follow_the_cli() {
        assert_eq!(
            interpret_command_result("grep zzz a.txt", 1),
            (false, Some("No matches found".to_string()))
        );
        assert_eq!(
            interpret_command_result("exit 3", 3),
            (true, Some("Command failed with exit code 3".to_string()))
        );
        assert!(interpret_command_result("cat x | grep y", 2).0);
    }

    #[test]
    fn only_bare_sleep_blocks_autobackground() {
        assert!(!is_autobackgrounding_allowed("sleep"));
        assert!(is_autobackgrounding_allowed("sleep 3"));
        assert!(is_autobackgrounding_allowed("npm test"));
    }

    #[test]
    fn redirections_are_removed_for_rule_matching() {
        assert_eq!(
            command_without_output_redirections("npm test > log.txt"),
            "npm test"
        );
        assert_eq!(command_without_output_redirections("ls 2> /dev/null"), "ls");
    }
}
