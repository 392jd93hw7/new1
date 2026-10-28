export type AudioType = "sub" | "dub";
export type ProviderId = "aniembed" | "anixo" | "yenime";

export interface StreamRequest {
  /** AniList media ID (used by all three embed providers). */
  animeId: number;
  episodeNumber: number;
  audio: AudioType;
}

export interface StreamProvider {
  id: ProviderId;
  label: string;
  /**
   * Builds the provider's embed URL. Returns null only when a provider has
   * explicitly been disabled by configuration.
   */
  buildEmbedUrl(request: StreamRequest): string | null;
}

export interface ProviderState {
  id: ProviderId;
  label: string;
  url: string | null;
  status: "ready" | "unconfigured" | "failed";
}
