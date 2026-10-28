"use client";

import { PlayCircle } from "lucide-react";
import type { ProviderId, StreamRequest } from "@/lib/streaming/types";
import { providers } from "@/lib/streaming/registry";

export function VideoPlayer({ animeId, episodeNumber, audio, selectedProvider }: StreamRequest & { selectedProvider: ProviderId }) {
  const provider = providers.find((item) => item.id === selectedProvider);
  const url = provider?.buildEmbedUrl({ animeId, episodeNumber, audio }) || null;

  return (
    <div className="player-frame">
      {url ? (
        <iframe
          key={`${selectedProvider}-${animeId}-${episodeNumber}-${audio}`}
          src={url}
          title={`Anime ${animeId}, episode ${episodeNumber}, ${audio} — ${provider?.label || "stream"}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        />
      ) : (
        <div className="player-placeholder">
          <PlayCircle size={48} color="#c4b5fd" />
          <strong>Ready to watch?</strong>
          <p>No playable URL is configured for this server yet. Choose an enabled server or add the provider’s current documented embed template in environment variables.</p>
        </div>
      )}
    </div>
  );
}
