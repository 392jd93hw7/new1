export type AudioType = "sub" | "dub";
export type ProviderId = "aniembed" | "novuscloud" | "zokoanime";

export interface StreamRequest {
  animeId: number;
  episodeNumber: number;
  audio: AudioType;
}

export interface StreamProvider {
  id: ProviderId;
  label: string;
  /**
   * Returns a documented embed/player URL if that provider has a configured
   * URL template. Empty means not configured; never invent a stream URL.
   */
  buildEmbedUrl(request: StreamRequest): string | null;
}

export interface ProviderState {
  id: ProviderId;
  label: string;
  url: string | null;
  status: "ready" | "unconfigured" | "failed";
}
