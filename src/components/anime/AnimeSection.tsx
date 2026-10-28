import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Anime } from "@/types/anime";
import { AnimeGrid } from "./AnimeGrid";
export function AnimeSection({ title, kicker, subtitle, anime, href }: {title:string;kicker:string;subtitle:string;anime:Anime[];href?:string}) {
 return <section className="section"><div className="section-heading"><div><div className="section-kicker">{kicker}</div><h2>{title}</h2><p>{subtitle}</p></div>{href && <Link href={href} className="section-link">Explore <ArrowRight size={14}/></Link>}</div><AnimeGrid anime={anime}/></section>;
}
