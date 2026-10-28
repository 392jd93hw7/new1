"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, ChevronLeft, ChevronRight, Radio, RefreshCw } from "lucide-react";
import type { AiringEntry } from "@/lib/anilist";

function startOfWeek(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
}
function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(timestamp * 1000));
}
function Countdown({ airingAt }: { airingAt: number }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (now === null) return <span className="schedule-countdown"><Clock3 size={12}/>Calculating…</span>;
  const seconds = Math.max(0, Math.floor(airingAt - now / 1000));
  if (!seconds) return <span className="schedule-live"><Radio size={12}/> Airing now / aired</span>;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return <span className="schedule-countdown"><Clock3 size={12}/>{days ? `${days}d ` : ""}{hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}</span>;
}

export function ScheduleExperience({ initialEntries, initialWeek }: { initialEntries: AiringEntry[]; initialWeek: string }) {
  const [entries] = useState(initialEntries);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(initialWeek)));
  const [selectedDay, setSelectedDay] = useState(() => dateKey(new Date(initialWeek)));
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  }), [weekStart]);
  const inWeek = days.some(day => dateKey(day) === selectedDay);
  const effectiveDay = inWeek ? selectedDay : dateKey(days[0]);
  const selectedDate = days.find(day => dateKey(day) === effectiveDay) || days[0];
  const dayEntries = entries.filter(item => dateKey(new Date(item.airingAt * 1000)) === effectiveDay);
  const [todayKey, setTodayKey] = useState(() => dateKey(new Date(initialWeek)));
  useEffect(() => { setTodayKey(dateKey(new Date())); }, []);
  const isCurrentWeek = dateKey(startOfWeek(new Date(initialWeek))) === dateKey(weekStart);
  const isToday = effectiveDay === todayKey;

  return <div className="schedule-page">
    <section className="schedule-hero">
      <div className="schedule-hero-icon"><CalendarDays size={23}/></div>
      <div className="section-kicker">Never miss an episode</div>
      <h1>Weekly airing schedule</h1>
      <p>Upcoming anime episodes, sourced from AniList and shown in your local time.</p>
      <div className="schedule-hero-meta"><span><span className="schedule-live-dot"/> Live schedule data</span><span>·</span><span>{entries.length} episodes this week</span></div>
    </section>
    <section className="schedule-board">
      <div className="schedule-week-heading">
        <div><div className="section-kicker">Your weekly guide</div><h2>{weekStart.toLocaleDateString(undefined,{month:"long",day:"numeric"})} – {days[6].toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}</h2></div>
        <div className="schedule-week-actions">
          <button className="schedule-icon-button" aria-label="Previous week" onClick={() => {const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d);setSelectedDay(dateKey(d));}}><ChevronLeft size={18}/></button>
          <button className="schedule-today-button" onClick={() => {setWeekStart(startOfWeek(new Date()));setSelectedDay(todayKey);}}>Today</button>
          <button className="schedule-icon-button" aria-label="Next week" onClick={() => {const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d);setSelectedDay(dateKey(d));}}><ChevronRight size={18}/></button>
        </div>
      </div>
      <div className="schedule-days" role="tablist" aria-label="Days of the week">
        {days.map((day,index) => {
          const key=dateKey(day);
          const count=entries.filter(item=>dateKey(new Date(item.airingAt*1000))===key).length;
          return <button key={key} role="tab" aria-selected={effectiveDay===key} className={`schedule-day ${effectiveDay===key?"selected":""} ${key===todayKey?"is-today":""}`} onClick={()=>setSelectedDay(key)}>
            <span className="schedule-day-name">{day.toLocaleDateString(undefined,{weekday:"short"})}</span><span className="schedule-day-number">{day.getDate()}</span><span className="schedule-day-count">{count} ep{count===1?"":"s"}</span>
          </button>;
        })}
      </div>
      <div className="schedule-list-heading"><div><h3>{isToday?"Today":selectedDate.toLocaleDateString(undefined,{weekday:"long"})}</h3><p>{selectedDate.toLocaleDateString(undefined,{month:"long",day:"numeric"})} · {dayEntries.length} scheduled episode{dayEntries.length===1?"":"s"}</p></div><span className="schedule-timezone">Times in your local timezone</span></div>
      {dayEntries.length ? <div className="schedule-cards">{dayEntries.map(item => <article className="schedule-card" key={item.id}>
        <Link href={`/anime/${item.media.id}`} className="schedule-poster"><img src={item.media.coverImage || "/placeholder-anime.png"} alt={item.media.title} loading="lazy"/><span className="schedule-episode-tag">EP {item.episode}</span></Link>
        <div className="schedule-card-content"><div className="schedule-card-top"><span className="schedule-air-time">{formatTime(item.airingAt)}</span><span className="schedule-format">{item.media.format?.replaceAll("_"," ") || "ANIME"}</span></div>
          <Link href={`/anime/${item.media.id}`} className="schedule-anime-title">{item.media.title}</Link>
          <div className="schedule-episode-title">Episode {item.episode}{item.media.episodes? ` of ${item.media.episodes}`:""}</div>
          {item.media.genres?.length>0&&<div className="schedule-genres">{item.media.genres.slice(0,3).map(genre=><span key={genre}>{genre}</span>)}</div>}
          <div className="schedule-card-bottom"><Countdown airingAt={item.airingAt}/><Link href={`/anime/${item.media.id}`} className="schedule-details-link">Anime details <ChevronRight size={14}/></Link></div>
        </div>
      </article>)}</div> : <div className="schedule-empty"><div className="schedule-empty-icon"><CalendarDays size={24}/></div><h3>No episodes scheduled</h3><p>{isCurrentWeek?"AniList has no airing entries for this day, or its schedule is temporarily unavailable.":"This view is outside the currently loaded week. Return to this week to see live airing data."}</p><button className="schedule-today-button" onClick={()=>{setWeekStart(startOfWeek(new Date()));setSelectedDay(todayKey);}}><RefreshCw size={13}/> Back to today</button></div>}
      <p className="schedule-disclaimer">Airing times and episode availability are provided by AniList and may change. Countdown uses your device clock.</p>
    </section>
  </div>;
}
