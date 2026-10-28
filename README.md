# AniScroll

A Next.js + TypeScript + Tailwind foundation for a responsive anime discovery and streaming interface.

## Included
- AniList GraphQL metadata, trending/popular/current-season sections, and search
- Debounced live search dropdown
- SEO metadata on home, search, anime details and episode pages
- Kitsu best-effort episode title/thumbnail lookup
- Separate Sub/Dub buttons and server buttons for AniEmbed, NovusCloud and ZokoAnime
- Manual server switching and a best-effort fallback action
- Mobile navigation and responsive dark UI

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## Provider setup
Set `NEXT_PUBLIC_ANIEMBED_EMBED_TEMPLATE`, `NEXT_PUBLIC_NOVUSCLOUD_EMBED_TEMPLATE`, and `NEXT_PUBLIC_ZOKOANIME_EMBED_TEMPLATE` to their current documented embed URL templates, only where you are authorized to embed content. The adapters support placeholders `{id}`, `{episode}`, and `{audio}` (sub/dub). Templates are intentionally not guessed in code because provider routes and parameters can change. Never put an ad/redirect landing URL in a player template.

## Important limitations
Cross-origin iframe sandboxing means the app can observe that an iframe loaded, but usually cannot inspect the player’s internal playback state or internal redirects. Consequently, fallback is best-effort and user-assisted; it cannot be guaranteed for every provider error. The site cannot guarantee a provider is ad-free or remove behavior controlled by a third-party player. Prefer documented, authorized ad-free embed modes when available.

Kitsu matching is fuzzy/best-effort; alternate titles, seasons, specials and OVAs can differ in numbering and may require curated mapping. The weekly schedule page is currently a placeholder.

## Deployment
Import this repository in Vercel, keep the Next.js defaults, configure provider templates in project environment variables, then redeploy. Do not put private API secrets in `NEXT_PUBLIC_*` values.
