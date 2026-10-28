import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimeSection } from "@/components/anime/AnimeSection";
import { getAnimeCollections } from "@/lib/anilist";

export const revalidate = 1800;

export default async function HomePage() {
  let collections = { trending: [], popular: [], seasonal: [] } as Awaited<ReturnType<typeof getAnimeCollections>>;
  let unavailable = false;
  try { collections = await getAnimeCollections(); } catch { unavailable = true; }
  const hero = collections.trending[0];
  return <div className="page-shell"><Navbar /><main>
    <section className="hero">
      {hero?.bannerImage && <img className="hero-image" src={hero.bannerImage} alt="" />}
      <div className="hero-shade" /><div className="hero-copy">
        <div className="eyebrow"><span className="pulse-dot" /> Your next obsession starts here</div>
        <h1>Stories that stay with you.</h1>
        <p>Explore worlds beyond imagination. Find seasonal favorites, revisit timeless classics, and discover your next anime.</p>
        <div className="hero-meta"><span className="meta-pill">Sub & Dub</span><span className="meta-pill">Anime discovery</span>{hero?.score && <span className="meta-pill">★ {hero.score.toFixed(1)} AniList</span>}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {hero ? <Link href={`/anime/${hero.id}`} className="primary-button"><Play size={15} fill="currentColor" /> Explore featured anime</Link> : <Link href="/discover" className="primary-button"><Sparkles size={15} /> Explore anime</Link>}
          <Link href="/discover" className="secondary-button">Discover more <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
    {unavailable && <div className="notice">AniList could not be reached. Catalog data will appear when the service is available.</div>}
    {!!collections.trending.length && <AnimeSection title="Trending right now" kicker="What's buzzing" subtitle="The shows everyone is talking about." anime={collections.trending} href="/trending" />}
    {!!collections.seasonal.length && <AnimeSection title="This season" kicker="Fresh episodes" subtitle="Find your next weekly watch." anime={collections.seasonal} href="/discover" />}
    {!!collections.popular.length && <AnimeSection title="Popular anime" kicker="Fan favorites" subtitle="Great picks for your next marathon." anime={collections.popular} href="/popular" />}
    {!collections.trending.length && !collections.popular.length && !collections.seasonal.length && <div className="empty-state">No catalog data available right now.</div>}
  </main><Footer /></div>;
}
