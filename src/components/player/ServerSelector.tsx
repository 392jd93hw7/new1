"use client";
import type {ProviderId,StreamRequest} from "@/lib/streaming/types";
import {providers} from "@/lib/streaming/registry";
export function ServerSelector({animeId,episodeNumber,audio,selected,onSelect}:StreamRequest&{selected:ProviderId;onSelect:(id:ProviderId)=>void}){
 return <div className="control-panel"><div className="control-label">Streaming server</div><div className="server-list">{providers.map(p=>{const enabled=Boolean(p.buildEmbedUrl({animeId,episodeNumber,audio}));return <button key={p.id} type="button" className={`server-button ${selected===p.id?"selected":""}`} disabled={!enabled} onClick={()=>onSelect(p.id)} aria-pressed={selected===p.id}><span style={{height:8,width:8,borderRadius:20,background:enabled?"#86efac":"#626879",flexShrink:0}}/><span>{p.label}</span><span className="server-status">{enabled?(selected===p.id?"Selected":"Ready"):"Not configured"}</span></button>})}</div><p className="server-note">Third-party players may not expose playback errors, so automatic fallback cannot be guaranteed for every failure.</p></div>
}
