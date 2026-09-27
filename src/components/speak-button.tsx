"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;
const getServerSnapshot = () => false;

type Props = {
  text: string;
  variant?: "icon" | "button";
  className?: string;
};

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;

  const byPrefix = (prefix: string) =>
    voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));

  return (
    byPrefix("kab") ??
    byPrefix("ber") ??
    byPrefix("fr") ??
    voices.find((v) => v.default) ??
    voices[0]
  );
}

export function SpeakButton({ text, variant = "icon", className }: Props) {
  const supported = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "fr-FR";
    utterance.rate = 0.9;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, speaking]);

  if (!supported) return null;

  const icon = (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={speak}
        aria-label={`Ssel i tmeslayt de « ${text} »`}
        title="Ssel i tmeslayt"
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-95 ${
          className ?? ""
        }`}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={speak}
      className={`btn-primary px-4 py-2.5 ${speaking ? "opacity-80" : ""} ${className ?? ""}`}
    >
      {icon}
      {speaking ? "Lecture…" : "Ssel i tmeslayt"}
    </button>
  );
}
