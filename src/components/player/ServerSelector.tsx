"use client";

import type { ProviderId, StreamRequest } from "@/lib/streaming/types";
import { providers } from "@/lib/streaming/registry";

export function ServerSelector({ animeId, episodeNumber, audio, selected, onSelect }: StreamRequest & {
  selected: ProviderId;
  onSelect: (id: ProviderId) => void;
}) {
  return (
    <div className="control-panel">
      <div className="control-label">Streaming server</div>
      <div className="server-list">
        {providers.map((provider) => {
          const url = provider.buildEmbedUrl({ animeId, episodeNumber, audio });
          const enabled = Boolean(url);
          return (
            <button
              key={provider.id}
              type="button"
              className={`server-button ${selected === provider.id ? "selected" : ""}`}
              disabled={!enabled}
              onClick={() => onSelect(provider.id)}
              aria-pressed={selected === provider.id}
            >
              <span style={{ height: 8, width: 8, borderRadius: 20, background: enabled ? "#86efac" : "#626879", flexShrink: 0 }} />
              <span>{provider.label}</span>
              <span className="server-status">
                {enabled ? (selected === provider.id ? "Selected" : "Ready") : "Not configured"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="server-note">
        Switching servers keeps the selected episode and Sub/Dub setting. If playback fails, choose another server here.
        Third-party iframe failures cannot always be detected by the site automatically.
      </p>
    </div>
  );
}
