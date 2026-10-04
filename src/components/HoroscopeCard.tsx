// Today's task horoscope from overdo-api, fetched once on mount and shown under the list. It renders
// nothing until the reading arrives.
import { useEffect, useState } from "react";
import * as api from "../api";
import type { Horoscope } from "../types";

export function HoroscopeCard() {
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);

  useEffect(() => {
    api.getHoroscope().then(setHoroscope);
  }, []);

  if (!horoscope) return null;
  return (
    <aside className="horoscope">
      <h2>Task horoscope · {horoscope.date}</h2>
      <p className="sign">{horoscope.sign}</p>
      <p>{horoscope.reading}</p>
      <p className="fine-print">
        Lucky priority: P{horoscope.luckyPriority} · Avoid: {horoscope.avoid}
      </p>
    </aside>
  );
}
