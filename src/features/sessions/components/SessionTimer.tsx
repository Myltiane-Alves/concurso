"use client";

import { useEffect, useState } from "react";

type Props = {
  accumulatedSeconds: number;
  lastResumedAt: Date | null;
  running: boolean;
  /** Diferença entre o relógio do servidor e o do navegador (servidor - navegador). */
  clockOffsetMs: number;
};

function calc(accumulated: number, running: boolean, resumedMs: number | null, nowMs: number) {
  if (!running || resumedMs === null) return accumulated;
  return accumulated + Math.max(0, Math.floor((nowMs - resumedMs) / 1000));
}

function format(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function SessionTimer({ accumulatedSeconds, lastResumedAt, running, clockOffsetMs }: Props) {
  const resumedMs = lastResumedAt ? new Date(lastResumedAt).getTime() : null;

  const [seconds, setSeconds] = useState(() =>
    calc(accumulatedSeconds, running, resumedMs, Date.now() + clockOffsetMs)
  );

  useEffect(() => {
    const tick = () =>
      setSeconds(calc(accumulatedSeconds, running, resumedMs, Date.now() + clockOffsetMs));

    tick();
    if (!running) return;

    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [accumulatedSeconds, resumedMs, running, clockOffsetMs]);

  return <div className="timer">{format(seconds)}</div>;
}
