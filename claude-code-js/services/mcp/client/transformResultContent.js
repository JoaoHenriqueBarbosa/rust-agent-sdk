// function: transformResultContent
async function transformResultContent(resultContent, serverName) {
  switch (resultContent.type) {
    case "text":
      return [
        {
          type: "text",
          text: resultContent.text
        }
      ];
    case "audio": {
      let audioData = resultContent;
      return await persistBlobToTextBlock(Buffer.from(audioData.data, "base64"), audioData.mimeType, serverName, `[Audio from ${serverName}] `);
    }
    case "image": {
      let imageBuffer = Buffer.from(String(resultContent.data), "base64"), ext = resultContent.mimeType?.split("/")[1] || "png", resized = await maybeResizeAndDownsampleImageBuffer(imageBuffer, imageBuffer.length, ext);
      return [
        {
          type: "image",
          source: {
            data: resized.buffer.toString("base64"),
            media_type: `image/${resized.mediaType}`,
            type: "base64"
          }
        }
      ];
    }
    case "resource": {
      let resource = resultContent.resource, prefix = `[Resource from ${serverName} at ${resource.uri}] `;
      if ("text" in resource)
        return [
          {
            type: "text",
            text: `${prefix}${resource.text}`
          }
        ];
      else if ("blob" in resource)
        if (IMAGE_MIME_TYPES.has(resource.mimeType ?? "")) {
          let imageBuffer = Buffer.from(resource.blob, "base64"), ext = resource.mimeType?.split("/")[1] || "png", resized = await maybeResizeAndDownsampleImageBuffer(imageBuffer, imageBuffer.length, ext), content = [];
          if (prefix)
            content.push({
              type: "text",
              text: prefix
            });
          return content.push({
            type: "image",
            source: {
              data: resized.buffer.toString("base64"),
              media_type: `image/${resized.mediaType}`,
              type: "base64"
            }
          }), content;
        } else
          return await persistBlobToTextBlock(Buffer.from(resource.blob, "base64"), resource.mimeType, serverName, prefix);
      return [];
    }
    case "resource_link": {
      let resourceLink = resultContent, text2 = `[Resource link: ${resourceLink.name}] ${resourceLink.uri}`;
      if (resourceLink.description)
        text2 += ` (${resourceLink.description})`;
      return [
        {
          type: "text",
          text: text2
        }
      ];
    }
    default:
      return [];
  }
}
