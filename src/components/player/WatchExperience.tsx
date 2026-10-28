"use client";

import { useCallback, useState } from "react";
import type { AnimeEpisode } from "@/types/anime";
import type { AudioType, ProviderId } from "@/lib/streaming/types";
import { VideoPlayer } from "./VideoPlayer";
import { PlayerControls } from "./PlayerControls";
import { EpisodeList } from "./EpisodeList";

export function WatchExperience({ animeId, initialEpisode, initialAudio, episodes, title }: {
  animeId: number;
  initialEpisode: number;
  initialAudio: AudioType;
  episodes: AnimeEpisode[];
  title: string;
}) {
  const [episode, setEpisode] = useState(initialEpisode);
  const [audio, setAudio] = useState<AudioType>(initialAudio);
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>("aniembed");
  const handleAudio = useCallback((next: AudioType) => setAudio(next), []);
  const handleProvider = useCallback((next: ProviderId) => setSelectedProvider(next), []);
  const selected = episodes.find((item) => item.number === episode);
  const rows = episodes.length ? episodes : Array.from(
    { length: Math.min(24, Math.max(1, initialEpisode + 3)) },
    (_, index) => ({ id: `fallback-${index + 1}`, number: index + 1, title: `Episode ${index + 1}` })
  );

  return (
    <>
      <VideoPlayer
        animeId={animeId}
        episodeNumber={episode}
        audio={audio}
        selectedProvider={selectedProvider}
        onProviderFailure={() => {
          // An iframe's cross-origin playback status is not observable reliably.
          // Keep selection manual so switching providers never unexpectedly changes audio/episode.
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 10, marginTop: 16, alignItems: "start" }}>
        <div>
          <div className="control-label" style={{ marginBottom: 5 }}>{title}</div>
          <div style={{ fontSize: 12, color: "#b7bdcc" }}>Episode {episode}{selected ? `: ${selected.title}` : ""}</div>
        </div>
        <div className="meta-pill" style={{ fontSize: 10 }}>{audio.toUpperCase()}</div>
      </div>
      <div style={{ marginTop: 18 }}>
        <PlayerControls
          animeId={animeId}
          episodeNumber={episode}
          audio={audio}
          selectedProvider={selectedProvider}
          onAudioChange={handleAudio}
          onProviderChange={handleProvider}
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <EpisodeList episodes={rows} selected={episode} onSelect={setEpisode} />
      </div>
    </>
  );
}
