export type MediaFormat = "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "UNKNOWN";

export interface Anime {
  id: number;
  title: string;
  nativeTitle?: string;
  description?: string;
  coverImage: string;
  bannerImage?: string;
  score?: number;
  year?: number;
  season?: string;
  format?: MediaFormat;
  episodes?: number;
  status?: string;
  genres: string[];
  kitsuId?: string;
  siteUrl?: string;
}

export interface AnimeEpisode {
  id: string;
  number: number;
  title: string;
  thumbnail?: string;
  synopsis?: string;
  airDate?: string;
}

export interface AnimeSearchResult {
  id: number;
  title: string;
  coverImage: string;
  year?: number;
  format?: MediaFormat;
  score?: number;
}
