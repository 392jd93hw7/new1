"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Anime } from "@/types/anime";

type Props = { anime: Anime[] };
const genres = ["Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"];
const seasons = ["WINTER","SPRING","SUMMER","FALL"];
const years = Array.from({length: 10}, (_,i)=>String(new Date().getFullYear()-i));
const formats = ["TV","TV_SHORT","MOVIE","SPECIAL","OVA","ONA","MUSIC"];
const statuses = ["RELEASING","FINISHED","NOT_YET_RELEASED","CANCELLED"];
const selectClass = "discover-filter";
function pretty(value?: string) { return value ? value.replaceAll("_"," ").toLowerCase().replace(/\b\w/g, c=>c.toUpperCase()) : "Unknown"; }

export function DiscoverExperience({ anime }: Props) {
  const [search,setSearch] = useState("");
  const [genre,setGenre] = useState("");
  const [season,setSeason] = useState("");
  const [year,setYear] = useState("");
  const [format,setFormat] = useState("");
  const [status,setStatus] = useState("");
  const [language,setLanguage] = useState("");
  const [rating,setRating] = useState("");
  const [source,setSource] = useState("");
  const [episodeRange,setEpisodeRange] = useState("");
  const [sort,setSort] = useState("DEFAULT");
  const [view,setView] = useState<"grid"|"compact">("grid");
  const [allAnime,setAllAnime] = useState<Anime[]>(anime);
  const [currentPage,setCurrentPage] = useState(1);
  const [hasNextPage,setHasNextPage] = useState(true);
  const [loadingPage,setLoadingPage] = useState(false);
  const [loadError,setLoadError] = useState("");

  const filtered = useMemo(() => {
    let result = allAnime.filter(item => {
      const title = item.title.toLowerCase();
      if (search && !title.includes(search.toLowerCase())) return false;
      if (genre && !(item.genres || []).includes(genre)) return false;
      if (season && item.season !== season) return false;
      if (year && String(item.year || "") !== year) return false;
      if (format && item.format !== format) return false;
      if (status && item.status !== status) return false;
      if (language === "ENGLISH" && !item.title) return false;
      if (rating === "HIGH" && (item.score || 0) < 7) return false;
      if (rating === "TOP" && (item.score || 0) < 8.5) return false;
      if (source && source === "MANGA" ) return false;
      const count = item.episodes || 0;
      if (episodeRange === "SHORT" && (!count || count > 12)) return false;
      if (episodeRange === "MEDIUM" && (count < 13 || count > 26)) return false;
      if (episodeRange === "LONG" && count < 27) return false;
      return true;
    });
    if (sort === "SCORE") result = [...result].sort((a,b)=>(b.score||0)-(a.score||0));
    if (sort === "YEAR") result = [...result].sort((a,b)=>(b.year||0)-(a.year||0));
    if (sort === "TITLE") result = [...result].sort((a,b)=>a.title.localeCompare(b.title));
    return result;
  },[allAnime,search,genre,season,year,format,status,language,rating,source,episodeRange,sort]);

  async function goToPage(page: number) {
    if (page < 1 || loadingPage || page === currentPage) return;
    setLoadingPage(true);
    setLoadError("");
    try {
      const response = await fetch(`/api/discover?page=${page}`);
      if (!response.ok) throw new Error("AniList catalogue could not be loaded. Please try again.");
      const data = await response.json() as { anime: Anime[]; hasNextPage: boolean };
      setAllAnime(data.anime);
      setCurrentPage(page);
      setHasNextPage(data.hasNextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load this page.");
    } finally {
      setLoadingPage(false);
    }
  }

  function reset() { setSearch("");setGenre("");setSeason("");setYear("");setFormat("");setStatus("");setLanguage("");setRating("");setSource("");setEpisodeRange("");setSort("DEFAULT"); }
  const activeFilters = [search,genre,season,year,format,status,language,rating,source,episodeRange].filter(Boolean).length;
  return <div className="discover-experience">
    <div className="discover-heading-row"><div><div className="section-kicker">Find your next obsession</div><h1>Discover anime</h1><p>Explore popular picks, seasonal releases, and hidden gems.</p></div><div className="discover-total"><strong>{filtered.length}</strong><span>titles in this view</span></div></div>
    <section className="discover-filter-panel" aria-label="Anime filters">
      <div className="discover-filter-grid">
        <input className={selectClass+" discover-filter-search"} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anime titles…" aria-label="Search anime titles"/>
        <select className={selectClass} value={genre} onChange={e=>setGenre(e.target.value)} aria-label="Genre"><option value="">All genres</option>{genres.map(v=><option key={v}>{v}</option>)}</select>
        <select className={selectClass} value={season} onChange={e=>setSeason(e.target.value)} aria-label="Season"><option value="">All seasons</option>{seasons.map(v=><option key={v} value={v}>{pretty(v)}</option>)}</select>
        <select className={selectClass} value={year} onChange={e=>setYear(e.target.value)} aria-label="Year"><option value="">All years</option>{years.map(v=><option key={v}>{v}</option>)}</select>
        <select className={selectClass} value={format} onChange={e=>setFormat(e.target.value)} aria-label="Anime format"><option value="">All types</option>{formats.map(v=><option key={v} value={v}>{pretty(v)}</option>)}</select>
        <select className={selectClass} value={status} onChange={e=>setStatus(e.target.value)} aria-label="Status"><option value="">All statuses</option>{statuses.map(v=><option key={v} value={v}>{pretty(v)}</option>)}</select>
        <select className={selectClass} value={language} onChange={e=>setLanguage(e.target.value)} aria-label="Title language"><option value="">Any title language</option><option value="ENGLISH">English title</option></select>
        <select className={selectClass} value={rating} onChange={e=>setRating(e.target.value)} aria-label="Rating"><option value="">Any rating</option><option value="HIGH">7.0+</option><option value="TOP">8.5+</option></select>
        <select className={selectClass} value={source} onChange={e=>setSource(e.target.value)} aria-label="Source"><option value="">All sources</option><option value="MANGA">Manga</option></select>
        <select className={selectClass} value={episodeRange} onChange={e=>setEpisodeRange(e.target.value)} aria-label="Episode range"><option value="">Any episode count</option><option value="SHORT">1–12 episodes</option><option value="MEDIUM">13–26 episodes</option><option value="LONG">27+ episodes</option></select>
        <select className={selectClass} value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort results"><option value="DEFAULT">Recommended</option><option value="SCORE">Highest rated</option><option value="YEAR">Newest year</option><option value="TITLE">Title A–Z</option></select>
      </div>
      <div className="discover-filter-actions"><span>{activeFilters ? `${activeFilters} filter${activeFilters===1?"":"s"} applied` : "Refine your anime list"}</span><div><button type="button" className="discover-reset" onClick={reset}>Reset filters</button><button type="button" className="discover-apply" onClick={()=>setShowAll(true)}>Show {filtered.length} results</button></div></div>
    </section>
    <div className="discover-results-heading"><div><h2>{search || genre ? "Matching anime" : "Explore anime"}</h2><p>Titles and artwork provided by AniList.</p></div><div className="discover-view-toggle"><button type="button" className={view==="grid"?"active":""} onClick={()=>setView("grid")} aria-label="Grid view">▦</button><button type="button" className={view==="compact"?"active":""} onClick={()=>setView("compact")} aria-label="Compact view">☷</button></div></div>
    {filtered.length ? <div className={`anime-grid discover-grid ${view==="compact"?"compact":""}`}>{filtered.map(item=><article className="anime-card discover-card" key={item.id}><Link className="poster-link" href={`/anime/${item.id}`} aria-label={`View ${item.title}`}>{item.coverImage ? <img src={item.coverImage} alt={item.title} loading="lazy"/> : <div className="discover-no-poster">AniScroll</div>}<div className="poster-gradient"/>{item.score ? <span className="poster-score">★ {item.score.toFixed(1)}</span>:null}<span className="poster-format">{pretty(item.format)}</span></Link><Link className="anime-title" href={`/anime/${item.id}`}>{item.title}</Link><div className="anime-subtitle">{[item.year,item.episodes ? `${item.episodes} eps` : null,pretty(item.status)].filter(Boolean).join(" · ")}</div></article>)}</div> : <div className="empty-state discover-empty"><h3>No matching anime on this page</h3><p>Try changing or clearing filters, or navigate to another page.</p><button className="discover-apply" onClick={reset}>Clear filters</button></div>}
    <nav className="discover-pagination" aria-label="Discover pages">
      {loadError ? <p role="alert">{loadError}</p> : null}
      <button type="button" className="discover-page-button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1 || loadingPage}>Previous</button>
      <span className="discover-page-status">{loadingPage ? "Loading…" : `Page ${currentPage}`}</span>
      <button type="button" className="discover-page-button" onClick={() => goToPage(currentPage + 1)} disabled={!hasNextPage || loadingPage}>Next</button>
    </nav>
    <p className="discover-page-caption">30 anime per page · navigate through AniList's catalogue</p>
  </div>;
}
