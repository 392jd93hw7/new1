import type { StreamProvider } from "../types";

export const novuscloudProvider: StreamProvider = {
  id: "novuscloud",
  label: "NovusCloud",
  buildEmbedUrl({ animeId, episodeNumber, audio }) {
    const template = process.env.NEXT_PUBLIC_NOVUSCLOUD_EMBED_TEMPLATE
      || "https://novuscloud.buzz/embed/ani/{anilist_id}/{episode}/{type}";
    return template
      .replaceAll("{anilist_id}", encodeURIComponent(String(animeId)))
      .replaceAll("{id}", encodeURIComponent(String(animeId)))
      .replaceAll("{episode}", encodeURIComponent(String(episodeNumber)))
      .replaceAll("{type}", encodeURIComponent(audio))
      .replaceAll("{audio}", encodeURIComponent(audio));
  }
};
