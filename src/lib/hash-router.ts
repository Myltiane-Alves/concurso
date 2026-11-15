"use client";

import { useMemo, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

const getSnapshot = () => window.location.hash.slice(1);
const getServerSnapshot = () => "";

export function parseHash(raw: string) {
  const [path, query = ""] = raw.split("?");
  const segments = path.split("/").filter(Boolean);
  return { path: `/${segments.join("/")}`, segments, params: new URLSearchParams(query) };
}

/** Rota atual, lida do hash da URL (ex.: /app#/concursos/123?periodo=30). */
export function useRoute() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseHash(raw), [raw]);
}

export function navigate(to: string) {
  window.location.hash = to;
}
