import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimeSection } from "@/components/anime/AnimeSection";
import { getAnimeCollections } from "@/lib/anilist";
export const metadata: Metadata = {title:"Discover anime",description:"Discover trending, popular and seasonal anime."};
export const revalidate=1800;
export default async function DiscoverPage() {
 const data=await getAnimeCollections().catch(()=>({trending:[],popular:[],seasonal:[]}));
 return <div className="page-shell"><Navbar/><main><section className="section" style={{paddingTop:25}}><div className="section-kicker">Your next favorite</div><h1 style={{fontSize:38,letterSpacing:"-1.5px",margin:"8px 0"}}>Discover anime</h1><p style={{color:"var(--muted)",fontSize:13,lineHeight:1.8}}>Explore current trends, seasonal releases and enduring favorites.</p></section>{!!data.trending.length&&<AnimeSection title="Trending" kicker="Right now" subtitle="Hot titles from AniList." anime={data.trending}/ >}{!!data.seasonal.length&&<AnimeSection title="Seasonal anime" kicker="Current season" subtitle="Fresh from this season." anime={data.seasonal}/ >}{!!data.popular.length&&<AnimeSection title="Popular" kicker="Fan favorites" subtitle="Widely watched anime." anime={data.popular}/ >}{!data.trending.length&&!data.popular.length&&<div className="empty-state">Catalog unavailable. Try again shortly.</div>}</main><Footer/></div>;
}
