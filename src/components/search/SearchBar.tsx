"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, LoaderCircle, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnimeSearch } from "@/hooks/useAnimeSearch";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading, error } = useAnimeSearch(query);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function goToSearch() {
    const value = query.trim();
    setOpen(false);
    if (value) router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <div className="header-search" ref={wrapper}>
      <form className="search-field" role="search" onSubmit={(event) => { event.preventDefault(); goToSearch(); }}>
        <Search size={17} color="#a78bfa" />
        <input
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key === "ArrowDown" && results[0]) router.push(`/anime/${results[0].id}`);
          }}
          placeholder="Search anime..."
          aria-label="Search anime"
          aria-expanded={open && query.trim().length >= 2}
          aria-controls="live-search-results"
          autoComplete="off"
        />
        {loading ? <LoaderCircle size={16} className="animate-spin" /> : query ? <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setOpen(false); }} style={{ background: "none", color: "#9ca3b7", border: 0, display: "flex", cursor: "pointer" }}><X size={15} /></button> : null}
      </form>
      {open && query.trim().length >= 2 && (
        <div className="search-popover" id="live-search-results" role="listbox" aria-label="Anime search results">
          {loading && <div className="search-status">Searching AniList…</div>}
          {!loading && error && <div className="search-status">{error} Try again in a moment.</div>}
          {!loading && !error && results.length === 0 && <div className="search-status">No anime found. Press Enter to see the full search page.</div>}
          {!loading && results.map((anime) => (
            <button
              type="button"
              role="option"
              aria-selected="false"
              key={anime.id}
              className="search-result"
              onClick={() => { setOpen(false); router.push(`/anime/${anime.id}`); }}
              style={{ width: "100%", border: 0, background: "transparent", color: "inherit", textAlign: "left", cursor: "pointer" }}
            >
              {anime.coverImage ? <img src={anime.coverImage} alt="" loading="lazy" /> : <div className="episode-thumb" />}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="search-result-title">{anime.title}</div>
                <div className="search-result-sub">{[anime.year, anime.format?.replaceAll("_", " ")].filter(Boolean).join(" · ") || "Anime"}</div>
              </div>
              {anime.score ? <span style={{ display: "inline-flex", gap: 4, alignItems: "center", color: "#f2cb80", fontSize: 11 }}><Star size={12} />{anime.score.toFixed(1)}</span> : null}
            </button>
          ))}
          {!loading && !error && results.length > 0 && <button type="button" className="search-status" onClick={goToSearch} style={{ display: "block", width: "100%", border: 0, background: "transparent", textAlign: "center", cursor: "pointer" }}>View all results for “{query.trim()}”</button>}
        </div>
      )}
    </div>
  );
}
