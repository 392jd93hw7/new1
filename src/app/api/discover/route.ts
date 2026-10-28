import { NextRequest, NextResponse } from "next/server";
import { getDiscoverAnimePage } from "@/lib/anilist";

export const revalidate = 1800;

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  if (!Number.isInteger(page) || page < 1 || page > 1000) {
    return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
  }
  try {
    const result = await getDiscoverAnimePage(page);
    return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } });
  } catch {
    return NextResponse.json({ error: "Unable to load anime from AniList right now." }, { status: 502 });
  }
}