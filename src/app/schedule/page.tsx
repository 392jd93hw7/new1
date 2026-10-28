import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScheduleExperience } from "@/components/schedule/ScheduleExperience";
import { getAiringSchedule } from "@/lib/anilist";

export const metadata: Metadata = {
  title: "Weekly Anime Airing Schedule",
  description: "Browse this week's anime airing schedule, upcoming episode times and countdowns on AniScroll.",
  openGraph: { title: "Weekly Anime Airing Schedule | AniScroll", description: "See which anime episodes air each day and how long until the next episode." }
};

export default async function SchedulePage() {
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 7);
  const from = Math.floor(monday.getTime() / 1000);
  const to = Math.floor(sunday.getTime() / 1000) - 1;
  const initialEntries = await getAiringSchedule(from, to).catch(() => []);
  return <div className="page-shell"><Navbar/><main className="schedule-main">
    <ScheduleExperience initialEntries={initialEntries} initialWeek={monday.toISOString()} />
  </main><Footer/></div>;
}
