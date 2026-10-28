import type { StreamProvider } from "../types";

export const aniembedProvider: StreamProvider = {
  id: "aniembed",
  label: "AniEmbed",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_ANIEMBED_EMBED_TEMPLATE;
    if (!template) return null;
    return template
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{audio}", encodeURIComponent(audio));
  }
};
