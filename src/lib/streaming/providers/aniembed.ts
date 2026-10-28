import type { StreamProvider } from "../types";

/**
 * Configure an embed URL template only after confirming it matches the
 * provider's current official documentation and your authorization to embed.
 * Supported placeholders: {id}, {episode}, {audio}.
 *
 * Example template format is intentionally not hard-coded: providers can
 * change routes and query parameters, and a guessed URL would be unreliable.
 */
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
