import type { Anime, AnimeSearchResult } from "@/types/anime";

const ENDPOINT = "https://graphql.anilist.co";

type AniListTitle = { romaji?: string | null; english?: string | null; native?: string | null };
type AniListMedia = {
  id: number;
  idMal?: number | null;
  title: AniListTitle;
  description?: string | null;
  coverImage?: { extraLarge?: string | null; large?: string | null; medium?: string | null } | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  seasonYear?: number | null;
  season?: string | null;
  format?: string | null;
  episodes?: number | null;
  status?: string | null;
  genres?: string[] | null;
  siteUrl?: string | null;
};

function displayTitle(title: AniListTitle): string {
  return title.english || title.romaji || title.native || "Unknown anime";
}

function toSearchResult(media: AniListMedia): AnimeSearchResult {
  return {
    id: media.id,
    title: displayTitle(media.title),
    coverImage: media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium || "",
    year: media.seasonYear || undefined,
    format: (media.format || "UNKNOWN") as AnimeSearchResult["format"],
    score: media.averageScore ? Math.round(media.averageScore) / 10 : undefined
  };
}

function toAnime(media: AniListMedia): Anime {
  return {
    ...toSearchResult(media),
    nativeTitle: media.title.native || undefined,
    description: media.description || "",
    bannerImage: media.bannerImage || undefined,
    season: media.season || undefined,
    episodes: media.episodes || undefined,
    status: media.status || undefined,
    genres: media.genres || [],
    siteUrl: media.siteUrl || undefined
  };
}

async function graphql<T>(query: string, variables: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    signal,
    next: { revalidate: 1800 }
  });
  if (!response.ok) throw new Error(`AniList request failed (${response.status}).`);
  const result = await response.json() as { data?: T; errors?: { message?: string }[] };
  if (!result.data) throw new Error(result.errors?.[0]?.message || "AniList returned no data.");
  return result.data;
}

const MEDIA_FIELDS = `
  id idMal title { romaji english native }
  description(asHtml: false) coverImage { extraLarge large medium }
  bannerImage averageScore seasonYear season format episodes status genres siteUrl
`;

export async function searchAnime(search: string, signal?: AbortSignal): Promise<AnimeSearchResult[]> {
  const trimmed = search.trim();
  if (trimmed.length < 2) return [];
  const query = `query ($search: String) {
    Page(page: 1, perPage: 8) {
      media(search: $search, type: ANIME, sort: [SEARCH_MATCH, POPULARITY_DESC]) {
        id title { romaji english native }
        coverImage { extraLarge large medium }
        seasonYear format averageScore
      }
    }
  }`;
  const data = await graphql<{ Page: { media: AniListMedia[] } }>(query, { search: trimmed }, signal);
  return data.Page.media.map(toSearchResult);
}

export async function getAnimeById(id: number): Promise<Anime | null> {
  const query = `query ($id: Int) { Media(id: $id, type: ANIME) { ${MEDIA_FIELDS} } }`;
  const data = await graphql<{ Media: AniListMedia | null }>(query, { id });
  return data.Media ? toAnime(data.Media) : null;
}

export async function getAnimeCollections() {
  const query = `query {
    trending: Page(page: 1, perPage: 12) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) { ${MEDIA_FIELDS} }
    }
    popular: Page(page: 1, perPage: 12) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) { ${MEDIA_FIELDS} }
    }
    seasonal: Page(page: 1, perPage: 12) {
      media(type: ANIME, season: FALL, seasonYear: 2026, sort: POPULARITY_DESC, isAdult: false) { ${MEDIA_FIELDS} }
    }
  }`;
  const data = await graphql<{
    trending: { media: AniListMedia[] };
    popular: { media: AniListMedia[] };
    seasonal: { media: AniListMedia[] };
  }>(query, {});
  return {
    trending: data.trending.media.map(toAnime),
    popular: data.popular.media.map(toAnime),
    seasonal: data.seasonal.media.map(toAnime)
  };
}

export async function getAnimeSearchPage(search: string): Promise<Anime[]> {
  const query = `query ($search: String) {
    Page(page: 1, perPage: 30) {
      media(search: $search, type: ANIME, isAdult: false, sort: [SEARCH_MATCH, POPULARITY_DESC]) {
        ${MEDIA_FIELDS}
      }
    }
  }`;
  const data = await graphql<{ Page: { media: AniListMedia[] } }>(query, { search });
  return data.Page.media.map(toAnime);
}


export interface AiringEntry {
  id: number;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  media: Anime;
}

export async function getAiringSchedule(from: number, to: number): Promise<AiringEntry[]> {
  const query = `query ($from: Int, $to: Int) {
    Page(page: 1, perPage: 50) {
      airingSchedules(airingAt_greater: $from, airingAt_lesser: $to, sort: TIME) {
        id airingAt timeUntilAiring episode
        media {
          id title { romaji english native }
          description(asHtml: false)
          coverImage { extraLarge large medium }
          bannerImage averageScore seasonYear season format episodes status genres siteUrl
        }
      }
    }
  }`;
  const data = await graphql<{ Page: { airingSchedules: (Omit<AiringEntry, "media"> & { media: AniListMedia })[] } }>(query, { from, to });
  return data.Page.airingSchedules.map((item) => ({ ...item, media: toAnime(item.media) }));
}


export async function getDiscoverAnimePage(page: number): Promise<{ anime: Anime[]; hasNextPage: boolean }> {
  const query = `query ($page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
        ${MEDIA_FIELDS}
      }
    }
  }`;
  const data = await graphql<{ Page: { pageInfo: { hasNextPage: boolean }; media: AniListMedia[] } }>(query, { page });
  return {
    anime: data.Page.media.map(toAnime),
    hasNextPage: data.Page.pageInfo.hasNextPage
  };
}
