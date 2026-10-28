import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiscoverExperience } from "@/components/discover/DiscoverExperience";

export const metadata: Metadata = {
  title: "Advanced Anime Search | AniScroll",
  description: "Search the AniList catalogue with detailed anime filters for genre, season, year, format, status, rating, and episode count.",
};

export default function AdvancedSearchPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="discover-main">
        <DiscoverExperience anime={[]} />
      </main>
      <Footer />
    </div>
  );
}
