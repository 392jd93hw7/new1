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
    <div className="watch-experience-grid">
      <section className="watch-player-column">
        <VideoPlayer animeId={animeId} episodeNumber={episode} audio={audio} selectedProvider={selectedProvider} />
        <div className="watch-player-title-row">
          <div className="watch-current-title">
            <div className="watch-section-kicker">{title}</div>
            <h2>Episode {episode}{selected ? <span> · {selected.title}</span> : null}</h2>
          </div>
          <span className="watch-audio-badge">{audio === "sub" ? "SUB · Japanese" : "DUB · English"}</span>
        </div>
        <div className="watch-toolbar">
          <span className="watch-toolbar-label">Audio version & streaming server</span>
          <PlayerControls
            animeId={animeId}
            episodeNumber={episode}
            audio={audio}
            selectedProvider={selectedProvider}
            onAudioChange={handleAudio}
            onProviderChange={handleProvider}
          />
        </div>
      </section>
      <div className="watch-episodes-column">
        <EpisodeList episodes={rows} selected={episode} onSelect={setEpisode} />
      </div>
    </div>
  );
}
