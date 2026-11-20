"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { invitation } from "@/config/invitation";

function Artwork({ cover = false }: { cover?: boolean }) {
  const desktopSrc = cover ? invitation.media.coverDesktop : invitation.media.sceneDesktop;
  const mobileSrc = cover ? invitation.media.coverMobile : invitation.media.sceneMobile;
  const description = cover
    ? invitation.messages.coverAlt
    : "Ivory invitation paper with a soft sage arch and botanical details.";

  return (
    <div className={`artwork ${cover ? "artwork-cover" : ""}`}>
      <Image className="artwork-desktop" src={desktopSrc} alt={description} fill priority={cover} sizes="100vw" />
      <Image className="artwork-mobile" src={mobileSrc} alt={description} fill priority={cover} sizes="100vw" />
    </div>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <div className={`divider ${className}`} aria-hidden="true"><span>✦</span></div>;
}

function FamilyDetails({ name, parents, address }: { name: string; parents: string; address: string }) {
  return (
    <div className="family-details reveal">
      <h2 className="couple-name">{name}</h2>
      <p className="family-line">{parents}</p>
      <p className="address-line">{address}</p>
    </div>
  );
}

function makeCalendarFile() {
  const event = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${invitation.date.isoStart}`,
    `DTEND:${invitation.date.isoEnd}`,
    `SUMMARY:${invitation.messages.calendarSummary}`,
    `LOCATION:${invitation.venue.name}, ${invitation.venue.area}`,
    `DESCRIPTION:${invitation.messages.calendarDescription}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const link = document.createElement("a");
  const url = URL.createObjectURL(new Blob([event], { type: "text/calendar;charset=utf-8" }));
  link.href = url;
  link.download = "mushraf-and-sharfina-wedding.ics";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function shareOnWhatsApp() {
  const message = [
    invitation.messages.shareIntro,
    `${invitation.names.groom} & ${invitation.names.bride}`,
    `${invitation.date.gregorian} · ${invitation.date.timeRange}`,
    `${invitation.venue.name}, ${invitation.venue.area}`,
    invitation.venue.mapUrl,
    window.location.href,
  ].join("\n");
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

const petalCount = 18;

export function Invitation() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [remaining, setRemaining] = useState([0, 0, 0, 0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!opened) return;
    const update = () => {
      const target = new Date(invitation.date.countdownTarget).getTime();
      const ms = Math.max(0, target - Date.now());
      setRemaining([
        Math.floor(ms / 86_400_000),
        Math.floor((ms / 3_600_000) % 24),
        Math.floor((ms / 60_000) % 60),
        Math.floor((ms / 1_000) % 60),
      ]);
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [opened]);

  useEffect(() => {
    document.body.classList.toggle("invitation-locked", !opened);
    return () => document.body.classList.remove("invitation-locked");
  }, [opened]);

  const openInvitation = useCallback(() => {
    setOpened(true);
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      void audio.play().catch(() => {
        audio.muted = true;
        setMuted(true);
      });
    }
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
    if (!audio.muted && audio.paused) void audio.play().catch(() => setMuted(true));
  };

  return (
    <main className="invitation-shell min-h-screen">
      <audio ref={audioRef} src={invitation.media.music} preload="none" loop aria-hidden="true" />

      {opened && (
        <div className="petal-shower" aria-hidden="true">
          {Array.from({ length: petalCount }, (_, index) => <span className={`falling-flower petal-${index + 1}`} key={index} />)}
        </div>
      )}

      <section className={`cover fixed inset-0 grid place-items-center ${opened ? "cover-opened" : ""}`} aria-label="Wedding invitation cover" aria-hidden={opened} inert={opened}>
        <Artwork cover />
        <div className="cover-ornament" aria-hidden="true">❧</div>
        <div className="cover-copy">
          <p className="cover-label">{invitation.labels.invitation}</p>
          <Divider className="cover-divider" />
          <h1 className="cover-name">{invitation.names.groom}</h1>
          <span className="cover-ampersand" aria-hidden="true">&amp;</span>
          <h2 className="cover-name">{invitation.names.bride}</h2>
          <Divider className="cover-divider lower-rule" />
          <p className="cover-date">{invitation.date.coverGregorian}</p>
          <p className="cover-hijri">{invitation.date.hijri}</p>
          <button className="open-button" onClick={openInvitation}>{invitation.labels.tapToOpen}</button>
        </div>
      </section>

      {opened && (
        <div className="invitation-content">
          <section className="scene welcome-scene" aria-label="Welcome">
            <Artwork />
            <div className="scene-copy welcome-copy">
              <p className="bismillah reveal">{invitation.messages.bismillah}</p>
              <p className="welcome-translation reveal">
                <span>{invitation.messages.inTheName}</span>
                <span>{invitation.messages.gracious}</span>
              </p>
              <Divider className="welcome-divider reveal" />
              <h2 className="section-heading reveal">{invitation.messages.welcomeHeading}</h2>
              <Divider className="welcome-divider reveal" />
              <p className="invitation-paragraph reveal">{invitation.messages.invitation}</p>
            </div>
            <a className="scroll-prompt" href="#verse" aria-label={invitation.messages.scrollToVerse}>
              <span>{invitation.labels.scroll}</span><b aria-hidden="true">⌄</b>
            </a>
          </section>

          <section className="scene verse-scene" id="verse" aria-label="The couple">
            <Artwork />
            <div className="scene-copy couple-copy">
              <div className="verse-block reveal">
                <p lang="ar" dir="rtl" className="verse-arabic">{invitation.messages.verseArabic}</p>
                <p className="verse-citation">{invitation.messages.verseCitation}</p>
                <p className="verse-translation">{invitation.messages.verseTranslation}</p>
              </div>
              <Divider className="family-divider reveal" />
              <FamilyDetails name={invitation.names.groom} parents={invitation.families.groomParents} address={invitation.families.groomAddress} />
              <span className="couple-ampersand reveal" aria-hidden="true">&amp;</span>
              <FamilyDetails name={invitation.names.bride} parents={invitation.families.brideParents} address={invitation.families.brideAddress} />
            </div>
          </section>

          <section className="scene wedding-scene" aria-label="Wedding ceremony and venue">
            <Artwork />
            <div className="scene-copy wedding-copy">
              <p className="eyebrow reveal">{invitation.labels.wedding}</p>
              <Divider className="wedding-divider reveal" />
              <p className="ceremony-date reveal">{invitation.date.gregorian}</p>
              <p className="ceremony-time reveal">{invitation.date.timeRange}</p>
              <div className="venue-block reveal">
                <h2>{invitation.venue.name}</h2>
                <p className="venue-area">{invitation.venue.area}</p>
                <a className="map-link" href={invitation.venue.mapUrl} target="_blank" rel="noreferrer">
                  <span aria-hidden="true">⌖</span> {invitation.labels.openMap}
                </a>
              </div>
              <Divider className="wedding-divider lower-wedding-divider reveal" />
              <p className="in-sha-allah reveal">{invitation.messages.inShaAllah}</p>
              <div className="best-wishes reveal">
                <p>{invitation.messages.bestWishes}</p>
                <p className="wisher-names">{invitation.messages.wishers}</p>
              </div>
            </div>
          </section>

          <section className="countdown-section" aria-label="Countdown and save the date">
            <Artwork />
            <div className="countdown-inner">
              <section className="countdown-card reveal">
                <p className="eyebrow">{invitation.labels.countdown}</p>
                <Divider />
                <div className="countdown-grid" aria-live="off">
                  {remaining.map((value, index) => {
                    const labels = [invitation.labels.days, invitation.labels.hours, invitation.labels.minutes, invitation.labels.seconds];
                    return <div className="count-unit" key={labels[index]}><span>{String(value).padStart(2, "0")}</span><small>{labels[index]}</small></div>;
                  })}
                </div>
                <p className="countdown-date">{invitation.date.gregorian} · {invitation.date.startTime}</p>
              </section>
              <section className="save-date-card reveal">
                <p className="eyebrow">{invitation.labels.saveTheDate}</p>
                <Divider />
                <p className="save-date-numbers">{invitation.date.short}</p>
                <p className="save-date-couple">{invitation.names.short}</p>
                <p className="save-date-time">{invitation.labels.wedding} · {invitation.date.timeRange}</p>
                <button className="calendar-button" onClick={makeCalendarFile}>{invitation.labels.addToCalendar}</button>
              </section>
              <section className="share-card reveal">
                <p className="eyebrow">{invitation.labels.shareInvitation}</p>
                <Divider />
                <button className="whatsapp-button" onClick={shareOnWhatsApp}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M9 8.2c.2-.5.5-.5.8-.5l.5.1c.2 0 .3.1.4.4l.6 1.4c.1.2.1.4 0 .6l-.4.6c-.1.1-.2.3 0 .5.3.5.8 1 1.3 1.3.2.1.4.2.5 0l.6-.7c.2-.2.3-.2.6-.1l1.3.6c.3.1.4.2.4.4s-.1.9-.6 1.2c-.4.4-1 .6-1.6.5-.5-.1-1.2-.3-2-.7a7.5 7.5 0 0 1-2.5-2.2c-.7-1-.9-1.8-.8-2.3.1-.5.5-.9.9-1.1Z" fill="currentColor" />
                  </svg>
                  {invitation.labels.shareWhatsApp}
                </button>
              </section>
            </div>
          </section>

          <footer className="footer">
            <Artwork />
            <Divider />
            <p className="footer-couple">{invitation.names.short}</p>
            <p className="footer-credit">{invitation.messages.createdWith} <span>{invitation.messages.creator}</span></p>
          </footer>
        </div>
      )}

      {opened && <button className="music-button" onClick={toggleMusic} aria-label={muted ? invitation.messages.musicUnmute : invitation.messages.musicMute} aria-pressed={!muted}>
        <span aria-hidden="true">{muted ? "♬̸" : "♫"}</span>
      </button>}
    </main>
  );
}
