import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiscoverExperience } from "@/components/discover/DiscoverExperience";
import { getAnimeCollections } from "@/lib/anilist";

export const metadata: Metadata = {
  title: "Discover Anime | AniScroll",
  description: "Discover anime with filters for genre, season, year, format, status, rating, and episode count.",
};
export const revalidate = 1800;

export default async function DiscoverPage() {
  const data = await getAnimeCollections().catch(() => ({ trending: [], popular: [], seasonal: [] }));
  const allAnime = [...data.trending, ...data.seasonal, ...data.popular];
  const uniqueAnime = Array.from(new Map(allAnime.map((anime) => [anime.id, anime])).values());
  return (
    <div className="page-shell">
      <Navbar />
      <main className="discover-main">
        <DiscoverExperience anime={uniqueAnime} />
      </main>
      <Footer />
    </div>
  );
}
