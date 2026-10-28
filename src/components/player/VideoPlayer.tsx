"use client";
import {useEffect,useRef,useState} from "react";
import {AlertTriangle,PlayCircle,RefreshCw} from "lucide-react";
import type {AudioType,ProviderId,StreamRequest} from "@/lib/streaming/types";
import {providers} from "@/lib/streaming/registry";
const FAILURE_TIMEOUT_MS=9000;
export function VideoPlayer({animeId,episodeNumber,audio}:StreamRequest){
 const [selected,setSelected]=useState<ProviderId>("aniembed");
 const [attempted,setAttempted]=useState<ProviderId[]>([]);
 const [message,setMessage]=useState("Choose a configured server to start playback.");
 const [reloadKey,setReloadKey]=useState(0);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const provider=providers.find(p=>p.id===selected);
 const url=provider?.buildEmbedUrl({animeId,episodeNumber,audio})||null;
 const ready=providers.filter(p=>Boolean(p.buildEmbedUrl({animeId,episodeNumber,audio})));
 function startProvider(id:ProviderId,tried:ProviderId[]=attempted){
   if(timer.current)clearTimeout(timer.current);
   const next=providers.find(p=>p.id===id);if(!next)return;
   const nextUrl=next.buildEmbedUrl({animeId,episodeNumber,audio});
   setSelected(id);setAttempted([...tried,id]);
   if(!nextUrl){setMessage(`${next.label} is not configured. Add its current documented embed template to your environment.`);return}
   setMessage(`Loading ${next.label}…`);
   timer.current=setTimeout(()=>setMessage(`${next.label} has not confirmed playback. Cross-origin players may not expose playback status; switch servers or retry.`),FAILURE_TIMEOUT_MS);
   setReloadKey(k=>k+1);
 }
 function nextServer(){
   const candidate=ready.find(p=>!attempted.includes(p.id));
   if(candidate)startProvider(candidate.id,attempted);else setMessage("No untried configured server remains. Select another server or retry.");
 }
 useEffect(()=>{setAttempted([]);setMessage("Choose a configured server to start playback.");},[animeId,episodeNumber,audio]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 return <div className="player-frame">{url?<iframe key={`${selected}-${reloadKey}-${audio}-${episodeNumber}`} src={url} title={`Anime ${animeId}, episode ${episodeNumber}, ${audio}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="no-referrer" onLoad={()=>{if(timer.current)clearTimeout(timer.current);setMessage(`${provider?.label||"Server"} embed loaded. If the video does not play, switch servers.`)}}/>:<div className="player-placeholder"><PlayCircle size={48} color="#c4b5fd"/><strong>Ready to watch?</strong><p>No playable URL is configured for this server yet. Choose an enabled server or add the provider’s current documented embed template in environment variables.</p></div>}{message&&<div style={{position:"absolute",left:10,right:10,bottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",background:"rgba(8,10,16,.9)",color:"#c9ccda",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:"9px 11px",fontSize:10}}><AlertTriangle size={13} color="#c4b5fd"/><span style={{flex:1}}>{message}</span>{ready.length>0&&<button type="button" onClick={nextServer} className="secondary-button" style={{padding:"6px 8px",fontSize:10}}>Try next server</button>}{url&&<button type="button" onClick={()=>startProvider(selected,attempted.filter(id=>id!==selected))} className="secondary-button" style={{padding:"6px 8px",fontSize:10}}><RefreshCw size={11}/> Retry</button>}</div>}</div>
}
