"use client";
import {useEffect,useState} from "react";
import {PlayCircle} from "lucide-react";
import type {ProviderId,StreamRequest} from "@/lib/streaming/types";
import {providers} from "@/lib/streaming/registry";

export function VideoPlayer({animeId,episodeNumber,audio}:StreamRequest){
 const [selected,setSelected]=useState<ProviderId>("aniembed");
 const [reloadKey,setReloadKey]=useState(0);
 const provider=providers.find(p=>p.id===selected);
 const url=provider?.buildEmbedUrl({animeId,episodeNumber,audio})||null;

 useEffect(()=>{setSelected("aniembed");setReloadKey(k=>k+1);},[animeId,episodeNumber,audio]);

 return <div className="player-frame">{url?<iframe key={`${selected}-${reloadKey}-${audio}-${episodeNumber}`} src={url} title={`Anime ${animeId}, episode ${episodeNumber}, ${audio}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="no-referrer"/>:<div className="player-placeholder"><PlayCircle size={48} color="#c4b5fd"/><strong>Ready to watch?</strong><p>No playable URL is configured for this server yet. Choose an enabled server or add the provider’s current documented embed template in environment variables.</p></div>}</div>;
}
