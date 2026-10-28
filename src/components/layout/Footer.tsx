import Link from "next/link";
export function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><span>© {new Date().getFullYear()} AniScroll · Discover your next story.</span><span><Link href="/about">About</Link> · Metadata via AniList and Kitsu</span></div></footer>;
}
