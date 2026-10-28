import Link from "next/link";
import { House, CalendarDays, Flame, Clapperboard } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

const links = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/schedule", label: "Schedule" }
];

export function Navbar() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="AniScroll home">
            <span className="brand-mark"><Clapperboard size={19} strokeWidth={2.6} /></span>
            <span>Ani<span style={{ color: "#c4b5fd" }}>Scroll</span></span>
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
          <SearchBar />
        </div>
      </header>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/"><House size={18} /><span>Home</span></Link>
        <Link href="/trending"><Flame size={18} /><span>Trending</span></Link>
        <Link href="/schedule"><CalendarDays size={18} /><span>Schedule</span></Link>
      </nav>
    </>
  );
}
