import { WEDDING_DATE_ISO } from "@/lib/wedding";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function computeTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(WEDDING_DATE_ISO).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

let lastSnapshot: TimeLeft = ZERO;

export function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

/** Returns a stable reference unless the displayed values actually changed, so
 *  useSyncExternalStore doesn't re-render on every millisecond tick. */
export function getSnapshot(): TimeLeft {
  const next = computeTimeLeft();
  const changed =
    next.days !== lastSnapshot.days ||
    next.hours !== lastSnapshot.hours ||
    next.minutes !== lastSnapshot.minutes ||
    next.seconds !== lastSnapshot.seconds;
  if (changed) lastSnapshot = next;
  return lastSnapshot;
}

export function getServerSnapshot(): TimeLeft {
  return ZERO;
}
