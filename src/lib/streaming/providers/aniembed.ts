import type { StreamProvider } from "../types";

export const aniembedProvider: StreamProvider = {
  id: "aniembed",
  label: "AniEmbed",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_ANIEMBED_EMBED_TEMPLATE
      || "https://aniembed.se/e/{ANILIST_ID}/{EPISODE}?lang={audio}";
    return template
      .replaceAll("{ANILIST_ID}", encodeURIComponent(String(animeId)))
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{EPISODE}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{sub|dub}", encodeURIComponent(audio))
      .replaceAll("{audio}", encodeURIComponent(audio));
  }
};
