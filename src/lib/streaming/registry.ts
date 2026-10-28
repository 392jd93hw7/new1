import type { StreamProvider } from "./types";
import { aniembedProvider } from "./providers/aniembed";
import { anixoProvider } from "./providers/anixo";
import { yenimeProvider } from "./providers/yenime";

/** Keep AniEmbed available; Anixo and Yenime are alternatives, not replacements. */
export const providers: StreamProvider[] = [
  aniembedProvider,
  anixoProvider,
  yenimeProvider,
];

export function getProvider(id: string) {
  return providers.find((provider) => provider.id === id) || null;
}

export function getReadyProviders(animeId = 1, episodeNumber = 1, audio: "sub" | "dub" = "sub") {
  return providers.filter((provider) => Boolean(provider.buildEmbedUrl({ animeId, episodeNumber, audio })));
}
