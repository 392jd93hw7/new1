import type { StreamProvider } from "../types";

export const novuscloudProvider: StreamProvider = {
  id: "novuscloud",
  label: "NovusCloud",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_NOVUSCLOUD_EMBED_TEMPLATE;
    if (!template) return null;
    return template
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{audio}", encodeURIComponent(audio));
  }
};
