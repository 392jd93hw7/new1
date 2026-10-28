import type { AnimeEpisode } from "@/types/anime";

const KITSU = "https://kitsu.io/api/edge";

type KitsuAnime = { id: string; attributes?: { canonicalTitle?: string; titles?: Record<string, string> } };
type KitsuEpisode = {
  id: string;
  attributes?: {
    number?: number | null;
    seasonNumber?: number | null;
    canonicalTitle?: string | null;
    titles?: Record<string, string>;
    synopsis?: string | null;
    airdate?: string | null;
    thumbnail?: { original?: string | null; large?: string | null; meta?: { dimensions?: { large?: { width?: number; height?: number } } } } | null;
  };
};

async function kitsuFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${KITSU}${path}`, {
    headers: { Accept: "application/vnd.api+json" },
    signal,
    next: { revalidate: 3600 }
  });
  if (!response.ok) throw new Error(`Kitsu request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function findKitsuAnime(title: string, signal?: AbortSignal): Promise<KitsuAnime | null> {
  if (!title.trim()) return null;
  const params = new URLSearchParams({ "filter[text]": title, "page[limit]": "10" });
  const result = await kitsuFetch<{ data?: KitsuAnime[] }>(`/anime?${params.toString()}`, signal);
  const rows = result.data || [];
  const normalized = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return rows.find((row) => {
    const candidate = (row.attributes?.canonicalTitle || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    return candidate === normalized;
  }) || rows[0] || null;
}

export async function getKitsuEpisodes(kitsuId: string, signal?: AbortSignal): Promise<AnimeEpisode[]> {
  const params = new URLSearchParams({
    "filter[mediaType]": "Anime",
    "page[limit]": "20",
    sort: "number"
  });
  const result = await kitsuFetch<{ data?: KitsuEpisode[] }>(`/anime/${encodeURIComponent(kitsuId)}/episodes?${params.toString()}`, signal);
  return (result.data || [])
    .map((row): AnimeEpisode | null => {
      const attrs = row.attributes || {};
      const number = attrs.number;
      if (typeof number !== "number" || number < 0) return null;
      const title = attrs.canonicalTitle || Object.values(attrs.titles || {}).find(Boolean) || `Episode ${number}`;
      return {
        id: row.id,
        number,
        title,
        thumbnail: attrs.thumbnail?.original || attrs.thumbnail?.large || undefined,
        synopsis: attrs.synopsis || undefined,
        airDate: attrs.airdate || undefined
      };
    })
    .filter((episode): episode is AnimeEpisode => episode !== null);
}

/**
 * Thumbnail/title lookup is best effort. Kitsu catalog matches can be imperfect,
 * so callers should not treat Kitsu's first fuzzy search result as a guaranteed
 * cross-database identity match.
 */
export async function getEpisodeData(title: string, signal?: AbortSignal): Promise<{ kitsuId?: string; episodes: AnimeEpisode[] }> {
  try {
    const anime = await findKitsuAnime(title, signal);
    if (!anime) return { episodes: [] };
    return { kitsuId: anime.id, episodes: await getKitsuEpisodes(anime.id, signal) };
  } catch {
    return { episodes: [] };
  }
}
