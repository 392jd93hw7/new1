import type { StreamProvider } from "../types";

export const zokoanimeProvider: StreamProvider = {
  id: "zokoanime",
  label: "ZokoAnime",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_ZOKOANIME_EMBED_TEMPLATE
      || "https://zokoanime.video/stream/ani/{anilist_id}/{episode}/{audio}?color=a78bfa";
    return template
      .replaceAll("{anilist_id}", encodeURIComponent(String(animeId)))
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{sub|dub}", encodeURIComponent(audio))
      .replaceAll("{audio}", encodeURIComponent(audio));
  }
};
