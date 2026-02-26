"use client";

import { useEffect, useMemo, useState } from "react";

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

  return (
    <main className="min-h-screen text-white bg-black">
      {/* Subtil lyxig bakgrund */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(60%_40%_at_50%_20%,rgba(208,158,43,0.18),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(55%_35%_at_50%_85%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%)]" />
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
            Lägg till appen på hemskärmen för snabb åtkomst under helgen.
          </p>
        </div>

        {tip && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/80">{tip}</p>
          </div>
        )}

        <div className="mt-9 flex flex-col gap-3">
          {/* Smart knapp-text (kan inte tvinga Safari/Chrome, men guidar rätt) */}
          <a
            href={appUrl}
            className="inline-flex items-center justify-center rounded-2xl bg-[#D09E2B] px-5 py-3 text-base font-semibold text-black shadow-[0_10px_30px_rgba(208,158,43,0.25)]"
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

        {/* Instruktioner */}
        <div className="mt-10 space-y-6">
          {platform === "ios" && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">iPhone (Safari)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/80">
                <li>Öppna den här sidan i <strong>Safari</strong></li>
                <li>Tryck <strong>Dela</strong> (⬆️)</li>
                <li>Välj <strong>Lägg till på hemskärmen</strong></li>
                <li>Öppna ikonen från hemskärmen</li>
              </ol>
              <p className="mt-3 text-sm text-white/60">
                Ser du inte alternativet? Öppna länken i Safari (inte i en in-app browser).
              </p>
            </section>
          )}

          {platform === "android" && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Android (Chrome)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/80">
                <li>Tryck på <strong>⋮</strong></li>
                <li>Välj <strong>Installera app</strong> eller <strong>Lägg till på startskärmen</strong></li>
                <li>Öppna ikonen från startskärmen</li>
              </ol>
            </section>
          )}

          {platform === "other" && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Tips</h2>
              <p className="mt-2 text-white/80">
                Öppna länken på din mobil för att installera appen på hemskärmen.
              </p>
            </section>
          )}
        </div>

        <p className="mt-10 text-center text-xs text-white/40">
          Tillgång via QR-kod • Endast för gäster
        </p>
      </div>
    </main>
  );
}