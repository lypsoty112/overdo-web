// The strip pinned to the top of the page: level and XP progress, streak, today's completions and focus
// minutes, the mood of the day and the procrastination index. It only renders what App hands it.
import type { Stats } from "../types";
import { MOOD_EMOJI } from "./MoodPrompt";

export function StatsBar({ stats }: { stats: Stats }) {
  const progress = Math.round((stats.xpIntoLevel / stats.xpForNextLevel) * 100);

  return (
    <header className="stats-bar">
      <span className="level">Lv {stats.level}</span>
      <span
        className="xp-track"
        role="progressbar"
        aria-label="XP to next level"
        aria-valuenow={progress}
        title={`${stats.xpIntoLevel} / ${stats.xpForNextLevel} XP`}
      >
        <span className="xp-fill" style={{ width: `${progress}%` }} />
      </span>
      <span>{stats.xp} XP</span>
      <span>🔥 {stats.streakDays}-day streak</span>
      <span>✅ {stats.completedToday} today</span>
      <span>🍅 {stats.focusMinutesToday} min</span>
      {stats.moodOfTheDay && (
        <span>
          {MOOD_EMOJI[stats.moodOfTheDay]} {stats.moodOfTheDay}
        </span>
      )}
      <span className={stats.procrastinationIndex >= 50 ? "procrastinating" : undefined}>
        Procrastination {stats.procrastinationIndex}%
      </span>
    </header>
  );
}
