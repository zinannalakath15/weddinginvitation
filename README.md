# Mushraf & Sharfina Wedding Invitation

A mobile-first digital wedding invitation built with the Next.js App Router and Tailwind CSS. Its sage, ivory, and soft-gold botanical theme is designed to feel calm and modern on both phones and larger screens. Invitation copy, dates, venue, map, audio, and artwork paths live in [`config/invitation.ts`](./config/invitation.ts).

## Run locally

1. Install Node.js 20.9 or later.
2. Run `npm ci`.
3. Start the local server with `npm run dev` and open <http://localhost:3000>.

Use `npm run lint` for linting and `npm run build` to create a production build. To serve the production build locally, run `npm start` after `npm run build`.

## Deploy

Push this project to a Git host and import it into a Node.js hosting service such as Vercel. The default Next.js build and start commands are already configured. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL for Open Graph metadata.

## Replace the invitation content

Edit `config/invitation.ts`. Replace the four original local SVG backgrounds in `public/images/` with artwork you own or are licensed to use. Replace `public/audio/wedding-piano-loop.wav` with a locally hosted, licensed or royalty-free music track and update `media.music` if its path changes. Do not add copyrighted third-party artwork or music without permission.

The invitation starts audio after the visitor taps **Tap to Open**, which is needed for reliable browser playback. The visitor can mute or unmute the track with the fixed music button. The calendar button downloads an iCalendar event, WhatsApp sharing opens a prefilled invitation message, and the map button opens Google Maps.

## Reference images

The live invitation inspection images and computed-style snapshot are in `reference/`. Re-capture them with `npm run capture:reference`. The script uses Playwright Core and a local Chrome/Chromium executable; set `CHROMIUM_EXECUTABLE` to its path if the default Windows Chrome path is not available. The capture script accesses the live invitation URL.
