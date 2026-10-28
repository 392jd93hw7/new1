# AniScroll

Anime discovery and streaming UI built with Next.js, TypeScript, and Tailwind CSS.

## Planned integration
- AniList GraphQL for anime metadata
- Kitsu API for episode details and thumbnails when available
- Provider adapter layer for AniEmbed, NovusCloud, and ZokoAnime
- Debounced live search
- Separate Sub/Dub and server selection
- Automatic fallback for providers when failure can be detected

## Disclaimer
Use streaming providers only where you have permission to embed their content. This app does not guarantee that third-party players are free of ads or redirects. Third-party iframe behavior is controlled by the provider.

## Development

```bash
npm install
npm run dev
```

Configure provider templates in `.env.local`; see `.env.example`.
