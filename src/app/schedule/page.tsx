import type {Metadata} from "next";
import {CalendarDays} from "lucide-react";
import {Navbar} from "@/components/layout/Navbar";
import {Footer} from "@/components/layout/Footer";
export const metadata:Metadata={title:"Weekly schedule",description:"Weekly airing schedule for anime."};
export default function SchedulePage(){return <div className="page-shell"><Navbar/><main><section className="section" style={{paddingTop:36,maxWidth:800,marginInline:"auto"}}><div className="control-panel" style={{textAlign:"center",padding:44}}><CalendarDays size={36} color="#c4b5fd" style={{margin:"0 auto 16px"}}/><div className="section-kicker">Coming next</div><h1 style={{fontSize:32,letterSpacing:"-1.2px"}}>Weekly airing schedule</h1><p style={{color:"var(--muted)",fontSize:13,lineHeight:1.8}}>The full airing schedule will be populated from AniList airing schedule data in the next iteration.</p></div></section></main><Footer/></div>}
