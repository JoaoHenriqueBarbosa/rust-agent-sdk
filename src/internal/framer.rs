//! Enquadramento de frames stream-json: uma linha, um objeto JSON.
//!
//! Esta é a semântica que o `SubprocessCLITransport` sempre teve, extraída para
//! um tipo próprio porque ela NÃO é específica de subprocess: qualquer
//! transporte que receba o protocolo por um fluxo de bytes precisa exatamente
//! das mesmas regras, e reimplementá-las de fora é copiar bug por bug.
//!
//! As regras, e por que cada uma existe:
//!
//! 1. **Um objeto por linha.** O protocolo manda um JSON completo por linha.
//! 2. **Objeto partido ao meio é bufferizado.** Uma linha que não fecha sozinha
//!    continua na próxima. Só linha que começa com `{` entra nesse buffer:
//!    linhas de debug do CLI começam com `[` e nunca completam, e bufferizá-las
//!    envenenava o parser e engolia todas as mensagens seguintes.
//! 3. **Linha que não é JSON é descartada**, não é erro. O CLI escreve ruído.
//! 4. **Teto de buffer.** Objeto que passa do teto vira erro em vez de crescer
//!    sem limite.
//! 5. **Os bytes parciais vivem no framer**, nunca na stack de uma future. Uma
//!    leitura cancelada no meio de uma linha (perder um `select!` para um
//!    sinal de interrupção, por exemplo) não pode perder o que já leu.
//!
//! Dois modos de alimentar, conforme a forma da fonte:
//!
//! - Fonte que é `AsyncBufRead` (stdout de subprocess): use
//!   [`JsonLineFramer::line_buffer`] como destino de `read_until(b'\n', ..)` e
//!   depois [`JsonLineFramer::take_line`]. É o caminho que preserva a regra 5,
//!   porque `read_until` acrescenta incrementalmente no buffer do chamador.
//! - Fonte que entrega pedaços soltos (o stream de um `docker exec`, um
//!   WebSocket, um canal): use [`JsonLineFramer::push_chunk`], que corta nos
//!   newlines e devolve os objetos completos daquele pedaço.
//!
//! Os dois modos compartilham o mesmo estado e podem até ser alternados.

use serde_json::Value;

use crate::errors::{ClaudeSDKError, Result};

/// Enquadrador de frames stream-json.
///
/// Veja a documentação do módulo para as regras e para os dois modos de uso.
#[derive(Debug)]
pub struct JsonLineFramer {
    /// A linha em construção. Vive aqui, e não na stack de uma future, para
    /// sobreviver a cancelamento no meio da leitura (regra 5).
    line: Vec<u8>,
    /// Acumula um objeto JSON partido entre linhas (regra 2).
    json_buffer: String,
    max_buffer_size: usize,
}

impl JsonLineFramer {
    /// Cria um enquadrador com o teto de buffer informado, em bytes.
    #[must_use]
    pub fn new(max_buffer_size: usize) -> Self {
        Self {
            line: Vec::new(),
            json_buffer: String::new(),
            max_buffer_size,
        }
    }

    /// O buffer da linha em construção, para ser usado como destino de
    /// `AsyncBufReadExt::read_until(b'\n', ..)`.
    ///
    /// `read_until` e não `read_line`, de propósito: o primeiro acrescenta no
    /// buffer do chamador conforme os bytes chegam (o parcial sobrevive ao
    /// cancelamento), o segundo move a `String` para dentro da future e a
    /// descarta junto.
    pub fn line_buffer(&mut self) -> &mut Vec<u8> {
        &mut self.line
    }

    /// Se não há bytes de linha pendentes. Junto com `bytes_read == 0`, é como
    /// o chamador reconhece um EOF limpo.
    #[must_use]
    pub fn line_is_empty(&self) -> bool {
        self.line.is_empty()
    }

    /// Consome a linha que está no buffer e devolve o objeto, se ela fechou um.
    ///
    /// `Ok(None)` quer dizer "ainda não": linha vazia, ruído descartado, ou
    /// objeto incompleto que continua na próxima linha. O chamador segue lendo.
    pub fn take_line(&mut self) -> Result<Option<Value>> {
        let raw = std::mem::take(&mut self.line);
        let line = String::from_utf8_lossy(&raw);
        let trimmed = line.trim();
        if trimmed.is_empty() {
            return Ok(None);
        }

        if self.json_buffer.is_empty() {
            // Ruído do CLI (regra 3). `[` passa porque um array é JSON válido;
            // o que ele não pode é entrar no buffer de continuação (regra 2).
            if !trimmed.starts_with('{') && !trimmed.starts_with('[') {
                return Ok(None);
            }
            match serde_json::from_str::<Value>(trimmed) {
                Ok(val) => return Ok(Some(val)),
                Err(_) => {
                    if trimmed.starts_with('{') {
                        self.json_buffer.push_str(trimmed);
                    }
                }
            }
        } else {
            self.json_buffer.push_str(trimmed);

            if self.json_buffer.len() > self.max_buffer_size {
                let _discarded = std::mem::take(&mut self.json_buffer);
                return Err(ClaudeSDKError::sdk(format!(
                    "JSON buffer exceeded maximum buffer size of {} bytes",
                    self.max_buffer_size
                )));
            }

            if let Ok(val) = serde_json::from_str::<Value>(&self.json_buffer) {
                self.json_buffer.clear();
                return Ok(Some(val));
            }
        }

        Ok(None)
    }

    /// Alimenta um pedaço arbitrário de bytes e devolve os objetos que ele
    /// fechou, em ordem. O resto (linha sem newline) fica pendente para o
    /// próximo pedaço.
    ///
    /// É o caminho para fontes que não são `AsyncBufRead`, como o stream
    /// multiplexado de um `docker exec` ou frames de WebSocket.
    pub fn push_chunk(&mut self, chunk: &[u8]) -> Result<Vec<Value>> {
        let mut out = Vec::new();
        let mut rest = chunk;
        while let Some(pos) = rest.iter().position(|b| *b == b'\n') {
            self.line.extend_from_slice(&rest[..=pos]);
            if let Some(val) = self.take_line()? {
                out.push(val);
            }
            rest = &rest[pos + 1..];
        }
        self.line.extend_from_slice(rest);
        Ok(out)
    }

    /// No EOF: devolve o objeto que ficou no buffer de continuação, se ele for
    /// parseável.
    ///
    /// Não toca na linha pendente, porque no caminho `read_until` a linha final
    /// sem newline já passou por [`Self::take_line`] antes do EOF ser
    /// reconhecido. Quem usa [`Self::push_chunk`] deve chamar
    /// [`Self::finish`], que trata os dois.
    pub fn flush_pending(&mut self) -> Option<Value> {
        if self.json_buffer.is_empty() {
            return None;
        }
        let buf = std::mem::take(&mut self.json_buffer);
        serde_json::from_str::<Value>(&buf).ok()
    }

    /// No EOF de uma fonte alimentada por [`Self::push_chunk`]: processa a
    /// linha final sem newline e depois o buffer de continuação.
    pub fn finish(&mut self) -> Result<Vec<Value>> {
        let mut out = Vec::new();
        if !self.line.is_empty() {
            if let Some(val) = self.take_line()? {
                out.push(val);
            }
        }
        if let Some(val) = self.flush_pending() {
            out.push(val);
        }
        Ok(out)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const MAX: usize = 1024 * 1024;

    fn framer() -> JsonLineFramer {
        JsonLineFramer::new(MAX)
    }

    #[test]
    fn chunk_com_uma_linha_completa() {
        let mut f = framer();
        let out = f.push_chunk(b"{\"type\":\"user\"}\n").unwrap();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["type"], "user");
    }

    #[test]
    fn varios_objetos_no_mesmo_chunk() {
        let mut f = framer();
        let out = f.push_chunk(b"{\"n\":1}\n{\"n\":2}\n{\"n\":3}\n").unwrap();
        assert_eq!(out.len(), 3);
        assert_eq!(out[2]["n"], 3);
    }

    /// O caso que motiva o tipo: o `docker exec` corta onde quiser, inclusive
    /// no meio de um escape de UTF-8 ou no meio de uma chave.
    #[test]
    fn objeto_partido_entre_chunks() {
        let mut f = framer();
        assert!(f.push_chunk(b"{\"type\":\"assis").unwrap().is_empty());
        assert!(f.push_chunk(b"tant\",\"x\":").unwrap().is_empty());
        let out = f.push_chunk(b"42}\n").unwrap();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["type"], "assistant");
        assert_eq!(out[0]["x"], 42);
    }

    #[test]
    fn objeto_partido_entre_linhas_com_newline_no_meio() {
        let mut f = framer();
        assert!(f.push_chunk(b"{\"type\":\"user\",\n").unwrap().is_empty());
        let out = f.push_chunk(b"\"ok\":true}\n").unwrap();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["ok"], true);
    }

    #[test]
    fn ruido_nao_json_e_descartado_sem_envenenar() {
        let mut f = framer();
        let out = f
            .push_chunk(b"[SandboxDebug] algo\nlixo solto\n{\"n\":7}\n")
            .unwrap();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["n"], 7);
    }

    /// A regressão que o comentário da regra 2 registra: linha começando com
    /// `[` que não fecha não pode entrar no buffer de continuação, senão tudo
    /// que vem depois é engolido.
    #[test]
    fn colchete_incompleto_nao_entra_no_buffer() {
        let mut f = framer();
        let out = f
            .push_chunk(b"[SandboxDebug incompleto\n{\"n\":1}\n")
            .unwrap();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["n"], 1);
    }

    #[test]
    fn linhas_vazias_sao_ignoradas() {
        let mut f = framer();
        let out = f.push_chunk(b"\n\n{\"n\":1}\n\n").unwrap();
        assert_eq!(out.len(), 1);
    }

    #[test]
    fn teto_de_buffer_vira_erro() {
        let mut f = JsonLineFramer::new(64);
        // Abre um objeto e continua enchendo sem fechar.
        assert!(f.push_chunk(b"{\"a\":\"aaaa\n").unwrap().is_empty());
        let mut err = None;
        for _ in 0..20 {
            if let Err(e) = f.push_chunk(b"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n") {
                err = Some(e);
                break;
            }
        }
        assert!(err.is_some(), "o teto de buffer deveria ter estourado");
    }

    #[test]
    fn finish_entrega_a_linha_final_sem_newline() {
        let mut f = framer();
        assert!(f.push_chunk(b"{\"n\":9}").unwrap().is_empty());
        let out = f.finish().unwrap();
        assert_eq!(out.len(), 1);
        assert_eq!(out[0]["n"], 9);
    }

    #[test]
    fn finish_vazio_nao_inventa_frame() {
        let mut f = framer();
        assert!(f.finish().unwrap().is_empty());
    }

    /// O modo `read_until`: o chamador acrescenta no buffer e chama take_line.
    #[test]
    fn modo_line_buffer() {
        let mut f = framer();
        f.line_buffer().extend_from_slice(b"{\"n\":1}\n");
        assert_eq!(f.take_line().unwrap().unwrap()["n"], 1);
        assert!(f.line_is_empty());
    }

    /// Cancelamento no meio da linha: os bytes já lidos continuam no framer.
    #[test]
    fn parcial_sobrevive_entre_chamadas() {
        let mut f = framer();
        f.line_buffer().extend_from_slice(b"{\"n\":");
        assert!(!f.line_is_empty());
        f.line_buffer().extend_from_slice(b"1}\n");
        assert_eq!(f.take_line().unwrap().unwrap()["n"], 1);
    }
}
