# AniScroll

A Next.js + TypeScript + Tailwind foundation for a responsive anime discovery and streaming interface.

## Included
- AniList GraphQL metadata, trending/popular/current-season sections, and search
- Debounced live search dropdown
- SEO metadata on home, search, anime details and episode pages
- Kitsu best-effort episode title/thumbnail lookup
- Separate Sub/Dub controls and AniEmbed streaming server
- Mobile navigation and responsive dark UI

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## Streaming embed URL
- AniEmbed: `https://aniembed.se/e/{ANILIST_ID}/{EPISODE}?lang={audio}`

The adapter replaces the AniList ID, episode number, and selected audio value (`sub` or `dub`). You can override the template with the optional environment variable in `.env.example`.

## Important limitations
The app embeds the provider URL as given; it does not control advertising, redirects, playback, or availability inside third-party providers. Cross-origin iframe restrictions mean the app cannot reliably inspect a provider's internal playback state or stop its internal ad redirects. If an embed page redirects to ads, the reliable solution is a provider-supported ad-free embed mode or a different authorized provider—not a client-side redirect blocker.

Kitsu matching is fuzzy/best-effort; alternate titles, seasons, specials and OVAs can differ in numbering and may require curated mapping. The weekly schedule page is currently a placeholder.

## Deployment
Import this repository in Vercel, configure `NEXT_PUBLIC_SITE_URL` if needed, and deploy. If overriding the AniEmbed template, add `NEXT_PUBLIC_ANIEMBED_EMBED_TEMPLATE` in Vercel and redeploy.
