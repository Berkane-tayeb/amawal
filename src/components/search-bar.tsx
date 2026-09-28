"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ALPHABET } from "@/lib/alphabet";

type Props = {
  q: string;
  letter: string;
};

type Phase = "idle" | "typing" | "navigating";

export function SearchBar({ q, letter }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = q || letter;
  const [lastInput, setLastInput] = useState(initial);
  const [value, setValue] = useState(initial);
  const [phase, setPhase] = useState<Phase>("idle");
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (initial !== lastInput) {
    setLastInput(initial);
    if (phase !== "typing") {
      setValue(initial);
      if (phase === "navigating") setPhase("idle");
    }
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function navigate(text: string) {
    startTransition(() =>
      router.replace(text ? `/?q=${encodeURIComponent(text)}` : "/", {
        scroll: false,
      }),
    );
  }

  function schedule(text: string) {
    if (timer.current) clearTimeout(timer.current);
    setPhase("typing");
    timer.current = setTimeout(() => {
      timer.current = null;
      if (text !== q) {
        setPhase("navigating");
        navigate(text);
      } else {
        setPhase("idle");
      }
    }, 300);
  }

  function flush(text: string) {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (text !== q) {
      setPhase("navigating");
      navigate(text);
    } else {
      setPhase("idle");
    }
  }

  function appendLetter(char: string) {
    const next = value + char;
    setValue(next);
    inputRef.current?.focus();
    schedule(next);
  }

  function clearAll() {
    setValue("");
    flush("");
  }

  return (
    <>
      <form
        method="GET"
        action="/"
        onSubmit={(event) => {
          event.preventDefault();
          flush(value);
        }}
        className="mt-7 flex max-w-2xl flex-col gap-2.5 sm:flex-row"
      >
        <div className="relative flex-1">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          >
            <path
              d="m19 19-3.5-3.5m1.5-4.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="search"
            name="q"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              schedule(event.target.value);
            }}
            placeholder="Nadi awal …"
            className="input py-3 pl-12 shadow-lg shadow-zinc-900/5"
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-3">
          Nadi
        </button>
      </form>

      <nav className="mt-6 flex flex-wrap gap-1.5">
        {ALPHABET.map((char) => {
          const active = value.toUpperCase().includes(char.toUpperCase());
          return (
            <Link
              key={char}
              href={`/?letter=${encodeURIComponent(char)}`}
              onClick={(event) => {
                event.preventDefault();
                appendLetter(char);
              }}
              className={
                active
                  ? "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 font-bold text-white shadow-md shadow-brand-600/30"
                  : "flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white/80 font-semibold text-zinc-600 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
              }
            >
              {char}
            </Link>
          );
        })}
        {value && (
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault();
              clearAll();
            }}
            className="ml-1 flex h-9 items-center rounded-lg px-3 text-sm font-medium text-zinc-500 underline-offset-4 transition hover:text-brand-700 hover:underline"
          >
            Tout afficher ✕
          </Link>
        )}
      </nav>
    </>
  );
}
