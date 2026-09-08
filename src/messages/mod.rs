pub mod api_format;
pub mod normalize;

pub use api_format::inject_cache_control;
pub use normalize::{
    derive_uuid, ensure_tool_result_pairing, normalize_messages_for_api, split_multi_block_messages,
};
