import type {Metadata} from "next";
import {Navbar} from "@/components/layout/Navbar";
import {Footer} from "@/components/layout/Footer";
import {AnimeGrid} from "@/components/anime/AnimeGrid";
import {getAnimeCollections} from "@/lib/anilist";
export const metadata:Metadata={title:"Popular anime",description:"Browse popular anime titles."};
export const revalidate=1800;
export default async function PopularPage(){const data=await getAnimeCollections().then(x=>x.popular).catch(()=>[]);return <div className="page-shell"><Navbar/><main><section className="section" style={{paddingTop:28}}><div className="section-kicker">Fan favorites</div><h1 style={{fontSize:38,letterSpacing:"-1.5px",margin:"8px 0 24px"}}>Popular anime</h1><AnimeGrid anime={data}/></section></main><Footer/></div>}
