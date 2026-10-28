"use client";
import {useCallback,useState} from "react";
import type {AnimeEpisode} from "@/types/anime";
import type {AudioType} from "@/lib/streaming/types";
import {VideoPlayer} from "./VideoPlayer";
import {PlayerControls} from "./PlayerControls";
import {EpisodeList} from "./EpisodeList";
export function WatchExperience({animeId,initialEpisode,initialAudio,episodes,title}:{animeId:number;initialEpisode:number;initialAudio:AudioType;episodes:AnimeEpisode[];title:string}){
 const [episode,setEpisode]=useState(initialEpisode);const [audio,setAudio]=useState<AudioType>(initialAudio);
 const handleAudio=useCallback((next:AudioType)=>setAudio(next),[]);
 const selected=episodes.find(e=>e.number===episode);
 const rows=episodes.length?episodes:Array.from({length:Math.min(24,Math.max(1,initialEpisode+3))},(_,i)=>({id:`fallback-${i+1}`,number:i+1,title:`Episode ${i+1}`}));
 return <><VideoPlayer key={`${animeId}-${episode}`} animeId={animeId} episodeNumber={episode} audio={audio}/><div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:10,marginTop:16,alignItems:"start"}}><div><div className="control-label" style={{marginBottom:5}}>{title}</div><div style={{fontSize:12,color:"#b7bdcc"}}>Episode {episode}{selected?`: ${selected.title}`:""}</div></div><div className="meta-pill" style={{fontSize:10}}>{audio.toUpperCase()}</div></div><div style={{marginTop:18}}><PlayerControls animeId={animeId} episodeNumber={episode} onAudioChange={handleAudio}/></div><div style={{marginTop:18}}><EpisodeList episodes={rows} selected={episode} onSelect={setEpisode}/></div></>
}
