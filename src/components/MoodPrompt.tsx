// The check-in that pops up after a task is completed, asking how it felt. Picking a mood logs it against
// that task and closes the prompt; × closes it without logging anything.
import * as api from "../api";
import type { Mood, Task } from "../types";

export const MOOD_EMOJI: Record<Mood, string> = {
  ecstatic: "🤩",
  fine: "🙂",
  meh: "😐",
  drained: "🫠",
  feral: "🐺",
};

interface Props {
  task: Task;
  onDone: () => void;
}

export function MoodPrompt({ task, onDone }: Props) {
  return (
    <aside className="mood-prompt">
      <p>How did “{task.title}” feel?</p>
      <div>
        {Object.entries(MOOD_EMOJI).map(([mood, emoji]) => (
          <button
            key={mood}
            type="button"
            title={mood}
            onClick={() => api.logMood(mood as Mood, task.id).then(onDone)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <button type="button" className="dismiss" aria-label="Skip the check-in" onClick={onDone}>
        ×
      </button>
    </aside>
  );
}
