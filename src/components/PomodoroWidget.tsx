// The floating timer for the running focus session. It counts down from the session's start plus its
// planned minutes and calls onStop itself when the time is up; the interval tick, not an effect on the
// remaining time, makes that call, so it fires once even under StrictMode's double mount.
import { useEffect, useState } from "react";
import type { Pomodoro } from "../types";

interface Props {
  session: Pomodoro;
  taskTitle: string;
  onStop: () => void;
}

export function PomodoroWidget({ session, taskTitle, onStop }: Props) {
  const endsAt = new Date(session.startedAt).getTime() + session.plannedMinutes * 60_000;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      if (Date.now() < endsAt) return;
      clearInterval(timer);
      onStop();
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt, onStop]);

  const remaining = Math.max(0, endsAt - now);
  const minutes = Math.floor(remaining / 60_000);
  const seconds = String(Math.floor(remaining / 1000) % 60).padStart(2, "0");

  return (
    <aside className="pomodoro">
      <span className="pomodoro-task">🍅 {taskTitle}</span>
      <strong>
        {minutes}:{seconds}
      </strong>
      <button type="button" onClick={onStop}>
        Stop
      </button>
    </aside>
  );
}
