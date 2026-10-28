import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { getAnimeSearchPage } from "@/lib/anilist";
import type { Anime } from "@/types/anime";
export const metadata: Metadata = { title: "Search anime", description: "Search anime by title on AniScroll." };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{q?:string}> }) {
 const {q=""}=await searchParams; let results: Anime[] = []; let failed=false;
 if(q.trim()) { try { results=await getAnimeSearchPage(q.trim()); } catch { failed=true; } }
 return <div className="page-shell"><Navbar/><main><section className="section" style={{paddingTop:24}}><div className="section-kicker">Search AniList</div><h1 style={{fontSize:34,letterSpacing:"-1.3px",margin:"8px 0"}}>{q ? `Results for “${q}”`:"Search anime"}</h1><p style={{color:"var(--muted)",fontSize:13,marginBottom:26}}>{q ? "Matches ranked by relevance.":"Use the search bar above to find a title."}</p>{failed?<div className="empty-state">Search is temporarily unavailable. Please try again.</div>:q?<AnimeGrid anime={results}/>:<div className="empty-state">Start typing in the search box to see live results.</div>}</section></main><Footer/></div>;
}
