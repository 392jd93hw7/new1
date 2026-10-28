import type { StreamProvider } from "../types";

export const yenimeProvider: StreamProvider = {
  id: "yenime",
  label: "Yenime",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_YENIME_EMBED_TEMPLATE
      || "https://api.yenime.net/anime/ani/{ANILIST_ID}/{EPISODE}?dub={dub}";
    return template
      .replaceAll("{ANILIST_ID}", encodeURIComponent(String(animeId)))
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{EPISODE}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{dub}", audio === "dub" ? "1" : "0")
      .replaceAll("{audio}", encodeURIComponent(audio));
  },
};
