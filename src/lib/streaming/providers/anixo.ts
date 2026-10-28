import type { StreamProvider } from "../types";

export const anixoProvider: StreamProvider = {
  id: "anixo",
  label: "Anixo",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_ANIXO_EMBED_TEMPLATE
      || "https://anixo.buzz/embed/ani/{ANILIST_ID}/{EPISODE}?track={audio}";
    return template
      .replaceAll("{ANILIST_ID}", encodeURIComponent(String(animeId)))
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{EPISODE}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{sub|dub}", encodeURIComponent(audio))
      .replaceAll("{audio}", encodeURIComponent(audio));
  },
};
