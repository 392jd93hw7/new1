import { NextRequest, NextResponse } from "next/server";
import { getDiscoverAnimePage } from "@/lib/anilist";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") || "1");
  if (!Number.isInteger(page) || page < 1 || page > 1000) {
    return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
  }
  const allowed = {
    season: ["WINTER", "SPRING", "SUMMER", "FALL"],
    format: ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"],
    status: ["RELEASING", "FINISHED", "NOT_YET_RELEASED", "CANCELLED"],
    rating: ["", "HIGH", "TOP"],
    episodeRange: ["", "SHORT", "MEDIUM", "LONG"],
    sort: ["DEFAULT", "SCORE", "YEAR", "TITLE"]
  };
  const season = params.get("season") || "";
  const format = params.get("format") || "";
  const status = params.get("status") || "";
  const rating = params.get("rating") || "";
  const episodeRange = params.get("episodeRange") || "";
  const sort = params.get("sort") || "DEFAULT";
  if (!allowed.season.includes(season) && season || !allowed.format.includes(format) && format || !allowed.status.includes(status) && status || !allowed.rating.includes(rating) || !allowed.episodeRange.includes(episodeRange) || !allowed.sort.includes(sort)) {
    return NextResponse.json({ error: "Invalid filter value." }, { status: 400 });
  }
  const yearValue = params.get("year");
  const year = yearValue ? Number(yearValue) : undefined;
  if (year !== undefined && (!Number.isInteger(year) || year < 1900 || year > 2200)) {
    return NextResponse.json({ error: "Invalid year." }, { status: 400 });
  }
  try {
    const result = await getDiscoverAnimePage(page, {
      search: (params.get("search") || "").slice(0, 100),
      genre: (params.get("genre") || "").slice(0, 40),
      season: season || undefined,
      year,
      format: format || undefined,
      status: status || undefined,
      rating,
      episodeRange,
      sort
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load anime from AniList right now." }, { status: 502 });
  }
}