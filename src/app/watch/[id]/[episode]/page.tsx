import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAnimeById } from "@/lib/anilist";
import { getEpisodeData } from "@/lib/kitsu";
import { WatchExperience } from "@/components/player/WatchExperience";

type Props = { params: Promise<{ id: string; episode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, episode } = await params;
  const anime = await getAnimeById(Number(id)).catch(() => null);
  return {
    title: anime ? `Watch ${anime.title} Episode ${episode} | AniScroll` : "Watch anime | AniScroll",
    description: anime ? `Watch ${anime.title} episode ${episode}, browse episodes, and switch streaming servers on AniScroll.` : "Anime episode player.",
  };
}

export default async function WatchPage({ params }: Props) {
  const { id, episode } = await params;
  const animeId = Number(id);
  const episodeNumber = Number(episode);
  if (!Number.isInteger(animeId) || animeId <= 0 || !Number.isInteger(episodeNumber) || episodeNumber <= 0) notFound();
  const anime = await getAnimeById(animeId).catch(() => null);
  if (!anime) notFound();
  const info = await getEpisodeData(anime.title).catch(() => ({ episodes: [] }));
  const current = info.episodes.find((item) => item.number === episodeNumber);
  const episodeTitle = current?.title || `Episode ${episodeNumber}`;
  const synopsis = anime.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  return (
    <div className="page-shell watch-page">
      <Navbar />
      <main className="watch-page-main">
        <nav className="watch-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href={`/anime/${anime.id}`}>{anime.title}</Link><span>/</span><span>Episode {episodeNumber}</span>
        </nav>
        <div className="watch-layout watch-layout-redesign">
          <section className="watch-primary-column">
            <WatchExperience
              animeId={anime.id}
              initialEpisode={episodeNumber}
              initialAudio="sub"
              episodes={info.episodes}
              title={anime.title}
            />
            <section className="watch-anime-info">
              <div className="watch-anime-poster">
                {anime.coverImage ? <img src={anime.coverImage} alt={anime.title} /> : <PlayCircle size={38} />}
              </div>
              <div className="watch-anime-copy">
                <div className="watch-section-kicker">Now streaming</div>
                <h1>{anime.title}</h1>
                {anime.nativeTitle && <div className="watch-native-title">{anime.nativeTitle}</div>}
                <div className="watch-anime-meta">
                  {anime.year && <span>{anime.year}</span>}
                  {anime.format && <span>{anime.format.replaceAll("_", " ")}</span>}
                  {anime.episodes && <span>{anime.episodes} episodes</span>}
                  {anime.score != null && <span className="watch-score">★ {anime.score.toFixed(1)}</span>}
                </div>
                <p>{synopsis?.slice(0, 430) || "Explore episode details and continue watching."}</p>
                {anime.genres?.length > 0 && <div className="watch-genres">{anime.genres.slice(0, 6).map((genre) => <span key={genre}>{genre}</span>)}</div>}
                <Link href={`/anime/${anime.id}`} className="watch-details-link">View anime details <ArrowRight size={14} /></Link>
              </div>
            </section>
          </section>
          <aside className="watch-sidebar">
            <div className="watch-sidebar-heading"><div><span className="watch-section-kicker">Your next adventure</span><h2>Episodes</h2></div><span className="watch-episode-count">{info.episodes.length || "—"}</span></div>
            <div className="watch-sidebar-subtitle">Currently on <strong>Episode {episodeNumber}</strong> · {episodeTitle}</div>
            <div className="watch-sidebar-nav">
              <Link href={`/watch/${anime.id}/${Math.max(1, episodeNumber - 1)}`} className="secondary-button"><ArrowLeft size={14}/> Previous</Link>
              <Link href={`/watch/${anime.id}/${episodeNumber + 1}`} className="primary-button">Next <ArrowRight size={14}/></Link>
            </div>
            <div className="watch-sidebar-hint">Choose an episode below to load it in the player.</div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
