import type { StreamProvider } from "../types";

export const zokoanimeProvider: StreamProvider = {
  id: "zokoanime",
  label: "ZokoAnime",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_ZOKOANIME_EMBED_TEMPLATE;
    if (!template) return null;
    return template
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{audio}", encodeURIComponent(audio));
  }
};
