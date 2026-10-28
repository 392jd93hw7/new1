"use client";

import { useCallback } from "react";
import type { AudioType, ProviderId } from "@/lib/streaming/types";
import { AudioSelector } from "./AudioSelector";
import { ServerSelector } from "./ServerSelector";

export function PlayerControls({ animeId, episodeNumber, audio, selectedProvider, onAudioChange, onProviderChange }: {
  animeId: number;
  episodeNumber: number;
  audio: AudioType;
  selectedProvider: ProviderId;
  onAudioChange: (audio: AudioType) => void;
  onProviderChange: (provider: ProviderId) => void;
}) {
  const handleAudioChange = useCallback((next: AudioType) => {
    onAudioChange(next);
  }, [onAudioChange]);

  return (
    <>
      <AudioSelector value={audio} onChange={handleAudioChange} />
      <ServerSelector
        animeId={animeId}
        episodeNumber={episodeNumber}
        audio={audio}
        selected={selectedProvider}
        onSelect={onProviderChange}
      />
    </>
  );
}
