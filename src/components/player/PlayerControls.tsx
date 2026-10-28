"use client";

import { useCallback, useEffect, useState } from "react";
import type { AudioType, ProviderId } from "@/lib/streaming/types";
import { providers } from "@/lib/streaming/registry";
import { AudioSelector } from "./AudioSelector";
import { ServerSelector } from "./ServerSelector";

export function PlayerControls({ animeId, episodeNumber, onAudioChange }: {
  animeId: number;
  episodeNumber: number;
  onAudioChange: (audio: AudioType) => void;
}) {
  const [audio, setAudio] = useState<AudioType>("sub");
  const [selected, setSelected] = useState<ProviderId>("aniembed");
  const handleAudioChange = useCallback((next: AudioType) => {
    setAudio(next);
    onAudioChange(next);
  }, [onAudioChange]);

  useEffect(() => {
    const current = providers.find((provider) => provider.id === selected);
    if (!current?.buildEmbedUrl({ animeId, episodeNumber, audio })) {
      const ready = providers.find((provider) => Boolean(provider.buildEmbedUrl({ animeId, episodeNumber, audio })));
      if (ready) setSelected(ready.id);
    }
  }, [animeId, episodeNumber, audio, selected]);

  return (
    <>
      <AudioSelector value={audio} onChange={handleAudioChange} />
      <ServerSelector
        animeId={animeId}
        episodeNumber={episodeNumber}
        audio={audio}
        selected={selected}
        onSelect={setSelected}
      />
    </>
  );
}
