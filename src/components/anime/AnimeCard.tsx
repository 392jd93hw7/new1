import Link from "next/link";
import { Star } from "lucide-react";
import type { Anime } from "@/types/anime";
export function AnimeCard({ anime }: { anime: Anime }) {
 return <article className="anime-card"><Link href={`/anime/${anime.id}`} className="poster-link" aria-label={`View ${anime.title}`}>{anime.coverImage ? <img src={anime.coverImage} alt={anime.title} loading="lazy" /> : <div className="skeleton" />}<span className="poster-gradient" />{anime.score ? <span className="poster-score"><Star size={11} fill="currentColor" /> {anime.score.toFixed(1)}</span> : null}{anime.format && <span className="poster-format">{anime.format.replaceAll("_"," ")}</span>}</Link><Link href={`/anime/${anime.id}`} className="anime-title">{anime.title}</Link><div className="anime-subtitle">{[anime.year, anime.episodes ? `${anime.episodes} eps` : undefined].filter(Boolean).join(" · ") || anime.status || "Anime"}</div></article>;
}
