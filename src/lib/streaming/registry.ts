import type { ProviderId, StreamProvider } from "./types";
import { aniembedProvider } from "./providers/aniembed";
import { novuscloudProvider } from "./providers/novuscloud";
import { zokoanimeProvider } from "./providers/zokoanime";

export const providers: StreamProvider[] = [
  aniembedProvider,
  novuscloudProvider,
  zokoanimeProvider
];

export function getProvider(id: ProviderId) {
  return providers.find((provider) => provider.id === id) || null;
}

export function getReadyProviders() {
  return providers.filter((provider) => Boolean(provider.buildEmbedUrl({
    animeId: 1, episodeNumber: 1, audio: "sub"
  })));
}
