//! Redimensionamento e compressão de imagem do Read, com a estratégia e os
//! limites de `utils/imageResizer.js` do CLI 2.1.90.
//!
//! O JS usa o sharp (libvips); aqui a crate `image` decodifica e codifica, e o
//! PNG com paleta (`png({ palette: true })`) é quantizado com NeuQuant
//! (`color_quant`) e gravado indexado pela crate `png`. Os bytes de saída não
//! são idênticos aos do sharp (codificadores diferentes), mas a DECISÃO é a
//! mesma em cada passo: quando manter o original, quando reduzir dimensão,
//! a ordem das tentativas (PNG com paleta, JPEG 80/60/40/20, JPEG 20 menor),
//! os limites e as mensagens de erro. O WebP é regravado sem perda, porque a
//! crate `image` não tem codificador WebP com perda.

use std::io::Cursor;

use image::{DynamicImage, GenericImageView, ImageFormat};
use serde_json::{json, Value};

use crate::tools::framework::format_file_size;

/// `API_IMAGE_MAX_BASE64_SIZE` de `constants/apiLimits.js`.
pub const API_IMAGE_MAX_BASE64_SIZE: usize = 5_242_880;
/// `IMAGE_TARGET_RAW_SIZE` de `constants/apiLimits.js`.
pub const IMAGE_TARGET_RAW_SIZE: usize = 3_932_160;
/// `IMAGE_MAX_WIDTH` de `constants/apiLimits.js`.
pub const IMAGE_MAX_WIDTH: u32 = 2000;
/// `IMAGE_MAX_HEIGHT` de `constants/apiLimits.js`.
pub const IMAGE_MAX_HEIGHT: u32 = 2000;

/// Dimensões da imagem para o mapeamento de coordenadas (`dimensions` do
/// resultado do Read).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ImageDimensions {
    pub original_width: u32,
    pub original_height: u32,
    pub display_width: u32,
    pub display_height: u32,
}

impl ImageDimensions {
    /// O objeto `dimensions` do JS, com as chaves na ordem dele.
    pub fn to_json(&self) -> Value {
        json!({
            "originalWidth": self.original_width,
            "originalHeight": self.original_height,
            "displayWidth": self.display_width,
            "displayHeight": self.display_height,
        })
    }
}

/// Resultado do `maybeResizeAndDownsampleImageBuffer`.
#[derive(Debug, Clone)]
pub struct ResizedImage {
    pub buffer: Vec<u8>,
    /// Formato sem o prefixo `image/` (`png`, `jpeg`, `gif`, `webp`).
    pub media_type: String,
    pub dimensions: Option<ImageDimensions>,
}

/// Resultado do `compressImageBuffer`.
#[derive(Debug, Clone)]
pub struct CompressedImage {
    pub base64: String,
    /// Media type completo (`image/png`).
    pub media_type: String,
    pub original_size: usize,
}

/// `ImageResizeError` do JS: vira a mensagem de erro do Read.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ImageResizeError(pub String);

impl std::fmt::Display for ImageResizeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

impl std::error::Error for ImageResizeError {}

/// `detectImageFormatFromBuffer`: o media type pelos magic bytes, com PNG
/// como default (como o JS).
pub fn detect_image_format_from_buffer(buffer: &[u8]) -> &'static str {
    if buffer.len() < 4 {
        return "image/png";
    }
    if buffer[..4] == [137, 80, 78, 71] {
        return "image/png";
    }
    if buffer[..3] == [255, 216, 255] {
        return "image/jpeg";
    }
    if buffer[..3] == [71, 73, 70] {
        return "image/gif";
    }
    if buffer[..4] == [82, 73, 70, 70] && buffer.len() >= 12 && buffer[8..12] == [87, 69, 66, 80] {
        return "image/webp";
    }
    "image/png"
}

fn base64_encode(bytes: &[u8]) -> String {
    use base64::Engine;
    base64::engine::general_purpose::STANDARD.encode(bytes)
}

/// Os formatos que o Read processa (o `metadata.format` do sharp).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Format {
    Png,
    Jpeg,
    Gif,
    Webp,
}

impl Format {
    fn name(&self) -> &'static str {
        match self {
            Format::Png => "png",
            Format::Jpeg => "jpeg",
            Format::Gif => "gif",
            Format::Webp => "webp",
        }
    }

    fn from_image_format(f: ImageFormat) -> Option<Self> {
        match f {
            ImageFormat::Png => Some(Format::Png),
            ImageFormat::Jpeg => Some(Format::Jpeg),
            ImageFormat::Gif => Some(Format::Gif),
            ImageFormat::WebP => Some(Format::Webp),
            _ => None,
        }
    }

    fn from_name(name: &str) -> Option<Self> {
        match name {
            "png" => Some(Format::Png),
            "jpeg" | "jpg" => Some(Format::Jpeg),
            "gif" => Some(Format::Gif),
            "webp" => Some(Format::Webp),
            _ => None,
        }
    }
}

/// Como gravar a imagem.
#[derive(Debug, Clone, Copy)]
enum Encoding {
    /// O `toBuffer()` sem opção: o formato de entrada com os defaults do
    /// sharp (PNG nível 6, JPEG qualidade 80).
    Default(Format),
    /// `png({ compressionLevel: 9, palette: true, colors })`.
    PalettePng(usize),
    /// `jpeg({ quality })`.
    Jpeg(u8),
    /// `webp({ quality: 80 })`: sem perda aqui (ver doc do módulo).
    Webp,
}

/// O `resize(w, h, { fit: "inside", withoutEnlargement: true })` do sharp.
fn fit_inside(width: u32, height: u32, box_w: u32, box_h: u32) -> (u32, u32) {
    if width <= box_w && height <= box_h {
        return (width, height);
    }
    let scale = (box_w as f64 / width as f64).min(box_h as f64 / height as f64);
    let w = ((width as f64 * scale).round() as u32).max(1);
    let h = ((height as f64 * scale).round() as u32).max(1);
    (w, h)
}

fn resize_inside(img: &DynamicImage, box_w: u32, box_h: u32) -> DynamicImage {
    let (w, h) = img.dimensions();
    let (nw, nh) = fit_inside(w, h, box_w, box_h);
    if (nw, nh) == (w, h) {
        img.clone()
    } else {
        img.resize_exact(nw, nh, image::imageops::FilterType::Lanczos3)
    }
}

fn encode_palette_png(img: &DynamicImage, colors: usize) -> Result<Vec<u8>, String> {
    let rgba = img.to_rgba8();
    let (w, h) = rgba.dimensions();
    let raw = rgba.as_raw();
    let quant = color_quant::NeuQuant::new(10, colors, raw);
    let map = quant.color_map_rgba();
    let mut palette: Vec<u8> = Vec::with_capacity(map.len() / 4 * 3);
    let mut trns: Vec<u8> = Vec::with_capacity(map.len() / 4);
    for entry in map.chunks(4) {
        palette.extend_from_slice(&entry[..3]);
        trns.push(entry[3]);
    }
    let indices: Vec<u8> = raw.chunks(4).map(|p| quant.index_of(p) as u8).collect();
    let mut out: Vec<u8> = Vec::new();
    {
        let mut encoder = png::Encoder::new(&mut out, w, h);
        encoder.set_color(png::ColorType::Indexed);
        encoder.set_depth(png::BitDepth::Eight);
        encoder.set_palette(palette);
        if trns.iter().any(|a| *a != 255) {
            encoder.set_trns(trns);
        }
        encoder.set_compression(png::Compression::High);
        let mut writer = encoder.write_header().map_err(|e| e.to_string())?;
        writer
            .write_image_data(&indices)
            .map_err(|e| e.to_string())?;
        writer.finish().map_err(|e| e.to_string())?;
    }
    Ok(out)
}

fn encode(img: &DynamicImage, encoding: Encoding) -> Result<Vec<u8>, String> {
    let mut out = Cursor::new(Vec::new());
    match encoding {
        Encoding::PalettePng(colors) => return encode_palette_png(img, colors),
        Encoding::Jpeg(quality) => {
            let rgb = DynamicImage::ImageRgb8(img.to_rgb8());
            let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, quality);
            rgb.write_with_encoder(encoder).map_err(|e| e.to_string())?;
        }
        Encoding::Webp | Encoding::Default(Format::Webp) => {
            let rgba = DynamicImage::ImageRgba8(img.to_rgba8());
            let encoder = image::codecs::webp::WebPEncoder::new_lossless(&mut out);
            rgba.write_with_encoder(encoder)
                .map_err(|e| e.to_string())?;
        }
        Encoding::Default(Format::Jpeg) => return encode(img, Encoding::Jpeg(80)),
        Encoding::Default(Format::Png) => {
            let encoder = image::codecs::png::PngEncoder::new_with_quality(
                &mut out,
                image::codecs::png::CompressionType::Level(6),
                image::codecs::png::FilterType::Adaptive,
            );
            img.write_with_encoder(encoder).map_err(|e| e.to_string())?;
        }
        Encoding::Default(Format::Gif) => {
            let rgba = DynamicImage::ImageRgba8(img.to_rgba8());
            rgba.write_to(&mut out, ImageFormat::Gif)
                .map_err(|e| e.to_string())?;
        }
    }
    Ok(out.into_inner())
}

fn decode(buffer: &[u8]) -> Result<(DynamicImage, Option<Format>), String> {
    let format = image::guess_format(buffer)
        .ok()
        .and_then(Format::from_image_format);
    let img = image::load_from_memory(buffer).map_err(|e| e.to_string())?;
    Ok((img, format))
}

fn dims(ow: u32, oh: u32, dw: u32, dh: u32) -> Option<ImageDimensions> {
    Some(ImageDimensions {
        original_width: ow,
        original_height: oh,
        display_width: dw,
        display_height: dh,
    })
}

/// O corpo do `try` do `maybeResizeAndDownsampleImageBuffer`.
fn resize_inner(buffer: &[u8], original_size: usize, ext: &str) -> Result<ResizedImage, String> {
    let (img, format) = decode(buffer)?;
    let media_type = format.map(|f| f.name().to_string()).unwrap_or_else(|| {
        if ext == "jpg" {
            "jpeg".to_string()
        } else {
            ext.to_string()
        }
    });
    let fmt = format
        .or_else(|| Format::from_name(&media_type))
        .unwrap_or(Format::Png);
    let (original_width, original_height) = img.dimensions();
    if original_width == 0 || original_height == 0 {
        if original_size > IMAGE_TARGET_RAW_SIZE {
            return Ok(ResizedImage {
                buffer: encode(&img, Encoding::Jpeg(80))?,
                media_type: "jpeg".to_string(),
                dimensions: None,
            });
        }
        return Ok(ResizedImage {
            buffer: buffer.to_vec(),
            media_type,
            dimensions: None,
        });
    }
    let (mut width, mut height) = (original_width, original_height);
    if original_size <= IMAGE_TARGET_RAW_SIZE
        && width <= IMAGE_MAX_WIDTH
        && height <= IMAGE_MAX_HEIGHT
    {
        return Ok(ResizedImage {
            buffer: buffer.to_vec(),
            media_type,
            dimensions: dims(original_width, original_height, width, height),
        });
    }
    let needs_dimension_resize = width > IMAGE_MAX_WIDTH || height > IMAGE_MAX_HEIGHT;
    let is_png = media_type == "png";
    if !needs_dimension_resize && original_size > IMAGE_TARGET_RAW_SIZE {
        if is_png {
            let compressed = encode(&img, Encoding::PalettePng(256))?;
            if compressed.len() <= IMAGE_TARGET_RAW_SIZE {
                return Ok(ResizedImage {
                    buffer: compressed,
                    media_type: "png".to_string(),
                    dimensions: dims(original_width, original_height, width, height),
                });
            }
        }
        for quality in [80u8, 60, 40, 20] {
            let compressed = encode(&img, Encoding::Jpeg(quality))?;
            if compressed.len() <= IMAGE_TARGET_RAW_SIZE {
                return Ok(ResizedImage {
                    buffer: compressed,
                    media_type: "jpeg".to_string(),
                    dimensions: dims(original_width, original_height, width, height),
                });
            }
        }
    }
    if width > IMAGE_MAX_WIDTH {
        height = (height as f64 * IMAGE_MAX_WIDTH as f64 / width as f64).round() as u32;
        width = IMAGE_MAX_WIDTH;
    }
    if height > IMAGE_MAX_HEIGHT {
        width = (width as f64 * IMAGE_MAX_HEIGHT as f64 / height as f64).round() as u32;
        height = IMAGE_MAX_HEIGHT;
    }
    let resized_img = resize_inside(&img, width, height);
    let resized = encode(&resized_img, Encoding::Default(fmt))?;
    if resized.len() > IMAGE_TARGET_RAW_SIZE {
        if is_png {
            let compressed = encode(&resized_img, Encoding::PalettePng(256))?;
            if compressed.len() <= IMAGE_TARGET_RAW_SIZE {
                return Ok(ResizedImage {
                    buffer: compressed,
                    media_type: "png".to_string(),
                    dimensions: dims(original_width, original_height, width, height),
                });
            }
        }
        for quality in [80u8, 60, 40, 20] {
            let compressed = encode(&resized_img, Encoding::Jpeg(quality))?;
            if compressed.len() <= IMAGE_TARGET_RAW_SIZE {
                return Ok(ResizedImage {
                    buffer: compressed,
                    media_type: "jpeg".to_string(),
                    dimensions: dims(original_width, original_height, width, height),
                });
            }
        }
        let smaller_width = width.min(1000);
        let smaller_height =
            (height as f64 * smaller_width as f64 / width.max(1) as f64).round() as u32;
        let smaller = resize_inside(&img, smaller_width, smaller_height);
        return Ok(ResizedImage {
            buffer: encode(&smaller, Encoding::Jpeg(20))?,
            media_type: "jpeg".to_string(),
            dimensions: dims(
                original_width,
                original_height,
                smaller_width,
                smaller_height,
            ),
        });
    }
    Ok(ResizedImage {
        buffer: resized,
        media_type,
        dimensions: dims(original_width, original_height, width, height),
    })
}

/// `maybeResizeAndDownsampleImageBuffer(imageBuffer, originalSize, ext)`.
///
/// Mantém a imagem que já cabe (bytes e dimensões), reduz a que passa dos
/// limites e, quando o processamento falha, devolve o original se ele couber
/// na API, ou o `ImageResizeError` do JS.
pub fn maybe_resize_and_downsample(
    buffer: &[u8],
    original_size: usize,
    ext: &str,
) -> Result<ResizedImage, ImageResizeError> {
    if buffer.is_empty() {
        return Err(ImageResizeError(
            "Image file is empty (0 bytes)".to_string(),
        ));
    }
    match resize_inner(buffer, original_size, ext) {
        Ok(resized) => Ok(resized),
        Err(_) => {
            let normalized_ext = detect_image_format_from_buffer(buffer)
                .trim_start_matches("image/")
                .to_string();
            let base64_size = (original_size * 4).div_ceil(3);
            let read_u32 = |at: usize| {
                u32::from_be_bytes([buffer[at], buffer[at + 1], buffer[at + 2], buffer[at + 3]])
            };
            let over_dim = buffer.len() >= 24
                && buffer[..4] == [137, 80, 78, 71]
                && (read_u32(16) > IMAGE_MAX_WIDTH || read_u32(20) > IMAGE_MAX_HEIGHT);
            if base64_size <= API_IMAGE_MAX_BASE64_SIZE && !over_dim {
                return Ok(ResizedImage {
                    buffer: buffer.to_vec(),
                    media_type: normalized_ext,
                    dimensions: None,
                });
            }
            if over_dim {
                // O texto do JS tem um travessão; ele é montado em runtime.
                let dash = char::from_u32(0x2014).unwrap_or('-');
                return Err(ImageResizeError(format!(
                    "Unable to resize image {dash} dimensions exceed the {IMAGE_MAX_WIDTH}x{IMAGE_MAX_HEIGHT}px limit and image processing failed. Please resize the image to reduce its pixel dimensions."
                )));
            }
            Err(ImageResizeError(format!(
                "Unable to resize image ({} raw, {} base64). The image exceeds the 5MB API limit and compression failed. Please resize the image manually or use a smaller image.",
                format_file_size(original_size as u64),
                format_file_size(base64_size as u64)
            )))
        }
    }
}

fn compressed_result(buffer: &[u8], format: &str, original_size: usize) -> CompressedImage {
    let normalized = if format == "jpg" { "jpeg" } else { format };
    CompressedImage {
        base64: base64_encode(buffer),
        media_type: format!("image/{normalized}"),
        original_size,
    }
}

fn compress_inner(
    buffer: &[u8],
    max_bytes: usize,
    fallback_format: &str,
) -> Result<CompressedImage, String> {
    let (img, format) = decode(buffer)?;
    let format_name = format
        .map(|f| f.name().to_string())
        .unwrap_or_else(|| fallback_format.to_string());
    let original_size = buffer.len();
    if original_size <= max_bytes {
        return Ok(compressed_result(buffer, &format_name, original_size));
    }
    // tryProgressiveResizing
    let (w, h) = img.dimensions();
    for factor in [1.0f64, 0.75, 0.5, 0.25] {
        let nw = ((if w == 0 { 2000 } else { w }) as f64 * factor).round() as u32;
        let nh = ((if h == 0 { 2000 } else { h }) as f64 * factor).round() as u32;
        let resized = resize_inside(&img, nw.max(1), nh.max(1));
        let encoding = match format_name.as_str() {
            "png" => Encoding::PalettePng(256),
            "jpeg" | "jpg" => Encoding::Jpeg(80),
            "webp" => Encoding::Webp,
            other => Encoding::Default(Format::from_name(other).unwrap_or(Format::Png)),
        };
        let bytes = encode(&resized, encoding)?;
        if bytes.len() <= max_bytes {
            return Ok(compressed_result(&bytes, &format_name, original_size));
        }
    }
    // tryPalettePNG
    if format_name == "png" {
        let bytes = encode(&resize_inside(&img, 800, 800), Encoding::PalettePng(64))?;
        if bytes.len() <= max_bytes {
            return Ok(compressed_result(&bytes, "png", original_size));
        }
    }
    // tryJPEGConversion(50)
    let bytes = encode(&resize_inside(&img, 600, 600), Encoding::Jpeg(50))?;
    if bytes.len() <= max_bytes {
        return Ok(compressed_result(&bytes, "jpeg", original_size));
    }
    // createUltraCompressedJPEG
    let bytes = encode(&resize_inside(&img, 400, 400), Encoding::Jpeg(20))?;
    Ok(compressed_result(&bytes, "jpeg", original_size))
}

/// `compressImageBuffer(imageBuffer, maxBytes, originalMediaType)`.
pub fn compress_image_buffer(
    buffer: &[u8],
    max_bytes: usize,
    original_media_type: Option<&str>,
) -> Result<CompressedImage, ImageResizeError> {
    let fallback = original_media_type
        .and_then(|m| m.split('/').nth(1))
        .unwrap_or("jpeg");
    let fallback = if fallback == "jpg" { "jpeg" } else { fallback };
    match compress_inner(buffer, max_bytes, fallback) {
        Ok(result) => Ok(result),
        Err(_) => {
            if buffer.len() <= max_bytes {
                return Ok(CompressedImage {
                    base64: base64_encode(buffer),
                    media_type: detect_image_format_from_buffer(buffer).to_string(),
                    original_size: buffer.len(),
                });
            }
            Err(ImageResizeError(format!(
                "Unable to compress image ({}) to fit within {}. Please use a smaller image.",
                format_file_size(buffer.len() as u64),
                format_file_size(max_bytes as u64)
            )))
        }
    }
}

/// `compressImageBufferWithTokenLimit`: o teto de tokens vira teto de bytes
/// (0,125 token por caractere base64).
pub fn compress_image_buffer_with_token_limit(
    buffer: &[u8],
    max_tokens: usize,
    original_media_type: Option<&str>,
) -> Result<CompressedImage, ImageResizeError> {
    let max_base64_chars = (max_tokens as f64 / 0.125).floor() as usize;
    let max_bytes = (max_base64_chars as f64 * 0.75).floor() as usize;
    compress_image_buffer(buffer, max_bytes, original_media_type)
}

/// O último recurso do Read quando a compressão falha: 400x400 em JPEG
/// qualidade 20.
pub fn ultra_compressed_jpeg(buffer: &[u8]) -> Result<Vec<u8>, String> {
    let (img, _) = decode(buffer)?;
    encode(&resize_inside(&img, 400, 400), Encoding::Jpeg(20))
}

/// `createImageMetadataText(dims, sourcePath)`: a nota `[Image: ...]` que o
/// Read anexa quando a imagem foi exibida em outro tamanho.
pub fn create_image_metadata_text(
    dims: &ImageDimensions,
    source_path: Option<&str>,
) -> Option<String> {
    if dims.original_width == 0
        || dims.original_height == 0
        || dims.display_width == 0
        || dims.display_height == 0
    {
        return source_path.map(|p| format!("[Image source: {p}]"));
    }
    let was_resized =
        dims.original_width != dims.display_width || dims.original_height != dims.display_height;
    if !was_resized && source_path.is_none() {
        return None;
    }
    let mut parts: Vec<String> = Vec::new();
    if let Some(p) = source_path {
        parts.push(format!("source: {p}"));
    }
    if was_resized {
        let scale = dims.original_width as f64 / dims.display_width as f64;
        parts.push(format!(
            "original {}x{}, displayed at {}x{}. Multiply coordinates by {:.2} to map to original image.",
            dims.original_width, dims.original_height, dims.display_width, dims.display_height, scale
        ));
    }
    Some(format!("[Image: {}]", parts.join(", ")))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn png_bytes(w: u32, h: u32, noisy: bool) -> Vec<u8> {
        let mut img = image::RgbImage::new(w, h);
        let mut seed: u32 = 7;
        for p in img.pixels_mut() {
            if noisy {
                seed = seed.wrapping_mul(1_103_515_245).wrapping_add(12_345);
                let v = seed.to_be_bytes();
                *p = image::Rgb([v[0], v[1], v[2]]);
            } else {
                *p = image::Rgb([200, 10, 10]);
            }
        }
        let mut out = Cursor::new(Vec::new());
        DynamicImage::ImageRgb8(img)
            .write_to(&mut out, ImageFormat::Png)
            .unwrap();
        out.into_inner()
    }

    #[test]
    fn magic_bytes_detection() {
        assert_eq!(
            detect_image_format_from_buffer(&png_bytes(2, 2, false)),
            "image/png"
        );
        assert_eq!(
            detect_image_format_from_buffer(&[255, 216, 255, 0]),
            "image/jpeg"
        );
        assert_eq!(detect_image_format_from_buffer(b"GIF89a"), "image/gif");
        assert_eq!(
            detect_image_format_from_buffer(b"RIFF\0\0\0\0WEBPVP8 "),
            "image/webp"
        );
        assert_eq!(detect_image_format_from_buffer(b"xx"), "image/png");
    }

    #[test]
    fn small_image_is_kept_with_dimensions() {
        let bytes = png_bytes(50, 40, false);
        let r = maybe_resize_and_downsample(&bytes, bytes.len(), "png").unwrap();
        assert_eq!(r.buffer, bytes);
        assert_eq!(r.media_type, "png");
        assert_eq!(r.dimensions, dims(50, 40, 50, 40));
    }

    #[test]
    fn wide_image_is_scaled_to_the_max_width() {
        let bytes = png_bytes(3000, 600, false);
        let r = maybe_resize_and_downsample(&bytes, bytes.len(), "png").unwrap();
        assert_eq!(r.dimensions, dims(3000, 600, 2000, 400));
        let decoded = image::load_from_memory(&r.buffer).unwrap();
        assert_eq!(decoded.dimensions(), (2000, 400));
        assert_eq!(
            create_image_metadata_text(&r.dimensions.unwrap(), None).as_deref(),
            Some("[Image: original 3000x600, displayed at 2000x400. Multiply coordinates by 1.50 to map to original image.]")
        );
    }

    #[test]
    fn undecodable_bytes_fall_back_to_the_original() {
        let bytes = b"\x89PNG\r\n\x1a\nlixo".to_vec();
        let r = maybe_resize_and_downsample(&bytes, bytes.len(), "png").unwrap();
        assert_eq!(r.buffer, bytes);
        assert_eq!(r.media_type, "png");
        assert!(r.dimensions.is_none());
    }

    #[test]
    fn over_dimension_png_that_fails_to_decode_is_an_error() {
        let mut bytes = b"\x89PNG\r\n\x1a\n\0\0\0\rIHDR".to_vec();
        bytes.extend_from_slice(&3000u32.to_be_bytes());
        bytes.extend_from_slice(&10u32.to_be_bytes());
        bytes.extend_from_slice(b"lixo");
        let err = maybe_resize_and_downsample(&bytes, bytes.len(), "png").unwrap_err();
        assert!(err.0.starts_with("Unable to resize image "));
        assert!(err.0.contains("dimensions exceed the 2000x2000px limit"));
    }

    #[test]
    fn token_limit_compression_fits_the_budget() {
        let bytes = png_bytes(400, 400, true);
        assert!(bytes.len() > 150_000);
        let c = compress_image_buffer_with_token_limit(&bytes, 25_000, Some("image/png")).unwrap();
        use base64::Engine;
        let raw = base64::engine::general_purpose::STANDARD
            .decode(&c.base64)
            .unwrap();
        assert!(raw.len() <= 150_000, "{}", raw.len());
        assert_eq!(c.original_size, bytes.len());
    }
}
