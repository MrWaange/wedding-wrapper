"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Platform = "ios" | "android" | "other";

function detectPlatform(ua: string): Platform {
  const u = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(u)) return "ios";
  if (/android/.test(u)) return "android";
  return "other";
}

function isInAppBrowser(ua: string) {
  const u = ua.toLowerCase();
  return /(instagram|fbav|fban|messenger|tiktok|snapchat|pinterest|line|twitter)/.test(u);
}

export default function InstallPage() {
  const appUrl = "/";
  const [ua, setUa] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const instructionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    setUa(userAgent);

    // Om den redan körs som app: gå direkt till appen
    const iosStandalone = (window.navigator as any).standalone === true;
    const mqStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches === true;
    if (iosStandalone || mqStandalone) window.location.replace(appUrl);
  }, []);

  const platform = useMemo(() => detectPlatform(ua), [ua]);
  const inApp = useMemo(() => isInAppBrowser(ua), [ua]);

  // Lås upp knappen när användaren scrollat igenom instruktionerna
  useEffect(() => {
    const el = instructionsRef.current;
    if (!el) return;

    const unlockIfRead = () => {
      // Om de scrollat nära botten av instruktionerna
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      if (nearBottom) setUnlocked(true);
    };

    el.addEventListener("scroll", unlockIfRead, { passive: true });
    unlockIfRead();

    return () => el.removeEventListener("scroll", unlockIfRead);
  }, [instructionsRef.current]);

  const primaryLabel =
    inApp && platform === "ios"
      ? "Öppna i Safari"
      : inApp && platform === "android"
      ? "Öppna i Chrome"
      : "Öppna";

  const tip =
    inApp && platform === "ios"
      ? 'Du verkar öppna i en app. Tryck på delningsmenyn och välj “Öppna i Safari”.'
      : inApp && platform === "android"
      ? 'Du verkar öppna i en app. Öppna i Chrome för att kunna installera.'
      : "";

  const stepsTitle =
    platform === "ios" ? "iPhone (Safari)" : platform === "android" ? "Android (Chrome)" : "Mobil";

  return (
    <main className="min-h-screen text-white bg-black">
      {/* Subtil lyxig bakgrund */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-85 bg-[radial-gradient(60%_40%_at_50%_18%,rgba(208,158,43,0.18),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(55%_35%_at_50%_88%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%)]" />
      </div>

      <div className="mx-auto max-w-[560px] px-6 py-12">
        {/* Monogram */}
        <div className="flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_70px_rgba(208,158,43,0.22)]">
            <img src="/icon-512.png" alt="Monogram" className="h-14 w-14 opacity-95" />
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Private access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Välkommen</h1>
          <p className="mt-3 text-white/75">
            För bästa upplevelse — lägg till appen på hemskärmen.
          </p>
        </div>

        {tip && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/80">{tip}</p>
          </div>
        )}

        {/* Diskret 1–2–3 */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 font-semibold text-white/80">
                1
              </span>
              <span>Öppna i Safari/Chrome</span>
            </div>

            <div className="h-px flex-1 bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 font-semibold text-white/80">
                2
              </span>
              <span>Lägg till på hemskärmen</span>
            </div>

            <div className="h-px flex-1 bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 font-semibold text-white/80">
                3
              </span>
              <span>Öppna ikonen</span>
            </div>
          </div>
        </div>

        {/* Instruktioner först (scroll-box) */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{stepsTitle}</h2>
            {!unlocked ? (
              <span className="text-xs text-white/50">Läs för att låsa upp</span>
            ) : (
              <span className="text-xs text-white/60">Redo</span>
            )}
          </div>

          <div
            ref={instructionsRef}
            className="mt-3 max-h-40 overflow-auto pr-2"
          >
            {platform === "ios" && (
              <ol className="list-decimal space-y-2 pl-5 text-white/80">
                <li>Öppna den här sidan i <strong>Safari</strong></li>
                <li>Tryck <strong>Dela</strong> (⬆️)</li>
                <li>Välj <strong>Lägg till på hemskärmen</strong></li>
                <li>Öppna ikonen från hemskärmen</li>
                <li className="text-white/60">
                  Om alternativet saknas: du är troligen i en in-app browser — öppna i Safari.
                </li>
              </ol>
            )}

            {platform === "android" && (
              <ol className="list-decimal space-y-2 pl-5 text-white/80">
                <li>Öppna länken i <strong>Chrome</strong></li>
                <li>Tryck på <strong>⋮</strong></li>
                <li>Välj <strong>Installera app</strong> eller <strong>Lägg till på startskärmen</strong></li>
                <li>Öppna ikonen från startskärmen</li>
                <li className="text-white/60">
                  Om du är i en in-app browser: välj “Öppna i Chrome”.
                </li>
              </ol>
            )}

            {platform === "other" && (
              <div className="text-white/80">
                Öppna länken på din mobil för att installera appen på hemskärmen.
              </div>
            )}
          </div>

          {/* Manuell unlock (för de som inte scrollar) */}
          {!unlocked && (
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85"
            >
              Jag förstår
            </button>
          )}
        </div>

        {/* Knappar efter instruktion */}
        <div className="mt-7 flex flex-col gap-3">
          <a
            href={unlocked ? appUrl : undefined}
            onClick={(e) => {
              if (!unlocked) e.preventDefault();
            }}
            className={[
              "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold transition",
              unlocked
                ? "bg-[#D09E2B] text-black shadow-[0_10px_30px_rgba(208,158,43,0.25)]"
                : "bg-[#D09E2B]/40 text-black/70 cursor-not-allowed",
            ].join(" ")}
          >
            {primaryLabel}
          </a>

          <a
            href={appUrl}
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-base font-medium text-white/90"
          >
            Fortsätt i webben
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-white/40">
          Tillgång via QR-kod • Endast för gäster
        </p>
      </div>
    </main>
  );
}