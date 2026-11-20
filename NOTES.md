# Live invitation inspection

Inspected `https://invytor.com/mushraf-sharfina` at 390×844 and 1440×900 before creating the app. The live page was opened with its **Tap to Open** control at both sizes.

## Reference states

Playwright captured the cover at both viewports and the opened invitation at both viewports. It also saved full-page screenshots of the opened invitation and an `inspection.json` record of computed styles, audio state, sections, and links in `reference/`.

- `cover-mobile.png` — 390×844 cover.
- `cover-desktop.png` — 1440×900 cover.
- `opened-mobile.png` and `opened-desktop.png` — the first revealed scene at each viewport.
- `opened-mobile-full.png` and `opened-desktop-full.png` — the full opened invitation at each viewport.
- `inspection.json` — rendered font and color measurements, ordered visible copy, audio state, and map/calendar links captured by Playwright.

## Cover

- One viewport tall, with a cream paper card, thin gold ornamental arch, dark red flowers around the edges, and an illustrated couple at the lower right on wide screens / lower center on narrow screens.
- Centered title stack: “Wedding Invitation”, Muhammed Mushraf, an ampersand ornament, Sharfina Sherin, Gregorian date, Hijri date, then “Tap to Open”.
- Mobile names are about 30px in italic Cormorant Garamond; the ampersand is about 32px in gold. The uppercase label and dates use Cinzel with wide tracking (label 8.5px, date 9px, Hijri 8px). Cover name color is deep maroon (#3d0a10); paper is warm ivory.
- The cover image fills the viewport (same art is stretched/cropped to fit the viewport ratio). `Tap to Open` is large tracked Cinzel text. Background color is `#fbf9f2`.
- A repeating background audio element is initially paused and muted. Opening via the button starts it; afterward it is playing and unmuted. The fixed music button changes between pause and play labels.

## Opened invitation, in order

1. **Welcome / prayer:** Bismillah in Arabic; “In the Name of Allah / The Most Gracious & The Most Merciful”; “With great pleasure”; a longer family invitation paragraph. A “Scroll” prompt is anchored near the bottom.
2. **Qur’anic verse and couple:** Surah Ar-Rum 30:21 in Arabic and English; groom name and parents/address; ampersand; bride name and parents/address. This is another viewport-tall scene.
3. **Wedding and venue:** “Thursday · 26 November 2026”, 11:00 AM–3:00 PM, Smart Convention Centre, Chelari, a Google Maps link, “In Sha Allah”, and best wishes from Febitha & Jimshidha. Another viewport-tall scene.
4. **Countdown and save-the-date:** Days/hours/minutes/seconds, date and time, a calendar card for 26 November 2026, and an Add to Calendar button.
5. **Share invitation:** A separate WhatsApp share card with a prefilled message containing the couple, date/time, venue, map link, and invitation URL.
6. **Footer:** “Mushraf & Sharfina” and a small “Created with Invytor” credit.

There is no gallery and no RSVP in the opened page. There is no separate schedule beyond the ceremony time.

## Layout, motion, and scroll

- Scrolling is normal document scrolling on the body. The first three opened scenes are each one `100svh` tall. The countdown block follows them and is about 866px tall on mobile; the footer follows it. A fixed round music button sits at the lower-right corner.
- At 390px the page is a narrow, centered invitation composition. At 1440px the scenes retain centered text while the same background art spans the full width, making the center text feel smaller relative to the frame.
- The page uses warm ivory (`#fdf5ea`), gold decorative strokes, dark maroon text (`#3d0a10`), and a deep wine venue/countdown background (`#1e0408`).
- Computed fonts observed: Cormorant Garamond (couple names and italic display text), Cinzel (small uppercase labels and dates), Amiri (Arabic), and Lora (body copy). The cover names are italic and centered; labels use uppercase and generous letter spacing.
- Decorative petals use a falling animation; invitation text and countdown cards fade/translate into view, with soft transitions. The scroll indicator has a gentle vertical bounce. Motion should be disabled/reduced when the visitor requests reduced motion.
- The cover disappears after the opening gesture; the invitation begins at the welcome scene. Audio starts only after the gesture because the browser blocks automatic audible playback before user interaction.

## Assets and implementation constraints

The original uses `crimson-scroll-bg.webp` and `Aaqa (mp3cut.net).mp3`, plus hosted Google fonts. These will **not** be copied or hotlinked. The clone will use original local decorative artwork, locally authored audio, local/system serif fonts with swap behavior, and a configurable content object. The live map target observed was `https://www.google.com/maps?cid=6058098222266983240`.

## Current visual direction

The invitation is styled in a sage garden palette: deep forest green (`#293e35`), muted sage (`#657a68`), pale sage paper (`#e4eade`), ivory panels, and soft antique gold (`#b79a68`). The cover uses an open, centered typographic layout inside a double pointed arch, with fuller sage and ivory flower clusters around the edges. The couple remains at the lower right, with a flowing red-and-gold bridal outfit and a white groom's coat. Welcome, couple, and venue copy sits directly on the framed floral backgrounds without white panels. Countdown, save-the-date, and WhatsApp actions remain in their separate cards; countdown and save-the-date sit side by side on wider screens and stack on mobile. A subtle local paper-grain texture, layered highlights, and natural shadows add a printed-paper feel. Soft light-pink five-petal blossoms drift continuously after opening and are disabled for reduced-motion preferences. All invitation copy, family details, date, venue, map, music, and footer are retained.

