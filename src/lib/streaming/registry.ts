import type { StreamProvider } from "./types";
import { aniembedProvider } from "./providers/aniembed";

export const providers: StreamProvider[] = [aniembedProvider];

export function getProvider(id: string) {
  return providers.find((provider) => provider.id === id) || null;
}

export function getReadyProviders(animeId = 1, episodeNumber = 1, audio: "sub" | "dub" = "sub") {
  return providers.filter((provider) => Boolean(provider.buildEmbedUrl({ animeId, episodeNumber, audio })));
}
