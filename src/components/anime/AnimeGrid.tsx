import type { Anime } from "@/types/anime";
import { AnimeCard } from "./AnimeCard";
export function AnimeGrid({ anime }: { anime: Anime[] }) {
 if (!anime.length) return <div className="empty-state">No anime found right now. Please try again later.</div>;
 return <div className="anime-grid">{anime.map((item) => <AnimeCard key={item.id} anime={item} />)}</div>;
}
